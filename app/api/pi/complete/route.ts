import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const { paymentId, txid } = (await req.json()) as { paymentId?: string; txid?: string };
  if (!paymentId || !txid) return NextResponse.json({ error: "paymentId and txid required" }, { status: 400 });
  const r = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
    method: "POST",
    headers: { Authorization: `Key ${process.env.PI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ txid }),
  });
  return NextResponse.json(await r.json().catch(() => ({})), { status: r.status });
}
