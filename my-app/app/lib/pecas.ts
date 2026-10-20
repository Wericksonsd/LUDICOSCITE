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

/**
 * Ordem correta de montagem (não sequencial).
 * O índice é a posição no quadro (0 = 1ª casa, canto superior esquerdo,
 * lendo da esquerda para a direita, de cima para baixo)
 * e o valor é o id da peça que deve estar ali.
 * Deve conter cada número de 1 a 9 exatamente uma vez.
 */
export const ORDEM_CORRETA: number[] = [5, 3, 8, 1, 9, 2, 4, 6, 7];

/** Imagem completa liberada ao acertar a ordem. Ex.: "/resposta.png" (arquivo em /public). */
export const IMAGEM_COMPLETA: string | null = null;

/** true se TODAS as casas estão preenchidas com a peça certa. */
export function verificarTabuleiro(tabuleiro: (number | null)[]): boolean {
  return (
    tabuleiro.length === TOTAL_PECAS &&
    ORDEM_CORRETA.every((id, posicao) => tabuleiro[posicao] === id)
  );
}

/** Retorna a peça cujo código bate com o texto lido no QR, ou null se for inválido. */
export function pecaPorQR(texto: string): Pecas | null {
  const lido = texto.trim().toUpperCase();
  return PECAS.find((p) => p.codigo === lido) ?? null;
}
