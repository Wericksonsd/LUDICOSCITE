import Image from "next/image";
interface ModalIntroProps {
  onClose: () => void;
}

export default function ModalIntro({ onClose }: ModalIntroProps) {
  return (
    <div className="h-dvh w-dvw fixed top-0 left-0 bg-zinc-950/80 z-10 p-12" >
      <div className="h-full w-full bg-amber-600 p-6 flex flex-col items-center justify-center gap-6 rounded-2xl" >
        <h1 className="text-center text-zinc-200 text-md font-bold">
          Boas vindas a Caça à Barba de Dom Quixote, navegue pelo Campus atrás dos cartazes do projeto que contém QR-Code, escaneie e reposnda a pergunta, assim liberando uma peça, ao montar o quebra-cabeça, libere o mapa final e b
          Caso erre o fantasma terá um espaço de tempo para tentar novamente, e após outra falha, sua missão será dada como fracasso.<br /><br />
          Boa sorte, divirta-se.
        </h1>
        <div className="w-full h-80 bg-amber-900 relative">
          <Image src="/images.jpg" alt="Mapa Cartazes" fill></Image>
        </div>
        <button onClick={onClose}
        className="px-4 py-2 bg-zinc-800 text-amber-600 rounded-md">
            ENTENDIDO
        </button>
      </div>
    </div>
  );
}