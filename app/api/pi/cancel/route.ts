import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { paymentId } = await req.json();
    if (!paymentId) {
      return NextResponse.json({ error: "paymentId required" }, { status: 400 });
    }
    const apiKey = process.env.PI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "PI_API_KEY is not set in Vercel environment variables" }, { status: 500 });
    }
    const r = await fetch(`https://api.minepi.com/v2/payments/${encodeURIComponent(paymentId)}/cancel`, {
      method: "POST",
      headers: { Authorization: `Key ${apiKey}`, "Content-Type": "application/json" },
      body: "{}",
    });
    const data = await r.json().catch(() => ({}));
    return NextResponse.json(data, { status: r.status });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
