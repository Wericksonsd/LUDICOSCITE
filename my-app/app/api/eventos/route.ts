import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Armazenamento em arquivo JSON (serve para um servidor próprio / evento pequeno).
// Em hospedagem serverless (Vercel etc.) o disco não persiste: troque ler()/salvar()
// por um banco (Supabase, Turso, Postgres...). O resto do arquivo não muda.
const ARQUIVO = path.join(process.cwd(), "data", "participantes.json");
const RESUMO = path.join(process.cwd(), "data", "estatisticas.json");

type Registro = {
  id: string;
  pecas: number;
  iniciouEm?: string;
  finalizouEm?: string;
};

async function ler(): Promise<Record<string, Registro>> {
  try {
    return JSON.parse(await fs.readFile(ARQUIVO, "utf8"));
  } catch {
    return {};
  }
}

async function salvar(dados: Record<string, Registro>) {
  await fs.mkdir(path.dirname(ARQUIVO), { recursive: true });
  await fs.writeFile(ARQUIVO, JSON.stringify(dados, null, 2));

  // resumo pronto para consulta: data/estatisticas.json
  const registros = Object.values(dados);
  const iniciaram = registros.filter((r) => r.iniciouEm).length;
  const finalizaram = registros.filter((r) => r.finalizouEm).length;
  await fs.writeFile(
    RESUMO,
    JSON.stringify(
      {
        iniciaram,
        finalizaram,
        taxaConclusao: iniciaram ? Math.round((finalizaram / iniciaram) * 100) : 0,
        atualizadoEm: new Date().toISOString(),
      },
      null,
      2
    )
  );
}

// fila para não perder gravações quando vários participantes enviam ao mesmo tempo
let fila: Promise<unknown> = Promise.resolve();

export async function POST(req: Request) {
  const corpo = await req.json().catch(() => null);
  const id = corpo?.id;
  const evento = corpo?.evento;
  const pecas = Number.isInteger(corpo?.pecas) ? Math.max(0, Math.min(corpo.pecas, 99)) : 0;

  if (
    typeof id !== "string" || id.length < 8 || id.length > 64 ||
    (evento !== "iniciou" && evento !== "finalizou")
  ) {
    return NextResponse.json({ erro: "requisição inválida" }, { status: 400 });
  }

  const tarefa = fila.then(async () => {
    const dados = await ler();
    const agora = new Date().toISOString();
    const r: Registro = dados[id] ?? { id, pecas: 0 };

    r.pecas = Math.max(r.pecas, pecas);
    r.iniciouEm ??= agora;
    if (evento === "finalizou") r.finalizouEm ??= agora;

    dados[id] = r;
    await salvar(dados);
  });
  fila = tarefa.catch(() => {});
  await tarefa;

  return NextResponse.json({ ok: true });
}
