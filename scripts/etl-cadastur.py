#!/usr/bin/env python3
"""
ETL — Cadastur / Ministério do Turismo -> src/data/oficial.json

Lê as planilhas oficiais de prestadores de serviços turísticos e extrai
APENAS AGREGADOS do município de Prado/BA.

  python3 scripts/etl-cadastur.py              # trimestre mais recente
  python3 scripts/etl-cadastur.py --historico  # + série histórica anual

Por que só agregado
-------------------
As planilhas contêm CPF, nome completo, telefone e e-mail pessoal dos
cadastrados. Republicar isso seria tratamento de dado pessoal sem base
legal (LGPD). Este script conta e soma; nunca grava identificação.

Sem dependências: XLSX é ZIP + XML, lido com a biblioteca padrão.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
import unicodedata
import urllib.request
import xml.etree.ElementTree as ET
import zipfile
from collections import Counter
from datetime import date, timezone, datetime
from io import BytesIO
from pathlib import Path

NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
CKAN = "https://dados.turismo.gov.br/api/3/action/package_show?id="
RAIZ = Path(__file__).resolve().parent.parent
SAIDA = RAIZ / "src" / "data" / "oficial.json"

UF_ALVO = "BA"
MUNICIPIO_ALVO = "PRADO"

CONJUNTOS = {
    "hospedagem": "meios-de-hospedagem",
    "agencias": "agencia-de-turismo",
    "transportadoras": "transportadora-turistica",
    "guias": "prestadores-de-servicos-turisticos-guia-turismo_2",
}


# --------------------------------------------------------------------------
# Leitura de XLSX com biblioteca padrão
# --------------------------------------------------------------------------

def _indice_coluna(ref: str) -> int:
    letras = re.match(r"([A-Z]+)", ref or "A").group(1)
    n = 0
    for ch in letras:
        n = n * 26 + ord(ch) - 64
    return n - 1


def _abas(z: zipfile.ZipFile) -> list[str]:
    """Caminhos de todas as abas, em ordem numérica.

    A planilha de guias, por exemplo, separa pessoa jurídica e pessoa física
    em abas distintas — ler só a primeira perderia metade dos registros.
    """
    nomes = [n for n in z.namelist() if re.match(r"xl/worksheets/sheet\d+\.xml$", n)]
    return sorted(nomes, key=lambda n: int(re.search(r"(\d+)", n).group(1)))


def ler_planilha(dados: bytes):
    """Gera (aba, linha) para todas as abas, sem carregar tudo na memória."""
    with zipfile.ZipFile(BytesIO(dados)) as z:
        compartilhadas: list[str] = []
        if "xl/sharedStrings.xml" in z.namelist():
            raiz = ET.fromstring(z.read("xl/sharedStrings.xml"))
            for si in raiz.findall(f"{NS}si"):
                compartilhadas.append("".join(t.text or "" for t in si.iter(f"{NS}t")))

        abas = _abas(z)
        if not abas:
            raise RuntimeError("XLSX sem planilha reconhecível")

        for aba in abas:
            with z.open(aba) as fh:
                for _, el in ET.iterparse(fh, events=("end",)):
                    if el.tag != f"{NS}row":
                        continue
                    celulas: dict[int, str | None] = {}
                    for c in el.findall(f"{NS}c"):
                        tipo = c.get("t")
                        v = c.find(f"{NS}v")
                        if tipo == "inlineStr":
                            valor = "".join(x.text or "" for x in c.iter(f"{NS}t"))
                        elif v is None:
                            valor = None
                        elif tipo == "s":
                            valor = compartilhadas[int(v.text)]
                        else:
                            valor = v.text
                        celulas[_indice_coluna(c.get("r"))] = valor
                    linha = [celulas.get(i) for i in range(max(celulas) + 1)] if celulas else []
                    yield aba, linha
                    el.clear()


# --------------------------------------------------------------------------
# Utilidades
# --------------------------------------------------------------------------

def normalizar(s) -> str:
    txt = str(s or "")
    sem_acento = "".join(
        c for c in unicodedata.normalize("NFD", txt) if unicodedata.category(c) != "Mn"
    )
    return sem_acento.upper().strip()


def inteiro(v) -> int:
    try:
        return int(float(v))
    except (TypeError, ValueError):
        return 0


def baixar(url: str, tentativas: int = 3) -> bytes:
    """Baixa com retry — as planilhas passam de 19 MB e a conexão cai às vezes."""
    erro: Exception | None = None
    for n in range(1, tentativas + 1):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "visiteprado-etl/1.0"})
            with urllib.request.urlopen(req, timeout=180) as r:
                return r.read()
        except Exception as e:
            erro = e
            if n < tentativas:
                espera = 3 * n
                print(f"   tentativa {n} falhou ({e}); repetindo em {espera}s", file=sys.stderr)
                time.sleep(espera)
    raise RuntimeError(f"falha após {tentativas} tentativas: {erro}")


def recursos(conjunto: str) -> list[dict]:
    """Lista os recursos XLSX de um conjunto, do mais antigo ao mais recente."""
    bruto = baixar(CKAN + conjunto)
    resultado = json.loads(bruto).get("result") or {}
    return [
        r for r in resultado.get("resources", [])
        if (r.get("format") or "").upper() == "XLSX" and r.get("url")
    ]


# --------------------------------------------------------------------------
# Agregação
# --------------------------------------------------------------------------

def agregar(dados: bytes) -> dict:
    total = 0
    tipos: Counter[str] = Counter()
    situacoes: Counter[str] = Counter()
    leitos = uhs = leitos_ac = uhs_ac = 0

    aba_atual: str | None = None
    col: dict[str, int] = {}
    i_uf = i_mun = None
    limite = 0

    for aba, linha in ler_planilha(dados):
        # Primeira linha de cada aba é o cabeçalho daquela aba.
        if aba != aba_atual:
            aba_atual = aba
            col = {str(h or "").strip(): i for i, h in enumerate(linha)}
            i_uf, i_mun = col.get("UF"), col.get("Município")
            limite = max(i_uf, i_mun) if (i_uf is not None and i_mun is not None) else 0
            continue

        if i_uf is None or i_mun is None or len(linha) <= limite:
            continue
        if normalizar(linha[i_uf]) != UF_ALVO:
            continue
        if normalizar(linha[i_mun]) != MUNICIPIO_ALVO:
            continue

        total += 1

        def celula(nome: str):
            i = col.get(nome)
            return linha[i] if i is not None and len(linha) > i else None

        if (v := celula("Situação Cadastral")):
            situacoes[str(v).strip()] += 1
        if (v := celula("Tipo de Hospedagem")):
            tipos[str(v).strip()] += 1
        leitos += inteiro(celula("Leitos"))
        uhs += inteiro(celula("Unidade Habitacionais"))
        leitos_ac += inteiro(celula("Leitos Acessíveis"))
        uhs_ac += inteiro(celula("UHs Acessíveis"))

    saida: dict = {"total": total}
    if situacoes:
        saida["situacoes"] = dict(situacoes)
    if tipos:
        saida["tipos"] = dict(tipos.most_common())
    if leitos:
        saida["leitos"] = leitos
    if uhs:
        saida["unidadesHabitacionais"] = uhs
    if leitos_ac:
        saida["leitosAcessiveis"] = leitos_ac
    if uhs_ac:
        saida["uhsAcessiveis"] = uhs_ac
    return saida


# --------------------------------------------------------------------------
# Execução
# --------------------------------------------------------------------------

def main() -> int:
    ap = argparse.ArgumentParser(description="Agrega dados do Cadastur para Prado/BA")
    ap.add_argument("--historico", action="store_true",
                    help="inclui série histórica anual (CUIDADO: ver aviso abaixo)")
    args = ap.parse_args()

    resultado: dict = {
        "fonte": "Cadastur — Ministério do Turismo",
        "url": "https://dados.turismo.gov.br",
        "municipio": "Prado",
        "uf": "BA",
        "codigoIbge": "2925501",
        "geradoEm": datetime.now(timezone.utc).date().isoformat(),
        "categorias": {},
    }

    for chave, conjunto in CONJUNTOS.items():
        print(f"-> {chave} ({conjunto})", file=sys.stderr)
        try:
            lista = recursos(conjunto)
            if not lista:
                print(f"   sem recurso XLSX; pulando", file=sys.stderr)
                continue
            recurso = lista[-1]
            agregado = agregar(baixar(recurso["url"]))
            if not agregado:
                print(f"   planilha sem colunas esperadas; pulando", file=sys.stderr)
                continue
            agregado["referencia"] = recurso.get("name")
            resultado["categorias"][chave] = agregado
            print(f"   {agregado['total']} registro(s) — {recurso.get('name')}", file=sys.stderr)
        except Exception as e:  # rede, formato, indisponibilidade
            print(f"   FALHOU: {e}", file=sys.stderr)

    if args.historico:
        print("-> série histórica (hospedagem, 1 ponto por ano)", file=sys.stderr)
        print("   AVISO: a série mede CADASTROS REGULARES, não capacidade real.", file=sys.stderr)
        print("   A alta recente reflete formalização e ciclo de renovação de", file=sys.stderr)
        print("   certificado — não construção de novos meios de hospedagem.", file=sys.stderr)
        print("   Não publicar como 'crescimento da rede hoteleira'.", file=sys.stderr)
        serie = []
        try:
            lista = recursos(CONJUNTOS["hospedagem"])
            vistos: set[str] = set()
            # Um recurso por ano: o último de cada ano encontrado no nome.
            por_ano: dict[str, dict] = {}
            for r in lista:
                m = re.search(r"(20\d{2})", r.get("name") or "")
                if m:
                    por_ano[m.group(1)] = r
            for ano in sorted(por_ano):
                if ano in vistos:
                    continue
                vistos.add(ano)
                try:
                    ag = agregar(baixar(por_ano[ano]["url"]))
                    if ag.get("total"):
                        serie.append({
                            "ano": int(ano),
                            "estabelecimentos": ag["total"],
                            "leitos": ag.get("leitos", 0),
                        })
                        print(f"   {ano}: {ag['total']} estabelecimentos", file=sys.stderr)
                except Exception as e:
                    print(f"   {ano} falhou: {e}", file=sys.stderr)
        except Exception as e:
            print(f"   FALHOU: {e}", file=sys.stderr)
        if serie:
            resultado["serieHistorica"] = serie

    if not resultado["categorias"]:
        print("\nNenhuma categoria coletada — arquivo NÃO foi sobrescrito.", file=sys.stderr)
        return 1

    # Falha parcial (rede, indisponibilidade) não pode apagar uma categoria que
    # já existia: preserva o valor anterior e avisa que ele está desatualizado.
    faltando = [c for c in CONJUNTOS if c not in resultado["categorias"]]
    if faltando and SAIDA.exists():
        try:
            anterior = json.loads(SAIDA.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            anterior = {}
        preservadas = []
        for chave in faltando:
            antiga = (anterior.get("categorias") or {}).get(chave)
            if antiga:
                antiga["desatualizado"] = True
                resultado["categorias"][chave] = antiga
                preservadas.append(chave)
        if preservadas:
            print(
                f"\nAVISO: {', '.join(preservadas)} não foi coletado agora; "
                "mantido o valor da execução anterior.",
                file=sys.stderr,
            )

    ainda_faltando = [c for c in CONJUNTOS if c not in resultado["categorias"]]
    if ainda_faltando:
        print(f"AVISO: sem dado para {', '.join(ainda_faltando)}.", file=sys.stderr)

    # Ordena conforme CONJUNTOS para o arquivo não embaralhar entre execuções.
    resultado["categorias"] = {
        c: resultado["categorias"][c] for c in CONJUNTOS if c in resultado["categorias"]
    }

    SAIDA.parent.mkdir(parents=True, exist_ok=True)
    SAIDA.write_text(
        json.dumps(resultado, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"\nGravado: {SAIDA.relative_to(RAIZ)}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
