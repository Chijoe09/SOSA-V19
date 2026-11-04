"use client";
import { useEffect, useState } from "react";
import { loadProducts } from "@/lib/products";
import type { Product } from "@/lib/types";
import ProductImage from "./ProductImage";

export default function ProductGrid({ onAdd }: { onAdd: (p: Product) => void }) {
  const [items, setItems] = useState<Product[]>([]);
  useEffect(() => { loadProducts().then(setItems); }, []);
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 md:grid-cols-3 xl:grid-cols-4">
      {items.map((p) => (
        <article key={p.id} className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
          <div className="aspect-[4/5] bg-neutral-200 dark:bg-neutral-900"><ProductImage src={p.image} alt={p.name} /></div>
          <div className="space-y-2 p-4">
            <h3 className="font-semibold">{p.name}</h3>
            <p>{p.pricePi.toFixed(4)} Pi</p>
            <button disabled={p.stock <= 0} onClick={() => onAdd(p)}
              className="w-full rounded-xl bg-black py-2 text-white disabled:opacity-40 dark:bg-white dark:text-black">
              {p.stock > 0 ? "Add to cart" : "Out of stock"}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
