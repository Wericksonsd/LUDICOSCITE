import dados from "../db/pecas.json";
import { type Pecas } from "../db/pecasType";

export const TOTAL_PECAS = 9;

export const PECAS: Pecas[] = dados.pecas.map((p) => ({
  id: p.id,
  codigo: p.codigo,
  link: p.link,
  pergunta: p.pergunta,
  reposta: p.resposta,
  correta: p.correta,
}));

export const ORDEM_CORRETA: number[] = [5, 3, 8, 1, 9, 2, 4, 6, 7];

export const IMAGEM_COMPLETA: string | null = "/mapaFinal.png";

export function verificarTabuleiro(tabuleiro: (number | null)[]): boolean {
  return (
    tabuleiro.length === TOTAL_PECAS &&
    ORDEM_CORRETA.every((id, posicao) => tabuleiro[posicao] === id)
  );
}

export function pecaPorQR(texto: string): Pecas | null {
  const lido = texto.trim().toUpperCase();
  return PECAS.find((p) => p.codigo === lido) ?? null;
}
