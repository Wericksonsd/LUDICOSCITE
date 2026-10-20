'use client'

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { PECAS, TOTAL_PECAS } from "../lib/pecas";
import { useProgresso } from "../lib/useProgresso";
import ModalPeca from "./ModalPeca";

export default function Ferramentas () {
    const { desbloqueadas, tabuleiro, carregado, resolvido, imagemLiberada, colocar, reiniciar } = useProgresso();
    const [posicao, setPosicao] = useState<number | null>(null);

    const linkDaPeca = (id: number | null) =>
    id === null ? undefined : PECAS.find((p) => p.id === id)?.link;

    const handleReiniciar = () => {
        if (window.confirm("Apagar todo o progresso (pistas e quebra-cabeça)?")) reiniciar();
    };

    return (
        <div className="flex-1 w-full flex flex-col items-center gap-4 px-6 py-12">
            <h1 className="text-2xl font-bold -mb-4">PISTAS</h1>
            <p className="text-md">{carregado ? desbloqueadas.length : 0}/{TOTAL_PECAS} Desbloqueadas</p>

            <div className="w-full max-w-sm grid grid-cols-3 border border-zinc-100">
                {tabuleiro.map((id, i) => {
                    const src = linkDaPeca(id);
                    return (
                        <button
                            key={i}
                            onClick={() => setPosicao(i)}
                            aria-label={`Posição ${i + 1}`}
                            className="relative aspect-square border border-zinc-100 bg-zinc-950 overflow-hidden"
                        >
                            {src ? (
                                <Image src={src} alt={`Peça ${id}`} className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <span className="absolute inset-0 flex items-center justify-center text-zinc-100 text-xl">+</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {imagemLiberada && (
                <Link href="/resposta" className="w-full bg-orange-300 text-zinc-950 rounded-xs p-2 text-center">
                    <h1>{resolvido ? "QUEBRA-CABEÇA COMPLETO!" : "IMAGEM COMPLETA LIBERADA"}</h1>
                    <p className="text-xs">Toque para ver a imagem completa.</p>
                </Link>
            )}

            <div className="flex-1"></div>

            <Link href="/cameraQRCode" className="w-full p-2 bg-amber-600 text-zinc-200 rounded-md text-center">ESCANEAR PISTA</Link>
            <Link href="/" className="w-full p-2 border-2 border-amber-600 text-amber-600 rounded-md flex items-center justify-center gap-2">
                <ArrowLeft size={16}/> VOLTAR
            </Link>
            <button onClick={handleReiniciar} className="text-md hidden text-zinc-200">Reiniciar progresso</button>

            {posicao !== null && (
                <ModalPeca
                    posicao={posicao}
                    atual={tabuleiro[posicao]}
                    tabuleiro={tabuleiro}
                    desbloqueadas={desbloqueadas}
                    onEscolher={(id) => { colocar(posicao, id); setPosicao(null); }}
                    onClose={() => setPosicao(null)}
                />
            )}
        </div>
    );
}
