import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PI_API = process.env.PI_API_URL || "https://api.minepi.com";

export async function POST(req: Request) {
  const { paymentId, txid } = await req.json();
  const url = txid
    ? `${PI_API}/v2/payments/${paymentId}/complete`
    : `${PI_API}/v2/payments/${paymentId}/cancel`;
  const r = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Key ${process.env.PI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: txid ? JSON.stringify({ txid }) : undefined,
  });
  return NextResponse.json(await r.json().catch(() => ({})), { status: r.status });
}
