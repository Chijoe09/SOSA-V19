import { products as staticProducts } from "@/data/products";
import { supabase } from "./supabase";
import type { Product } from "./types";

const clean = (p: Product): Product => ({ ...p, pricePi: Number(p.pricePi), stock: Number(p.stock) });

/** Static first; Supabase rows override by id and add new ones. Never throws. */
export async function loadProducts(): Promise<Product[]> {
  const map = new Map<string, Product>(staticProducts.map((p) => [p.id, clean(p)]));
  if (supabase) {
    try {
      const { data } = await supabase.from("products").select("*");
      (data as Product[] | null)?.forEach((p) => map.set(p.id, clean(p)));
    } catch { /* static only */ }
  }
  return [...map.values()].filter((p) => p.active);
}

export const DELIVERY_FEE = 0.0001;
export function cartTotal(lines: { product: Product; qty: number }[], isDelivery: boolean): number {
  const sum = lines.reduce((s, l) => s + Number(l.product.pricePi) * l.qty, 0) + (isDelivery ? DELIVERY_FEE : 0);
  return parseFloat(sum.toFixed(7));
}
