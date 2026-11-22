import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/*
  SOSA referral storage (shared across phones).

  - If a Redis REST database is connected to this Vercel project (Vercel KV / Upstash Redis),
    these env vars exist and referral data is stored there = works on ANY phone:
        KV_REST_API_URL + KV_REST_API_TOKEN    (or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN)
  - If they do NOT exist, this falls back to server memory. Memory on Vercel is NOT shared and is lost
    often, so referral is then local only. The response says so: persistent=false.

  Rules enforced here: same orderCode never pays twice, same buyer never triggers a referral twice,
  self-referral is rejected, and (when PI_API_KEY is set) the payment must be a real completed Pi payment
  whose metadata.orderCode matches.
*/

const POINTS_PER_REFERRAL = 2.0;
const WELCOME_POINTS = 1.0;
const WARNING = "Server storage not available — referral still local only";

const g: any = globalThis as any;
const mem: Map<string, string> = g.__sosaRefMem || (g.__sosaRefMem = new Map<string, string>());

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

const store = {
  async setnx(key: string, val: string): Promise<boolean> {
    if (persistent()) return (await redis(["SET", key, val, "NX"])) === "OK";
    if (mem.has(key)) return false;
    mem.set(key, val);
    return true;
  },
  async get(key: string): Promise<string | null> {
    if (persistent()) return (await redis(["GET", key])) ?? null;
    return mem.get(key) ?? null;
  },
  async incr(key: string): Promise<number> {
    if (persistent()) return Number(await redis(["INCR", key]));
    const n = Number(mem.get(key) || 0) + 1;
    mem.set(key, String(n));
    return n;
  },
};

const clean = (v: any) => String(v ?? "").trim().replace(/^@/, "").toUpperCase().replace(/[^A-Z0-9_]/g, "");
const info = () => (persistent() ? { persistent: true, storage: "kv" } : { persistent: false, storage: "memory", warning: WARNING });

// POST { referrerCode, buyerUsername, orderCode, paymentId }
export async function POST(req: Request) {
  try {
    const body: any = await req.json().catch(() => ({}));
    const referrer = clean(body.referrerCode);
    const buyer = clean(body.buyerUsername);
    const orderCode = String(body.orderCode ?? "").trim().toUpperCase();
    const paymentId = String(body.paymentId ?? "").trim();

    if (!referrer || !buyer || !orderCode || !/^SOSA-[A-Z0-9-]{4,30}$/.test(orderCode)) {
      return NextResponse.json({ ok: false, error: "referrerCode, buyerUsername and a valid orderCode are required" }, { status: 400 });
    }
    if (referrer === buyer) {
      return NextResponse.json({ ok: false, error: "You cannot use your own code" }, { status: 400 });
    }
    if (!paymentId) {
      return NextResponse.json({ ok: false, error: "paymentId required" }, { status: 400 });
    }

    // Verify it was a REAL completed Pi payment for this order code (needs PI_API_KEY, already used by approve/complete)
    let verified = false;
    const apiKey = process.env.PI_API_KEY;
    if (apiKey) {
      let pr: Response;
      try {
        pr = await fetch("https://api.minepi.com/v2/payments/" + encodeURIComponent(paymentId), { headers: { Authorization: "Key " + apiKey }, cache: "no-store" });
      } catch {
        return NextResponse.json({ ok: false, error: "Could not reach Pi to verify the payment. Try again." }, { status: 502 });
      }
      if (!pr.ok) {
        return NextResponse.json({ ok: false, error: "Payment could not be verified" }, { status: pr.status >= 500 ? 502 : 403 });
      }
      const pd: any = await pr.json().catch(() => ({}));
      const done = pd?.status?.developer_completed === true;
      const same = String(pd?.metadata?.orderCode ?? "").trim().toUpperCase() === orderCode;
      if (!done || !same) {
        return NextResponse.json({ ok: false, error: "Payment is not a completed payment for this order" }, { status: 403 });
      }
      verified = true;
    }

    // Once only: this buyer never triggers a referral twice, and this order code never pays twice
    const firstForBuyer = await store.setnx("ref:buyer:" + buyer, referrer);
    if (!firstForBuyer) {
      return NextResponse.json({ ok: true, awarded: false, reason: "buyer_already_counted", verified, ...info() });
    }
    const firstForOrder = await store.setnx("ref:order:" + orderCode, buyer);
    if (!firstForOrder) {
      return NextResponse.json({ ok: true, awarded: false, reason: "order_already_counted", verified, ...info() });
    }
    const count = await store.incr("ref:count:" + referrer);
    return NextResponse.json({ ok: true, awarded: true, referralCount: count, referrerPoints: count * POINTS_PER_REFERRAL, verified, ...info() });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Server error", ...info() }, { status: 500 });
  }
}

// GET ?code=PIUSERNAME -> referral points this user earned as a referrer + welcome points as a buyer
export async function GET(req: Request) {
  try {
    const code = clean(new URL(req.url).searchParams.get("code"));
    if (!code) return NextResponse.json({ ok: false, error: "code required" }, { status: 400 });
    const count = Number((await store.get("ref:count:" + code)) || 0);
    const asBuyer = await store.get("ref:buyer:" + code);
    return NextResponse.json({
      ok: true,
      code,
      referralCount: count,
      referralPoints: count * POINTS_PER_REFERRAL,
      welcomePoints: asBuyer ? WELCOME_POINTS : 0,
      ...info(),
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Server error", ...info() }, { status: 500 });
  }
}
