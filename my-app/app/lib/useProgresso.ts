'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import { TOTAL_PECAS } from "./pecas";

const CHAVE = "dq-progresso-v1";

type Progresso = {
  desbloqueadas: number[];          // ids das peças liberadas via QR
  tabuleiro: (number | null)[];     // posição -> id da peça colocada
};

const vazio = (): Progresso => ({
  desbloqueadas: [],
  tabuleiro: Array(TOTAL_PECAS).fill(null),
});

export function useProgresso() {
  const [progresso, setProgresso] = useState<Progresso>(vazio);
  const [carregado, setCarregado] = useState(false);
  const ref = useRef(progresso);
  ref.current = progresso;

  // carrega uma vez, só no navegador (evita erro de hidratação)
  useEffect(() => {
    try {
      const bruto = localStorage.getItem(CHAVE);
      if (bruto) {
        const d = JSON.parse(bruto);
        if (
          Array.isArray(d.desbloqueadas) &&
          Array.isArray(d.tabuleiro) &&
          d.tabuleiro.length === TOTAL_PECAS
        ) {
          setProgresso(d);
        }
      }
    } catch {}
    setCarregado(true);
  }, []);

  // salva a cada mudança (só depois de carregar, para não sobrescrever com vazio)
  useEffect(() => {
    if (!carregado) return;
    try {
      localStorage.setItem(CHAVE, JSON.stringify(progresso));
    } catch {}
  }, [progresso, carregado]);

  /** Libera a peça. Retorna true se era nova, false se já estava liberada. */
  const liberar = useCallback((id: number) => {
    if (ref.current.desbloqueadas.includes(id)) return false;
    setProgresso((p) => ({ ...p, desbloqueadas: [...p.desbloqueadas, id] }));
    return true;
  }, []);

  /** Coloca a peça na posição (ou limpa a posição com null). */
  const colocar = useCallback((posicao: number, id: number | null) => {
    setProgresso((p) => {
      const tabuleiro = p.tabuleiro.map((v) => (id !== null && v === id ? null : v));
      tabuleiro[posicao] = id;
      return { ...p, tabuleiro };
    });
  }, []);

  const reiniciar = useCallback(() => setProgresso(vazio()), []);

  const resolvido = progresso.tabuleiro.every((v, i) => v === i + 1);

  return { ...progresso, carregado, resolvido, liberar, colocar, reiniciar };
}
