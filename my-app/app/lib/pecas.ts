export const TOTAL_PECAS = 12;

export type Peca = {
  id: number;
  codigo: string;     // texto que vai dentro do QR code desta peça
  cor: string;        // placeholder: troque por `imagem: "/pecas/1.png"` quando tiver as imagens reais
  pergunta: string;   // placeholder: troque pela pergunta real
  opcoes: string[];   // placeholder: 4 opções
  correta: number;    // índice (0 a 3) da opção correta em `opcoes`
};

// Códigos aleatórios (um por peça). Gere os QR codes com ESTES textos.
// Para trocar, basta editar a lista: o resto do sistema usa só `codigo`.
const CODIGOS = [
  "6Q49XZ45WM",
  "9Y3Q2LWPUR",
  "WKGXT7F359",
  "3BZ2L8NS6M",
  "82QL848MDF",
  "2CTUQQJRC7",
  "XA3CKJGT78",
  "C4X573FW6H",
  "GM8894JZNU",
  "YZ5YEMHYAZ",
  "KV3ZYH873R",
  "7J2X2L5QE9",
];

export const PECAS: Peca[] = CODIGOS.map((codigo, i) => ({
  id: i + 1,
  codigo,
  cor: `hsl(${i * 30} 70% 55%)`,
  pergunta: `Pergunta ${i + 1}: substitua por uma pergunta real.`,
  opcoes: ["Opção A", "Opção B", "Opção C", "Opção D"],
  correta: 0,
}));

/** Retorna a peça cujo código bate com o texto lido no QR, ou null se for inválido. */
export function pecaPorQR(texto: string): Peca | null {
  const lido = texto.trim().toUpperCase();
  return PECAS.find((p) => p.codigo === lido) ?? null;
}
