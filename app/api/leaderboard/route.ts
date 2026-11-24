// SOSA Shared Leadership Board - one board for ALL phones
const g: any = globalThis as any;
if (!g.__sosa_board) g.__sosa_board = {};
if (!g.__sosa_paid) g.__sosa_paid = new Set();

export async function GET() {
  const list = Object.keys(g.__sosa_board)
    .map((k) => ({ name: "@" + k, pts: Number(g.__sosa_board[k]) || 0 }))
    .sort((a, b) => b.pts - a.pts)
    .slice(0, 20);
  return Response.json({ board: list });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const buyer = String(body.buyer || "").replace("@", "").trim().toLowerCase();
    const referrer = String(body.referrer || "").replace("@", "").trim().toLowerCase();
    const buyerPts = Number(body.buyerPts || 0);
    const orderId = String(body.orderId || "");
    if (!buyer) return Response.json({ ok: false }, { status: 400 });
    g.__sosa_board[buyer] = buyerPts;
    let bonus = 0;
    if (referrer && referrer !== buyer && orderId && !g.__sosa_paid.has(orderId)) {
      bonus = Number(body.orderTotal || 0) * 10 * 0.2;
      g.__sosa_board[referrer] = (g.__sosa_board[referrer] || 0) + bonus;
      g.__sosa_paid.add(orderId);
    }
    return Response.json({ ok: true, bonus });
  } catch { return Response.json({ ok: false }, { status: 500 }); }
    }
