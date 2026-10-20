'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import { TOTAL_PECAS, verificarTabuleiro } from "./pecas";

const CHAVE = "dq-progresso-v1";

type Progresso = {
  desbloqueadas: number[];          // ids das peças liberadas via QR
  tabuleiro: (number | null)[];     // posição -> id da peça colocada
  imagemLiberada: boolean;          // vira true ao montar na ordem certa e nunca volta a false
};

const vazio = (): Progresso => ({
  desbloqueadas: [],
  tabuleiro: Array(TOTAL_PECAS).fill(null),
  imagemLiberada: false,
});

const idValido = (v: unknown): v is number =>
  typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= TOTAL_PECAS;

/** Lê o que veio do localStorage e ajusta ao formato atual (aceita dados antigos). */
function normalizar(d: any): Progresso {
  const desbloqueadas: number[] = Array.isArray(d?.desbloqueadas)
    ? Array.from(new Set<number>(d.desbloqueadas.filter(idValido)))
    : [];
  const tabuleiro: (number | null)[] = Array.from({ length: TOTAL_PECAS }, (_, i) => {
    const v = Array.isArray(d?.tabuleiro) ? d.tabuleiro[i] : null;
    return idValido(v) && desbloqueadas.includes(v) ? v : null;
  });
  return { desbloqueadas, tabuleiro, imagemLiberada: d?.imagemLiberada === true };
}

export function useProgresso() {
  const [progresso, setProgresso] = useState<Progresso>(vazio);
  const [carregado, setCarregado] = useState(false);
  const ref = useRef(progresso);
  ref.current = progresso;

  // carrega uma vez, só no navegador (evita erro de hidratação)
  useEffect(() => {
    try {
      const bruto = localStorage.getItem(CHAVE);
      if (bruto) setProgresso(normalizar(JSON.parse(bruto)));
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

  // o tabuleiro está na ordem certa neste momento?
  const resolvido = verificarTabuleiro(progresso.tabuleiro);

  // ao acertar, a imagem completa é liberada de forma permanente (fica salva)
  useEffect(() => {
    if (carregado && resolvido && !progresso.imagemLiberada) {
      setProgresso((p) => ({ ...p, imagemLiberada: true }));
    }
  }, [carregado, resolvido, progresso.imagemLiberada]);

  return { ...progresso, carregado, resolvido, liberar, colocar, reiniciar };
}
