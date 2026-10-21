'use client'

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Lock } from "lucide-react";
import { IMAGEM_COMPLETA } from "../lib/pecas";
import { useProgresso } from "../lib/useProgresso";

export default function Resposta () {
    const { imagemLiberada, carregado } = useProgresso();

    return (
        <div className="flex-1 w-full flex flex-col items-center gap-4 px-6 pt-12 py-4">
            <h1>IMAGEM COMPLETA</h1>

            {!carregado ? null : imagemLiberada ? (
                <div className="w-full max-w-sm bg-amber-600 text-zinc-800 rounded-xs p-2 flex flex-col items-center gap-2 text-center">
                    {IMAGEM_COMPLETA ? (
                        <Image src={IMAGEM_COMPLETA} alt="Imagem completa" className="w-full rounded-xs border border-zinc-950" />
                    ) : (
                        <div className="w-full aspect-square border border-zinc-800 rounded-xs bg-zinc-300 flex items-center justify-center text-xs p-4">
                            Imagem completa
                        </div>
                    )}
                    <p className="text-xs">Você montou o quebra-cabeça na ordem certa!</p>
                </div>
            ) : (
                <div className="w-full max-w-sm bg-zinc-100 text-zinc-950 rounded-xs p-4 flex flex-col items-center gap-2 text-center">
                    <Lock size={28}/>
                    <p className="text-xs">Ainda bloqueada. Monte o quebra-cabeça na ordem certa para revelar a imagem.</p>
                </div>
            )}

            <Link href="/ferramentas" className="w-full p-2 bg-amber-600 text-zinc-800 rounded-md text-center">IR PARA AS PISTAS</Link>
            <Link href="/" className="w-full p-2 border-2 border-amber-600 text-zinc-200 rounded-md flex items-center justify-center gap-2">
                <ArrowLeft size={16}/> VOLTAR
            </Link>
        </div>
    );
}
