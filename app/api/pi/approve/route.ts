import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const { paymentId } = (await req.json()) as { paymentId?: string };
  if (!paymentId) return NextResponse.json({ error: "paymentId required" }, { status: 400 });
  const r = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
    method: "POST", headers: { Authorization: `Key ${process.env.PI_API_KEY}` },
  });
  return NextResponse.json(await r.json().catch(() => ({})), { status: r.status });
}
