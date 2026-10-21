'use client'

const CHAVE_ID = "dq-cliente-id";
const CHAVE_FINALIZOU = "dq-finalizou-enviado";

function clienteId(): string | null {
  try {
    let id = localStorage.getItem(CHAVE_ID);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
      localStorage.setItem(CHAVE_ID, id);
    }
    return id;
  } catch {
    return null;
  }
}

export function registrarEvento(evento: "iniciou" | "finalizou", pecas: number) {
  const id = clienteId();
  if (!id) return;

  if (evento === "finalizou") {
    try {
      if (localStorage.getItem(CHAVE_FINALIZOU) === "1") return;
    } catch {}
  }

  fetch("/api/eventos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, evento, pecas }),
    keepalive: true,
  })
    .then((r) => {
      if (r.ok && evento === "finalizou") {
        try { localStorage.setItem(CHAVE_FINALIZOU, "1"); } catch {}
      }
    })
    .catch(() => {});
}
