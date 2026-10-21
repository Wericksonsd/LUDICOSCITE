'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { QrCode, RobotVacuum } from "lucide-react";
import { useState } from "react";
import ModalIntro from "./components/modalIntro";
import { useProgresso } from "./lib/useProgresso";
import { TOTAL_PECAS } from "./lib/pecas";

export default function Central () {
    const { desbloqueadas, carregado, imagemLiberada } = useProgresso();

    const [modalIntro, setModalIntro] = useState(false);
    const [modalMapa, setModalMapa] = useState(false);

    const router = useRouter()

    const handleCloseModalIntro = () => {
        setModalIntro(modalIntro => !modalIntro);
    }

    const handleCloseModalMap = () => {
        setModalMapa(modalMapa => !modalMapa);
    }

    return(
        <div className="flex-1 w-full flex flex-col items-center gap-4 px-6 pt-12 py-4">  
            <h1 className="font-serif text-2xl text-center">PELAS BARBAS DE <br/><span className="font-extrabold text-4xl text-amber-600">DOM QUIXOTE</span></h1>      
            <div className="w-full flex-1 py-6 px-6 bg-amber-600 rounded-2xl text-center text-zinc-200 flex flex-col items-center justify-center gap-1" onClick={() => router.push("/cameraQRCode")}>
                <span className="p-2 border-2 border-dashed rounded-md">
                    <QrCode size={36}/>
                </span>
                <h1 className="font-bold text-lg">ESCANEAR PISTA</h1>
                <p>Escaneie os QR Codes espalhados pelo evento para liberar as pistas que levarão ao tesouro.</p>
            </div>
            <div className="w-full flex gap-4">
                <Link href="/ferramentas" className="w-full bg-zinc-100 p-2 py-8 text-zinc-950 flex flex-col gap-1 items-center rounded-2xl">
                    <RobotVacuum size={22}/>
                    <h1>PISTAS</h1>
                    <p className="text-[0.75rem]">{carregado ? desbloqueadas.length : 0}/{TOTAL_PECAS} Desbloqueadas</p>
                </Link>
            </div>

            {carregado && imagemLiberada && (
                <Link href="/resposta" className="w-full p-2 bg-orange-300 text-zinc-950 rounded-md text-center">IMAGEM COMPLETA</Link>
            )}

            <div className="w-full flex items-stretch justify-center gap-4">
                <button onClick={handleCloseModalIntro} className="w-full p-2 bg-zinc-800 text-amber-600 rounded-md textt-lg font-bold">CARTA DE INTRODUÇÃO</button>
                <button onClick={handleCloseModalMap} className="w-full p-2 bg-zinc-800 text-amber-600 rounded-md textt-lg font-bold">MAPA</button>    
            </div>
            
            {modalIntro && (
                <ModalIntro onClose={handleCloseModalIntro} />
            )}

            {modalMapa && (
                <div className="h-dvh w-dvw fixed top-0 left-0 bg-zinc-950/80 z-10 py-12 px-6 flex flex-col gap-4" >
                    <button onClick={handleCloseModalMap} className="w-6 h-6 flex items-center justify-center bg-amber-600 rounded-sm">X</button>
                    <div className="h-full w-full relative bg-zinc-200">
                        <Image src="/mapaInicio.png" alt="Mapa Cartazes" fill></Image>
                    </div>
                </div>
            )}
            

        </div>
    )
}
