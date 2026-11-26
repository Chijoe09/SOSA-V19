import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/*
  SOSA Leadership Board (shared by all phones).

  MERGE, never overwrite:
    board[user]  = highest ORDER points ever reported for that user (Math.max)
    bonus[user]  = referral bonus earned on the server (20% of the buyer's order points, once per orderId)
    floor[user]  = highest TOTAL the user's own phone ever saw for them (used to rebuild after a redeploy)
    total(user)  = Math.max(board + bonus, floor)

  Storage: if KV_REST_API_URL + KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL + _TOKEN) exist, data lives in
  Redis and survives redeploys. If not, it lives in server memory (globalThis) which Vercel wipes on every
  redeploy and which is NOT shared between server instances: phones then rebuild it by syncing on login.
*/

// "chijoe09i" is a typo of "chijoe09": always merged into chijoe09
const ALIASES: Record<string, string> = { chijoe09i: "chijoe09" };

// EXISTING POINTS - applied once so a redeploy never resets them. Real syncs can only RAISE the order points.
// (chijoe09: 20.3 order points + 0.4 bonus = 20.7). You can delete these two lines once Redis is connected.
const SEED_BOARD: Record<string, number> = { ifecolight: 38.1, chijoe09: 20.3 };
const SEED_BONUS: Record<string, number> = { chijoe09: 0.4 };

const WARNING = "Server storage not connected: board lives in memory and is rebuilt from phone syncs after a redeploy";

const normUser = (v: any) => {
  let k = String(v ?? "").replace("@", "").toLowerCase().trim();
  if (ALIASES[k]) k = ALIASES[k];
  return k.slice(0, 40);
};
const num = (v: any, max: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.min(n, max) : 0;
};
const round = (n: number) => Math.round(n * 100) / 100;

// ---------- storage ----------
const g: any = globalThis as any;
const kvUrl = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const kvToken = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";
const persistent = () => !!(kvUrl() && kvToken());

async function redis(cmd: (string | number)[]): Promise<any> {
  const r = await fetch(kvUrl(), {
    method: "POST",
    headers: { Authorization: "Bearer " + kvToken(), "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
    cache: "no-store",
  });
  const j: any = await r.json().catch(() => ({}));
  if (!r.ok || j.error) throw new Error(j.error || "storage error " + r.status);
  return j.result;
}

type Name = "board" | "bonus" | "floor";
const memMap = (n: Name): Map<string, number> => g["__sosa_" + n] || (g["__sosa_" + n] = new Map<string, number>());
const memSeen = (): Set<string> => g.__sosa_seen || (g.__sosa_seen = new Set<string>());

async function readAll(n: Name): Promise<Map<string, number>> {
  if (!persistent()) return memMap(n);
  const flat: any[] = (await redis(["HGETALL", "sosa:lb:" + n])) || [];
  const m = new Map<string, number>();
  for (let i = 0; i + 1 < flat.length; i += 2) m.set(String(flat[i]), Number(flat[i + 1]) || 0);
  return m;
}
async function setVal(n: Name, k: string, v: number) {
  if (!persistent()) memMap(n).set(k, v);
  else await redis(["HSET", "sosa:lb:" + n, k, String(v)]);
}
async function addVal(n: Name, k: string, d: number) {
  if (!persistent()) memMap(n).set(k, (memMap(n).get(k) || 0) + d);
  else await redis(["HINCRBYFLOAT", "sosa:lb:" + n, k, String(d)]);
}
async function markSeen(id: string): Promise<boolean> {
  if (!persistent()) {
    const s = memSeen();
    if (s.has(id)) return false;
    s.add(id);
    return true;
  }
  return (await redis(["SET", "sosa:lb:seen:" + id, "1", "NX"])) === "OK";
}
async function ensureSeed() {
  if (persistent()) {
    if ((await redis(["SET", "sosa:lb:seeded", "1", "NX"])) !== "OK") return;
    for (const [k, v] of Object.entries(SEED_BOARD)) await redis(["HSETNX", "sosa:lb:board", k, String(v)]);
    for (const [k, v] of Object.entries(SEED_BONUS)) await redis(["HSETNX", "sosa:lb:bonus", k, String(v)]);
    return;
  }
  if (g.__sosa_seeded) return;
  g.__sosa_seeded = true;
  for (const [k, v] of Object.entries(SEED_BOARD)) if (!memMap("board").has(k)) memMap("board").set(k, v);
  for (const [k, v] of Object.entries(SEED_BONUS)) if (!memMap("bonus").has(k)) memMap("bonus").set(k, v);
}

async function buildBoard() {
  const [board, bonus, floor] = await Promise.all([readAll("board"), readAll("bonus"), readAll("floor")]);
  const users = new Set<string>([...Array.from(board.keys()), ...Array.from(bonus.keys()), ...Array.from(floor.keys())]);
  const rows: { name: string; pts: number }[] = [];
  users.forEach((u) => {
    const k = normUser(u);
    if (!k) return;
    const pts = Math.max((board.get(u) || 0) + (bonus.get(u) || 0), floor.get(u) || 0);
    const ex = rows.find((r) => r.name === "@" + k);
    if (ex) ex.pts = round(ex.pts + pts); // an old alias row still in storage is merged, never shown twice
    else rows.push({ name: "@" + k, pts: round(pts) });
  });
  rows.sort((a, b) => b.pts - a.pts);
  return rows;
}
const info = () => (persistent() ? { persistent: true, storage: "redis" } : { persistent: false, storage: "memory", warning: WARNING });

// GET -> the whole board
export async function GET() {
  try {
    await ensureSeed();
    return NextResponse.json({ ok: true, board: await buildBoard(), ...info() });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Server error", board: [], ...info() }, { status: 500 });
  }
}

// POST { buyer, buyerPts, referrer, orderId, orderTotal, knownTotal? } -> merge, then return the whole board
export async function POST(req: Request) {
  try {
    const body: any = await req.json().catch(() => ({}));
    const buyer = normUser(body.buyer);
    if (!buyer) return NextResponse.json({ ok: false, error: "buyer required" }, { status: 400 });
    const referrer = normUser(body.referrer);
    const buyerPts = num(body.buyerPts, 1e7);
    const knownTotal = num(body.knownTotal, 1e7);
    const orderTotal = num(body.orderTotal, 1e4);
    const orderId = String(body.orderId ?? "").trim().slice(0, 80);

    await ensureSeed();

    // MERGE: points only go up
    if (buyerPts > 0) {
      const cur = (await readAll("board")).get(buyer) || 0;
      if (buyerPts > cur) await setVal("board", buyer, buyerPts);
    }
    if (knownTotal > 0) {
      const cur = (await readAll("floor")).get(buyer) || 0;
      if (knownTotal > cur) await setVal("floor", buyer, knownTotal);
    }
    // Referral bonus: 10% of order points, FIRST order only, max 5 pts per invitee.
    let bonusGiven = 0;
    if (referrer && referrer !== buyer && orderId && orderTotal > 0) {
      if (await markSeen(`ref-first-${buyer}`)) {
        bonusGiven = Math.min(5, round(orderTotal * 10 * 0.1));
        await addVal("bonus", referrer, bonusGiven);
      }
    }
    return NextResponse.json({ ok: true, bonusGiven, board: await buildBoard(), ...info() });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Server error", ...info() }, { status: 500 });
  }
}
