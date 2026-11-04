import { supabase } from "./supabase";
import type { Product } from "./types";

export const DELIVERY_FEE = 0.5;
export const FREE_DELIVERY_THRESHOLD = 20;

export function cartTotal(items: { product: Product; qty: number }[]): number {
  return items.reduce((sum, i) => sum + (i.product.price_pi || 0) * (i.qty || 0), 0);
}

export function cartCount(items: { qty: number }[]): number {
  return items.reduce((sum, i) => sum + (i.qty || 0), 0);
}

export async function loadProducts(): Promise<Product[]> {
  const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  return (data || []) as Product[];
}
