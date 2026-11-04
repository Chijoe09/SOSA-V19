import { supabase } from "./supabase";
import type { Product } from "./types";

export const DELIVERY_FEE = 0.5;
export const FREE_DELIVERY_THRESHOLD = 20;

// Accept 1 or 2 args - DevCheckout calls it with (cart, isDelivery)
export function cartTotal(items: any[], _second?: any): number {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, i) => {
    const price = i?.product?.price_pi ?? i?.price_pi ?? i?.price ?? 0;
    const qty = i?.qty ?? i?.quantity ?? 1;
    return sum + price * qty;
  }, 0);
}

export function cartCount(items: any[]): number {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, i) => sum + (i?.qty ?? i?.quantity ?? 0), 0);
}

export async function loadProducts(): Promise<Product[]> {
  const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  return (data || []) as Product[];
}
