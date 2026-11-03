import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { processarPagamentoTratamento } from "@/lib/terapia/processarPagamento";

export const runtime = "nodejs";

function autenticado(req: NextRequest, paymentId: string) {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET || "";
  const signature = req.headers.get("x-signature") || "";
  const requestId = req.headers.get("x-request-id") || "";
  const ts = signature.match(/(?:^|,)\s*ts=([^,]+)/)?.[1] || "";
  const v1 = signature.match(/(?:^|,)\s*v1=([a-fA-F0-9]+)/)?.[1] || "";
  if (!secret || !ts || !v1 || !requestId || !/^\d+$/.test(ts)) return false;
  const timestampMs = ts.length <= 10 ? Number(ts) * 1000 : Number(ts);
  if (Math.abs(Date.now() - timestampMs) > 10 * 60 * 1000) return false;
  const manifest = "id:" + paymentId + ";request-id:" + requestId + ";ts:" + ts + ";";
  const expected = createHmac("sha256", secret).update(manifest).digest();
  if (!/^[a-fA-F0-9]{64}$/.test(v1)) return false;
  return timingSafeEqual(expected, Buffer.from(v1, "hex"));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const kind = String(body?.type || req.nextUrl.searchParams.get("type") || "");
    if (kind !== "payment") return NextResponse.json({ ok: true });
    const id = String(body?.data?.id || req.nextUrl.searchParams.get("data.id") || "");
    if (!/^\d+$/.test(id) || !autenticado(req, id)) return NextResponse.json({ error: "Notificação inválida." }, { status: 401 });
    await processarPagamentoTratamento(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Falha ao processar pagamento terapêutico", error instanceof Error ? error.message : "Erro");
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
