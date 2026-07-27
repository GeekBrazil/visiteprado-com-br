#!/usr/bin/env python3
"""
ETL — OpenStreetMap -> src/data/lugares.json

Extrai praias, falésias, hospedagem, atrações e gastronomia do município de
Prado/BA via Overpass API.

  python3 scripts/etl-lugares.py

Por que OSM e não Cadastur
--------------------------
O Cadastur serve para AGREGADOS (ver etl-cadastur.py) porque suas planilhas
carregam dado pessoal. O OSM traz estabelecimentos comerciais com nome e
coordenada — informação pública de negócio, própria para mapa e listagem.

Licença: ODbL. A atribuição "© colaboradores do OpenStreetMap" é obrigatória
e já está no rodapé do mapa.
"""

from __future__ import annotations

import json
import re
import sys
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SAIDA = RAIZ / "src" / "data" / "lugares.json"

ESPELHOS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
]

# Relação OSM do município de Prado/BA, resolvida via Nominatim.
# Buscar por nome traz "Prado" da Colômbia, da Espanha e povoados homônimos da
# própria Bahia — o id fixo é a única forma segura. area = 3600000000 + rel_id.
REL_PRADO_BA = 362298
AREA_PRADO_BA = 3600000000 + REL_PRADO_BA

CONSULTA = f"""
[out:json][timeout:120];
area({AREA_PRADO_BA})->.a;
(
  node(area.a)["tourism"];
  way(area.a)["tourism"];
  node(area.a)["amenity"~"^(restaurant|bar|cafe)$"];
  way(area.a)["amenity"~"^(restaurant|bar|cafe)$"];
  node(area.a)["leisure"~"^(park|beach_resort|nature_reserve)$"];
  way(area.a)["leisure"~"^(park|beach_resort|nature_reserve)$"];
  node(area.a)["natural"~"^(beach|cliff|waterfall|spring)$"];
  way(area.a)["natural"~"^(beach|cliff|waterfall|spring)$"];
);
out center tags;
"""

# tag OSM -> (categoria no site, rótulo legível)
CLASSES: dict[str, tuple[str, str]] = {
    "tourism=hotel": ("hospedagem", "Hotel"),
    "tourism=guest_house": ("hospedagem", "Pousada"),
    "tourism=hostel": ("hospedagem", "Hostel"),
    "tourism=apartment": ("hospedagem", "Apartamento"),
    "tourism=chalet": ("hospedagem", "Chalé"),
    "tourism=camp_site": ("camping", "Camping"),
    "tourism=caravan_site": ("camping", "Área de motorhome"),
    "tourism=attraction": ("atracao", "Atração"),
    "tourism=viewpoint": ("atracao", "Mirante"),
    "tourism=museum": ("atracao", "Museu"),
    "tourism=artwork": ("atracao", "Arte pública"),
    "tourism=picnic_site": ("atracao", "Área de piquenique"),
    "tourism=information": ("servico", "Informação turística"),
    "amenity=restaurant": ("gastronomia", "Restaurante"),
    "amenity=bar": ("gastronomia", "Bar"),
    "amenity=cafe": ("gastronomia", "Café"),
    "natural=beach": ("praia", "Praia"),
    "natural=cliff": ("falesia", "Falésia"),
    "natural=waterfall": ("atracao", "Cachoeira"),
    "natural=spring": ("atracao", "Nascente"),
    "leisure=park": ("parque", "Parque"),
    "leisure=nature_reserve": ("parque", "Reserva natural"),
    "leisure=beach_resort": ("praia", "Estrutura de praia"),
}


def consultar() -> dict:
    corpo = CONSULTA.encode("utf-8")
    erro: Exception | None = None
    for espelho in ESPELHOS:
        for tentativa in (1, 2):
            try:
                req = urllib.request.Request(
                    espelho,
                    data=corpo,
                    headers={
                        "User-Agent": "visiteprado.com.br/1.0 (ETL de lugares)",
                        "Content-Type": "text/plain; charset=utf-8",
                    },
                )
                with urllib.request.urlopen(req, timeout=180) as r:
                    return json.loads(r.read())
            except Exception as e:
                erro = e
                print(f"   {espelho} tentativa {tentativa}: {e}", file=sys.stderr)
                time.sleep(5 * tentativa)
    raise RuntimeError(f"Overpass indisponível: {erro}")


def chave(s: str) -> str:
    sem = "".join(
        c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn"
    )
    return re.sub(r"[^a-z0-9]+", "-", sem.lower()).strip("-")


def coordenadas(el: dict) -> tuple[float, float] | None:
    if "lat" in el and "lon" in el:
        return el["lat"], el["lon"]
    centro = el.get("center")
    if centro:
        return centro["lat"], centro["lon"]
    return None


def classificar(tags: dict) -> tuple[str, str] | None:
    for k in ("tourism", "amenity", "natural", "leisure"):
        if k in tags:
            achado = CLASSES.get(f"{k}={tags[k]}")
            if achado:
                return achado
    return None


def main() -> int:
    print("-> consultando Overpass (OpenStreetMap)", file=sys.stderr)
    bruto = consultar()
    elementos = bruto.get("elements", [])
    print(f"   {len(elementos)} elementos recebidos", file=sys.stderr)

    lugares: dict[str, dict] = {}
    sem_nome = 0

    for el in elementos:
        tags = el.get("tags") or {}
        nome = (tags.get("name") or "").strip()
        if not nome:
            sem_nome += 1
            continue

        classe = classificar(tags)
        if not classe:
            continue
        categoria, rotulo = classe

        coord = coordenadas(el)
        if not coord:
            continue
        lat, lng = coord

        # Deduplica por nome + categoria (OSM às vezes traz node e way do mesmo lugar).
        id_ = f"{categoria}:{chave(nome)}"
        if id_ in lugares:
            continue

        registro = {
            "id": id_,
            "nome": nome,
            "categoria": categoria,
            "tipo": rotulo,
            "lat": round(lat, 6),
            "lng": round(lng, 6),
        }
        site = tags.get("website") or tags.get("contact:website")
        if site:
            registro["site"] = site
        insta = tags.get("contact:instagram") or tags.get("instagram")
        if insta:
            registro["instagram"] = insta
        if tags.get("description"):
            registro["descricao"] = tags["description"].strip()

        lugares[id_] = registro

    lista = sorted(lugares.values(), key=lambda x: (x["categoria"], x["nome"]))
    if not lista:
        print("Nenhum lugar coletado — arquivo NÃO foi sobrescrito.", file=sys.stderr)
        return 1

    por_categoria: dict[str, int] = {}
    for l in lista:
        por_categoria[l["categoria"]] = por_categoria.get(l["categoria"], 0) + 1

    saida = {
        "fonte": "OpenStreetMap",
        "licenca": "ODbL — © colaboradores do OpenStreetMap",
        "url": "https://www.openstreetmap.org/copyright",
        "municipio": "Prado",
        "uf": "BA",
        "geradoEm": time.strftime("%Y-%m-%d"),
        "totais": por_categoria,
        "lugares": lista,
    }

    SAIDA.parent.mkdir(parents=True, exist_ok=True)
    SAIDA.write_text(json.dumps(saida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"   {sem_nome} elementos sem nome descartados", file=sys.stderr)
    for cat, n in sorted(por_categoria.items()):
        print(f"   {cat}: {n}", file=sys.stderr)
    print(f"\nGravado: {SAIDA.relative_to(RAIZ)} ({len(lista)} lugares)", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
