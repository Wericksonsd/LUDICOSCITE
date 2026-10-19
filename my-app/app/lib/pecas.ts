export const TOTAL_PECAS = 12;

export type Peca = {
  id: number;
  cor: string; // placeholder: troque por `imagem: "/pecas/1.png"` quando tiver as imagens reais
};

export const PECAS: Peca[] = Array.from({ length: TOTAL_PECAS }, (_, i) => ({
  id: i + 1,
  cor: `hsl(${i * 30} 70% 55%)`,
}));

/**
 * O QR code deve conter o texto "pista-1" até "pista-12".
 * Retorna a peça correspondente ou null se o QR não for válido.
 */
export function pecaPorQR(texto: string): Peca | null {
  const m = texto.trim().toLowerCase().match(/^pista-(\d{1,2})$/);
  if (!m) return null;
  const id = Number(m[1]);
  return PECAS.find((p) => p.id === id) ?? null;
}
