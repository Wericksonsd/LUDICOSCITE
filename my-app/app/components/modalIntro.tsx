import Image from "next/image";
interface ModalIntroProps {
  onClose: () => void;
}

export default function ModalIntro({ onClose }: ModalIntroProps) {
  return (
    <div className="h-dvh w-dvw fixed top-0 left-0 bg-zinc-950/80 z-10 p-12" >
      <div className="h-full w-full bg-amber-600 p-6 flex flex-col items-center justify-start gap-6 rounded-2xl" >
        <div className="w-full h-full flex flex-col items-center justify-center gap-6 overflow-scroll pt-30">
          <h1 className="text-center text-zinc-200 text-md font-bold">
            Ó nobre visitante, que adentra as terras de Cornélio Procópio. Faria uma festa para sua visita, caso não me tivesse ocorrido um grande infortúnio!<br/>
            Minha barba sumiu! Preciso que me ajude a encontrá-la! Não sei como nem o porquê, só sei que fiquei com esse mapa com 9 pistas. Procure 9 QR codes espalhados pelo campus para solucionar esse mistério!<br/>
            Encontre a barba, tire uma foto dela, e volte na mesa no hall para ter sua recompensa!<br/>
            A barba tem essa aparência:
          </h1>
          <div className="w-full max-w-120 min-h-60 relative">
            <Image src="/barba.png" alt="Barba" fill></Image>
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