export type Pecas = {
  id: number;
  codigo: string;     // texto que vai dentro do QR code desta peça
  link: string;        // placeholder: troque por `imagem: "/pecas/1.png"` quando tiver as imagens reais
  pergunta: string;   // placeholder: troque pela pergunta real
  reposta: string[];   // placeholder: 4 opções
  correta: number;    // índice (0 a 3) da opção correta em `opcoes`
};