"use client";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { loadProducts } from "@/lib/products";
import type { Product } from "@/lib/types";
import SalesDashboard from "./SalesDashboard";

const empty = { name: "", pricePi: "", category: "", stock: "" };

export default function AdminRoom() {
  const [items, setItems] = useState<Product[]>([]);
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");

  const refresh = useCallback(async () => setItems(await loadProducts()), []);
  useEffect(() => { refresh(); }, [refresh]);

  const save = async (p: Product): Promise<boolean> => {
    if (!supabase) { setMsg("Supabase not configured"); return false; }
    const { error } = await supabase.from("products").upsert(p);
    if (error) { setMsg(error.message); return false; }
    await refresh();
    return true;
  };

  const add = async () => {
    if (!form.name.trim()) { setMsg("Name required"); return; }
    let image = "";
    if (file && supabase) {
      const path = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      const up = await supabase.storage.from("sosa-products").upload(path, file);
      if (up.error) { setMsg("Upload failed: " + up.error.message); return; }
      image = supabase.storage.from("sosa-products").getPublicUrl(path).data.publicUrl;
    }
    const ok = await save({ id: "sosa-" + Date.now(), name: form.name.trim(), pricePi: Number(form.pricePi) || 0,
      category: form.category, image, stock: parseInt(form.stock, 10) || 0, active: true });
    if (ok) { setForm(empty); setFile(null); setMsg("Product added"); }
  };

  // Delete removes the Supabase row. Items from data/products.js come back unless set Hidden.
  const del = async (id: string) => {
    if (!supabase) return;
    await supabase.from("products").delete().eq("id", id);
    await refresh();
  };

  const input = "rounded-lg border border-black/20 bg-transparent p-2 dark:border-white/20";
  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4">
      <section className="grid gap-2 md:grid-cols-5">
        <input className={input} placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className={input} type="number" step="0.0001" placeholder="Price (Pi)" value={form.pricePi} onChange={(e) => setForm({ ...form, pricePi: e.target.value })} />
        <input className={input} placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input className={input} type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        <input className={input} type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <button onClick={add} className="rounded-lg bg-black p-2 text-white md:col-span-5 dark:bg-white dark:text-black">Add product</button>
      </section>
      {msg && <p className="text-sm">{msg}</p>}
      <section className="space-y-2">
        {items.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-black/10 p-3 dark:border-white/10">
            <span className="min-w-40 flex-1 font-medium">{p.name}</span>
            <input className={input + " w-28"} type="number" step="0.0001" defaultValue={p.pricePi}
              onBlur={(e) => save({ ...p, pricePi: Number(e.target.value) })} />
            <button className={input} onClick={() => save({ ...p, stock: Math.max(0, p.stock - 1) })}>−</button>
            <span>{p.stock}</span>
            <button className={input} onClick={() => save({ ...p, stock: p.stock + 1 })}>+</button>
            <button className={input} onClick={() => save({ ...p, active: !p.active })}>{p.active ? "Active" : "Hidden"}</button>
            <button className={input} onClick={() => del(p.id)}>Delete</button>
          </div>
        ))}
      </section>
      <SalesDashboard />
    </div>
  );
}
