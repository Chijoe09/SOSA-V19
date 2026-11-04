import { supabase } from "./supabase";
import type { Product } from "./types";

export async function loadProducts(): Promise<Product[]> {
  const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  return (data || []) as Product[];
}
