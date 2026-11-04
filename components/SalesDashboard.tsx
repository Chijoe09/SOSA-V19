"use client";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { OrderRow } from "@/lib/types";

type Range = "all" | "daily" | "weekly" | "monthly";
const DAY = 86400000;
const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); };
const sumPi = (rows: OrderRow[]) => parseFloat(rows.reduce((s, r) => s + Number(r.totalPi), 0).toFixed(7));
const since = (rows: OrderRow[], ms: number) => rows.filter((r) => new Date(r.created_at ?? 0).getTime() >= ms);

export default function SalesDashboard() {
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [range, setRange] = useState<Range>("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!supabase) return;
    supabase.from("orders").select("*").order("created_at", { ascending: false })
      .then(({ data }) => setRows((data as OrderRow[] | null) ?? []));
  }, []);

  const cards = useMemo(() => {
    const now = Date.now();
    return { Daily: sumPi(since(rows, startOfToday())), Weekly: sumPi(since(rows, now - 7 * DAY)),
      Monthly: sumPi(since(rows, now - 30 * DAY)), "All-time": sumPi(rows) };
  }, [rows]);
  const customers = new Set(rows.map((r) => r.phone)).size;

  const shown = useMemo(() => {
    const now = Date.now();
    const base = range === "daily" ? since(rows, startOfToday()) : range === "weekly" ? since(rows, now - 7 * DAY)
      : range === "monthly" ? since(rows, now - 30 * DAY) : rows;
    return q ? base.filter((r) => r.phone?.includes(q)) : base;
  }, [rows, range, q]);

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Object.entries(cards).map(([k, v]) => (
          <div key={k} className="rounded-xl border border-black/10 p-3 dark:border-white/10"><div className="text-xs">{k}</div><div className="text-lg font-bold">{v} Pi</div></div>
        ))}
      </div>
      <p className="text-sm">Total Orders: {rows.length} · Total Pi: {cards["All-time"]} · Total Customers: {customers}</p>
      <div className="flex flex-wrap gap-2">
        {(["all", "daily", "weekly", "monthly"] as Range[]).map((r) => (
          <button key={r} onClick={() => setRange(r)} className={`rounded-lg border px-3 py-1 ${range === r ? "bg-black text-white dark:bg-white dark:text-black" : ""}`}>{r}</button>
        ))}
        <input className="rounded-lg border bg-transparent px-3 py-1" placeholder="Search phone" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead><tr>{["Date","Customer","Phone","Products","Pi","Type","Payment ID","TXID","Status"].map((h) => <th key={h} className="p-2">{h}</th>)}</tr></thead>
          <tbody>
            {shown.map((r, i) => (
              <tr key={r.id ?? i} className="border-t border-black/10 dark:border-white/10">
                <td className="p-2">{r.created_at ? new Date(r.created_at).toLocaleString() : ""}</td>
                <td className="p-2">{r.customerName}</td><td className="p-2">{r.phone}</td>
                <td className="p-2">{r.productIds?.map((p) => `${p.id}×${p.qty}`).join(", ")}</td>
                <td className="p-2">{r.totalPi}</td><td className="p-2">{r.deliveryType}</td>
                <td className="max-w-24 truncate p-2">{r.paymentId}</td><td className="max-w-24 truncate p-2">{r.txid}</td>
                <td className="p-2">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
