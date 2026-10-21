import Image from "next/image";
interface ModalIntroProps {
  onClose: () => void;
}

export default function ModalIntro({ onClose }: ModalIntroProps) {
  return (
    <div className="h-dvh w-dvw fixed top-0 left-0 bg-zinc-950/80 z-10 p-12" >
      <div className="h-full w-full bg-amber-600 p-6 flex flex-col items-center justify-center gap-6 rounded-2xl" >
        <div className="w-full flex flex-col items-center justify-center gap-6 overflow-scroll">
          <h1 className="text-center text-zinc-200 text-md font-bold">
            Boas vindas a Caça à Barba de Dom Quixote, utilize o mapa abaixo e navegue pelo Campus atrás dos cartazes do projeto que contém QR-Code, escaneie e reposnda a pergunta, assim liberando uma peça. Após coletar todas as peças, monte o quebra-cabeça e libere o mapa final, para assim encontrar a barba e registrar esse momento.<br /><br />
            Boa sorte, divirta-se.
          </h1>
          <div className="w-full h-80 bg-amber-900 relative">
            <Image src="/mapaInicio.png" alt="Mapa Cartazes" fill></Image>
          </div>
        </div>
        <button onClick={onClose}
        className="px-4 py-2 bg-zinc-800 text-amber-600 rounded-md">
            ENTENDIDO
        </button>
      </div>
    </div>
  );
}