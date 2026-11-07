import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const PI_API = process.env.PI_API_URL || "https://api.minepi.com";

export async function POST(req: Request) {
  try {
    const { paymentId } = await req.json();
    if (!paymentId) return NextResponse.json({ error: "paymentId required" }, { status: 400 });

    const r = await fetch(`${PI_API}/v2/payments/${paymentId}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.PI_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
    const data = await r.json().catch(() => ({}));
    console.log("approve", r.status, data);
    return NextResponse.json(data, { status: r.status });
  } catch (e: any) {
    console.error("approve error", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
