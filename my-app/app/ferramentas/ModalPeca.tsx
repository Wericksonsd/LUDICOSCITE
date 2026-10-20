'use client'

import { PECAS } from "../lib/pecas";

type Props = {
    posicao: number;
    atual: number | null;
    tabuleiro: (number | null)[];
    desbloqueadas: number[];
    onEscolher: (id: number | null) => void;
    onClose: () => void;
};

export default function ModalPeca({ posicao, atual, tabuleiro, desbloqueadas, onEscolher, onClose }: Props) {
    const pecas = PECAS.filter((p) => desbloqueadas.includes(p.id));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 px-6" onClick={onClose}>
            <div
                className="w-full max-w-sm bg-zinc-100 text-zinc-950 rounded-xs p-4 flex flex-col gap-3"
                onClick={(e) => e.stopPropagation()}
            >
                <h1 className="text-center">POSIÇÃO {posicao + 1}</h1>

                {pecas.length === 0 ? (
                    <p className="text-xs text-center">Você ainda não desbloqueou nenhuma peça. Escaneie os QR Codes do evento para liberar as pistas.</p>
                ) : (
                    <>
                        <p className="text-xs text-center">Escolha uma peça desbloqueada.</p>
                        <div className="grid grid-cols-4 gap-2">
                            {pecas.map((p) => {
                                const emOutraPosicao = tabuleiro.includes(p.id) && atual !== p.id;
                                return (
                                    <button
                                        key={p.id}
                                        onClick={() => onEscolher(p.id)}
                                        aria-label={`Peça ${p.id}`}
                                        className={`aspect-square border rounded-xs overflow-hidden ${atual === p.id ? "border-4 border-zinc-950" : "border-zinc-950"} ${emOutraPosicao ? "opacity-40" : ""}`}
                                    >
                                        <img src={p.link} alt={`Peça ${p.id}`} className="w-full h-full object-cover" />
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-[0.75rem] text-center">Peças esmaecidas já estão em outra posição; ao escolhê-las, elas são movidas para esta.</p>
                    </>
                )}

                <div className="flex gap-2">
                    {atual !== null && (
                        <button onClick={() => onEscolher(null)} className="w-full p-2 bg-orange-300 text-zinc-950 rounded-md">REMOVER PEÇA</button>
                    )}
                    <button onClick={onClose} className="w-full p-2 bg-zinc-950 text-orange-300 rounded-md">FECHAR</button>
                </div>
            </div>
        </div>
    );
}
