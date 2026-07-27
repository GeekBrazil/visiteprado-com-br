"use client";

import { useEffect, useRef, useState } from "react";

interface RevelarProps {
  children: React.ReactNode;
  /** Atraso em ms para escalonar itens de uma mesma linha. */
  atraso?: number;
  className?: string;
}

/**
 * Revela o conteúdo uma única vez quando ele entra na viewport.
 * Quem pede movimento reduzido recebe o conteúdo já visível (ver globals.css).
 */
export default function Revelar({
  children,
  atraso = 0,
  className = "",
}: RevelarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const alvo = ref.current;
    if (!alvo) return;

    // Sem suporte a IntersectionObserver: mostra o conteúdo direto,
    // fora do corpo do efeito para não encadear renders.
    if (typeof IntersectionObserver === "undefined") {
      const t = setTimeout(() => setVisivel(true), 0);
      return () => clearTimeout(t);
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true);
          observador.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    observador.observe(alvo);
    return () => observador.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`revelar ${visivel ? "visivel" : ""} ${className}`}
      style={atraso ? { transitionDelay: `${atraso}ms` } : undefined}
    >
      {children}
    </div>
  );
}
