"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import lugaresJson from "@/data/lugares.json";

export interface Lugar {
  id: string;
  nome: string;
  categoria: string;
  tipo: string;
  lat: number;
  lng: number;
  site?: string;
  instagram?: string;
  descricao?: string;
}

const LUGARES = lugaresJson.lugares as Lugar[];

/** Ordem e aparência dos filtros. A cor vira o pino no mapa. */
const CATEGORIAS: { id: string; rotulo: string; cor: string }[] = [
  { id: "praia", rotulo: "Praias", cor: "#0b6e6b" },
  { id: "falesia", rotulo: "Falésias", cor: "#c0562c" },
  { id: "atracao", rotulo: "Atrações", cor: "#b8862f" },
  { id: "hospedagem", rotulo: "Hospedagem", cor: "#3d5158" },
  { id: "camping", rotulo: "Camping", cor: "#4b7f52" },
  { id: "gastronomia", rotulo: "Comer", cor: "#8a5a8f" },
  { id: "parque", rotulo: "Praças e parques", cor: "#5b7a2e" },
];

const COR: Record<string, string> = Object.fromEntries(
  CATEGORIAS.map((c) => [c.id, c.cor])
);

export default function MapaPrado() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapaRef = useRef<LeafletMap | null>(null);
  const camadaRef = useRef<LayerGroup | null>(null);
  const [ativas, setAtivas] = useState<string[]>(() =>
    CATEGORIAS.map((c) => c.id)
  );
  const [pronto, setPronto] = useState(false);

  const visiveis = useMemo(
    () => LUGARES.filter((l) => ativas.includes(l.categoria)),
    [ativas]
  );

  // Monta o mapa uma vez. Leaflet é carregado sob demanda: só entra no
  // bundle de quem realmente chega até o mapa.
  useEffect(() => {
    let cancelado = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelado || !containerRef.current || mapaRef.current) return;

      const mapa = L.map(containerRef.current, {
        center: [-17.15, -39.32],
        zoom: 10,
        zoomControl: false,
        scrollWheelZoom: false,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 18,
        }
      ).addTo(mapa);

      L.control.zoom({ position: "bottomright" }).addTo(mapa);
      camadaRef.current = L.layerGroup().addTo(mapa);
      mapaRef.current = mapa;
      setPronto(true);
    })();

    return () => {
      cancelado = true;
      mapaRef.current?.remove();
      mapaRef.current = null;
      camadaRef.current = null;
    };
  }, []);

  // Redesenha os pinos quando o filtro muda.
  useEffect(() => {
    if (!pronto) return;
    let cancelado = false;

    (async () => {
      const L = (await import("leaflet")).default;
      const camada = camadaRef.current;
      const mapa = mapaRef.current;
      if (cancelado || !camada || !mapa) return;

      camada.clearLayers();

      visiveis.forEach((lugar) => {
        const cor = COR[lugar.categoria] ?? "#3d5158";
        const icone = L.divIcon({
          className: "",
          html: `<span style="display:block;width:14px;height:14px;border-radius:50%;background:${cor};border:2px solid #fbf6ec;box-shadow:0 1px 4px rgba(22,38,43,.45)"></span>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });

        const partes = [
          `<strong style="font-size:14px;display:block;line-height:1.3">${escapar(lugar.nome)}</strong>`,
          `<span style="font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:${cor}">${escapar(lugar.tipo)}</span>`,
        ];
        if (lugar.descricao) {
          partes.push(
            `<p style="margin:6px 0 0;font-size:12px;line-height:1.5">${escapar(lugar.descricao)}</p>`
          );
        }
        if (lugar.site) {
          partes.push(
            `<a href="${escapar(lugar.site)}" target="_blank" rel="noopener noreferrer" style="font-size:12px;display:inline-block;margin-top:6px">Site oficial</a>`
          );
        }

        L.marker([lugar.lat, lugar.lng], {
          icon: icone,
          title: lugar.nome,
        })
          .bindPopup(`<div style="min-width:170px">${partes.join("")}</div>`)
          .addTo(camada);
      });
    })();

    return () => {
      cancelado = true;
    };
  }, [visiveis, pronto]);

  function alternar(id: string) {
    setAtivas((atual) =>
      atual.includes(id) ? atual.filter((c) => c !== id) : [...atual, id]
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {CATEGORIAS.map((c) => {
          const n = LUGARES.filter((l) => l.categoria === c.id).length;
          if (!n) return null;
          const ativa = ativas.includes(c.id);
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => alternar(c.id)}
              aria-pressed={ativa}
              className={`inline-flex items-center gap-2 rounded-[4px] border px-3 py-2 text-xs font-semibold transition-colors ${
                ativa
                  ? "border-tinta bg-tinta text-areia"
                  : "border-areia-3 bg-areia text-tinta-2 hover:border-tinta-3"
              }`}
            >
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: ativa ? c.cor : "transparent",
                  boxShadow: ativa ? "none" : `inset 0 0 0 2px ${c.cor}`,
                }}
              />
              {c.rotulo}
              <span className={ativa ? "text-areia-3" : "text-tinta-3"}>{n}</span>
            </button>
          );
        })}
      </div>

      <div
        ref={containerRef}
        role="application"
        aria-label={`Mapa de Prado com ${visiveis.length} pontos`}
        className="mt-6 h-[30rem] w-full overflow-hidden rounded-[8px] border border-areia-3 bg-areia-2"
      />

      <p className="mt-3 text-xs text-tinta-3">
        {visiveis.length} de {LUGARES.length} pontos. Dados de{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="link-sub"
        >
          colaboradores do OpenStreetMap
        </a>{" "}
        (ODbL). Role a página normalmente sobre o mapa; use os controles para
        aproximar.
      </p>
    </div>
  );
}

/** Os textos vêm do OSM (conteúdo de terceiro) e entram via innerHTML do popup. */
function escapar(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
