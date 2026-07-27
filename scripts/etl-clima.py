#!/usr/bin/env python3
"""
ETL — Open-Meteo -> src/data/clima.json

Calcula a climatologia mensal de Prado/BA a partir de dados históricos
reais (reanálise ERA5), para responder "quando ir" com número em vez de
achismo.

  python3 scripts/etl-clima.py

Por que pré-calcular
--------------------
O site é estático. Consultar a API a cada visita criaria dependência de
terceiro em tempo de execução e risco de limite de requisição. Aqui a
média é calculada uma vez e vira JSON; roda de novo quando quiser.

Fonte: Open-Meteo (https://open-meteo.com), dados ERA5. Uso livre com
atribuição para volume não comercial — checar os termos se o tráfego
crescer muito.
"""

from __future__ import annotations

import json
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SAIDA = RAIZ / "src" / "data" / "clima.json"

# Sede de Prado/BA
LAT, LON = -17.3411, -39.2214

ANO_INI, ANO_FIM = 2015, 2025

MESES = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
]


def baixar(url: str, tentativas: int = 3) -> dict:
    erro: Exception | None = None
    for n in range(1, tentativas + 1):
        try:
            req = urllib.request.Request(
                url, headers={"User-Agent": "visiteprado.com.br/1.0 (ETL de clima)"}
            )
            with urllib.request.urlopen(req, timeout=120) as r:
                return json.loads(r.read())
        except Exception as e:
            erro = e
            if n < tentativas:
                print(f"   tentativa {n} falhou ({e}); repetindo", file=sys.stderr)
                time.sleep(4 * n)
    raise RuntimeError(f"falha após {tentativas} tentativas: {erro}")


def main() -> int:
    parametros = {
        "latitude": LAT,
        "longitude": LON,
        "start_date": f"{ANO_INI}-01-01",
        "end_date": f"{ANO_FIM}-12-31",
        "daily": ",".join([
            "temperature_2m_max",
            "temperature_2m_min",
            "precipitation_sum",
            "precipitation_hours",
        ]),
        "timezone": "America/Bahia",
    }
    url = "https://archive-api.open-meteo.com/v1/archive?" + urllib.parse.urlencode(parametros)

    print(f"-> Open-Meteo ERA5, {ANO_INI}–{ANO_FIM}", file=sys.stderr)
    dados = baixar(url)
    diario = dados.get("daily") or {}
    datas = diario.get("time") or []
    if not datas:
        print("Sem dados retornados — arquivo NÃO foi sobrescrito.", file=sys.stderr)
        return 1
    print(f"   {len(datas)} dias recebidos", file=sys.stderr)

    tmax = diario.get("temperature_2m_max") or []
    tmin = diario.get("temperature_2m_min") or []
    chuva = diario.get("precipitation_sum") or []
    horas = diario.get("precipitation_hours") or []

    # Acumula por mês
    acc: dict[int, dict[str, list]] = {m: {"tmax": [], "tmin": [], "chuva": [], "dias_chuva": 0, "dias": 0} for m in range(1, 13)}
    chuva_por_mes_ano: dict[tuple[int, int], float] = {}

    for i, d in enumerate(datas):
        ano, mes = int(d[:4]), int(d[5:7])
        a = acc[mes]
        if i < len(tmax) and tmax[i] is not None:
            a["tmax"].append(tmax[i])
        if i < len(tmin) and tmin[i] is not None:
            a["tmin"].append(tmin[i])
        if i < len(chuva) and chuva[i] is not None:
            a["chuva"].append(chuva[i])
            chuva_por_mes_ano[(ano, mes)] = chuva_por_mes_ano.get((ano, mes), 0.0) + chuva[i]
        # "dia de chuva" = pelo menos 1 mm acumulado
        if i < len(chuva) and (chuva[i] or 0) >= 1.0:
            a["dias_chuva"] += 1
        a["dias"] += 1

    anos = ANO_FIM - ANO_INI + 1
    meses_saida = []
    for m in range(1, 13):
        a = acc[m]
        if not a["tmax"]:
            continue
        # Média do total mensal de chuva ao longo dos anos
        totais = [v for (ano, mes), v in chuva_por_mes_ano.items() if mes == m]
        meses_saida.append({
            "mes": m,
            "nome": MESES[m - 1],
            "tempMax": round(sum(a["tmax"]) / len(a["tmax"]), 1),
            "tempMin": round(sum(a["tmin"]) / len(a["tmin"]), 1),
            "chuvaMm": round(sum(totais) / len(totais)) if totais else 0,
            "diasComChuva": round(a["dias_chuva"] / anos),
        })

    if not meses_saida:
        print("Nada agregado — arquivo NÃO foi sobrescrito.", file=sys.stderr)
        return 1

    saida = {
        "fonte": "Open-Meteo (reanálise ERA5)",
        "url": "https://open-meteo.com",
        "local": "Prado, BA",
        "latitude": LAT,
        "longitude": LON,
        "periodo": f"{ANO_INI}–{ANO_FIM}",
        "geradoEm": time.strftime("%Y-%m-%d"),
        "meses": meses_saida,
    }

    SAIDA.parent.mkdir(parents=True, exist_ok=True)
    SAIDA.write_text(json.dumps(saida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"\nGravado: {SAIDA.relative_to(RAIZ)}", file=sys.stderr)
    for m in meses_saida:
        print(f"   {m['nome']:10s} {m['tempMin']:.0f}–{m['tempMax']:.0f}°C  "
              f"{m['chuvaMm']:>4} mm  {m['diasComChuva']:>2} dias de chuva", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
