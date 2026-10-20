'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, RobotVacuum } from "lucide-react";
import { useState } from "react";
import ModalIntro from "./components/modalIntro";
import { useProgresso } from "./lib/useProgresso";
import { TOTAL_PECAS } from "./lib/pecas";

export default function Central () {
    const { desbloqueadas, carregado, imagemLiberada } = useProgresso();

    const [modalIntro, setModalIntro] = useState(false);

    const router = useRouter()

    const handleCloseModalIntro = () => {
        setModalIntro(modalIntro => !modalIntro);
    }

    return(
        <div className="flex-1 w-full flex flex-col items-center gap-4 px-6 pt-12 py-4">  
            <h1>PELAS BARBAS DE DON QUIXOTE</h1>      
            <div className="w-full flex-1 py-6 px-2 bg-orange-300 rounded-xs text-center text-zinc-950 flex flex-col items-center justify-center gap-1" onClick={() => router.push("/cameraQRCode")}>
                <span className="p-2 border-2 border-dashed rounded-md">
                    <Camera size={36}/>
                </span>
                <h1>ESCANEAR PISTA</h1>
                <p className="text-xs">Escaneie os QR Codes espalhados pelo evento para liberar as pistas que levarão ao tesouro.</p>
            </div>
            <div className="w-full flex gap-4">
                <Link href="/ferramentas" className="w-full bg-zinc-100 p-2 text-zinc-950 rounded-xs flex flex-col gap-1 items-center">
                    <RobotVacuum size={22}/>
                    <h1>PISTAS</h1>
                    <p className="text-[0.75rem]">{carregado ? desbloqueadas.length : 0}/{TOTAL_PECAS} Desbloqueadas</p>
                </Link>
            </div>

            {carregado && imagemLiberada && (
                <Link href="/resposta" className="w-full p-2 bg-orange-300 text-zinc-950 rounded-md text-center">IMAGEM COMPLETA</Link>
            )}

            <button onClick={handleCloseModalIntro} className="w-full p-2 bg-zinc-950 text-orange-300 rounded-md">CARTA DE INTRODUÇÃO</button>    

            {modalIntro && (
                <ModalIntro onClose={handleCloseModalIntro} />
            )}

        </div>
    )
}
