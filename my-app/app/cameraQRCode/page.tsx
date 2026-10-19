'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Camera } from "lucide-react";
import { pecaPorQR, type Peca } from "../lib/pecas";
import { useProgresso } from "../lib/useProgresso";

type Resultado =
    | { tipo: "pergunta"; peca: Peca }
    | { tipo: "nova"; peca: Peca }
    | { tipo: "repetida"; peca: Peca }
    | { tipo: "invalida" };

export default function CameraQRCode () {
    const router = useRouter();
    const { liberar, desbloqueadas, carregado } = useProgresso();

    const [resultado, setResultado] = useState<Resultado | null>(null);
    const [erradas, setErradas] = useState<number[]>([]);
    const [erro, setErro] = useState<string | null>(null);

    // evita processar o mesmo QR várias vezes enquanto o painel está na tela
    const travado = useRef(false);
    const liberarRef = useRef(liberar);
    liberarRef.current = liberar;
    // sempre aponta para o progresso mais recente (o scanner é criado uma vez só)
    const desbloqueadasRef = useRef(desbloqueadas);
    desbloqueadasRef.current = desbloqueadas;
    const carregadoRef = useRef(carregado);
    carregadoRef.current = carregado;

    useEffect(() => {
        let scanner: import("html5-qrcode").Html5Qrcode | null = null;
        let cancelado = false;

        const aoLer = (texto: string) => {
            if (travado.current || !carregadoRef.current) return;
            travado.current = true;

            const peca = pecaPorQR(texto);
            if (!peca) {
                setResultado({ tipo: "invalida" });
                return;
            }
            if (desbloqueadasRef.current.includes(peca.id)) {
                setResultado({ tipo: "repetida", peca });
                return;
            }
            setErradas([]);
            setResultado({ tipo: "pergunta", peca });
        };

        (async () => {
            const { Html5Qrcode } = await import("html5-qrcode");
            if (cancelado) return;
            scanner = new Html5Qrcode("leitor-qr");
            try {
                await scanner.start(
                    { facingMode: "environment" },
                    { fps: 10, qrbox: { width: 240, height: 240 } },
                    aoLer,
                    () => {}
                );
            } catch {
                setErro("Não foi possível acessar a câmera. Permita o acesso nas configurações do navegador e tente de novo.");
            }
        })();

        return () => {
            cancelado = true;
            if (scanner?.isScanning) {
                scanner.stop().then(() => scanner?.clear()).catch(() => {});
            }
        };
    }, []);

    const escanearOutra = () => {
        setResultado(null);
        setErradas([]);
        travado.current = false;
    };

    const responder = (peca: Peca, indice: number) => {
        if (indice === peca.correta) {
            liberarRef.current(peca.id);
            setResultado({ tipo: "nova", peca });
        } else {
            setErradas((e) => (e.includes(indice) ? e : [...e, indice]));
        }
    };

    return (
        <div className="flex-1 w-full flex flex-col items-center gap-4 px-6 pt-12 py-4">
            <h1>ESCANEAR PISTA</h1>

            <div className="w-full flex-1 py-6 px-2 bg-orange-300 rounded-xs text-center text-zinc-950 flex flex-col items-center justify-center gap-3">
                <span className="p-2 border-2 border-dashed rounded-md">
                    <Camera size={36}/>
                </span>
                <div id="leitor-qr" className="w-full max-w-sm overflow-hidden rounded-md bg-zinc-950" />
                {erro
                    ? <p className="text-xs">{erro}</p>
                    : <p className="text-xs">Aponte a câmera para o QR Code da pista.</p>}
            </div>

            {resultado && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 px-6">
                    <div className="w-full max-w-sm bg-zinc-100 text-zinc-950 rounded-xs p-4 flex flex-col items-center gap-3 text-center">
                        {resultado.tipo === "invalida" && (
                            <>
                                <h1>QR CODE INVÁLIDO</h1>
                                <p className="text-xs">Este código não faz parte da caça ao tesouro. Procure outro.</p>
                            </>
                        )}

                        {resultado.tipo === "pergunta" && (
                            <>
                                <h1>RESPONDA PARA DESBLOQUEAR</h1>
                                <p className="text-sm">{resultado.peca.pergunta}</p>
                                <div className="w-full flex flex-col gap-2">
                                    {resultado.peca.opcoes.map((opcao, i) => {
                                        const errada = erradas.includes(i);
                                        return (
                                            <button
                                                key={i}
                                                disabled={errada}
                                                onClick={() => responder(resultado.peca, i)}
                                                className={`w-full p-2 rounded-md border border-zinc-950 text-left ${errada ? "opacity-40 line-through" : "bg-orange-300"}`}
                                            >
                                                {opcao}
                                            </button>
                                        );
                                    })}
                                </div>
                                {erradas.length > 0 && (
                                    <p className="text-xs">Resposta incorreta. Tente outra opção.</p>
                                )}
                            </>
                        )}

                        {(resultado.tipo === "nova" || resultado.tipo === "repetida") && (
                            <>
                                <h1>{resultado.tipo === "nova" ? "PISTA DESBLOQUEADA" : "PISTA JÁ DESBLOQUEADA"}</h1>
                                <div
                                    className="w-32 h-32 border border-zinc-950 rounded-xs"
                                    style={{ backgroundColor: resultado.peca.cor }}
                                />
                                <p className="text-xs">
                                    {resultado.tipo === "nova"
                                        ? "A peça foi guardada. Monte o quebra-cabeça na página de pistas."
                                        : "Você já tinha encontrado esta peça."}
                                </p>
                            </>
                        )}

                        <div className="w-full flex gap-2">
                            <button onClick={escanearOutra} className="w-full p-2 bg-zinc-950 text-orange-300 rounded-md">
                                {resultado.tipo === "pergunta" ? "CANCELAR" : "ESCANEAR OUTRA"}
                            </button>
                            {(resultado.tipo === "nova" || resultado.tipo === "repetida") && (
                                <button onClick={() => router.push("/ferramentas")} className="w-full p-2 bg-orange-300 text-zinc-950 rounded-md">VER PISTAS</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Link href="/" className="w-full p-2 bg-zinc-950 text-orange-300 rounded-md flex items-center justify-center gap-2">
                <ArrowLeft size={16}/> VOLTAR
            </Link>
        </div>
    );
}
