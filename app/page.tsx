"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Product = {
  id: string;
  name: string;
  price_pi: number;
  pricePi?: number;
  description?: string;
  image_url?: string;
  image?: string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (data) setProducts(data as Product[]);
      setLoading(false);
    }
    load();
  }, []);

  const price = (p: Product) => p.pricePi ?? p.price_pi ?? 0;

  async function checkout() {
    if (cart.length === 0) return alert("Cart is empty");
    const total = cart.reduce((s, p) => s + price(p), 0);
    // @ts-ignore
    const Pi = (window as any).Pi;
    if (!Pi) return alert("Open this in Pi Browser to pay with Pi");
    try {
      await Pi.authenticate(["payments"]);
      await Pi.createPayment({
        amount: total,
        memo: "SOSA Order - " + cart.map((c) => c.name).join(", "),
        metadata: { items: cart.map((c) => c.id) },
      }, {
        onReadyForServerApproval: async (paymentId: string) => {
          await fetch("/api/pi/approve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paymentId }) });
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          await fetch("/api/pi/complete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paymentId, txid }) });
          alert("Payment complete! Thank you.");
          setCart([]);
        },
        onCancel: () => alert("Payment cancelled"),
        onError: (e: any) => alert("Payment error: " + e.message),
      });
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <main className="shop">
      <header className="hero">
        <h1>SOSA-outfits</h1>
        <p>Sophisticated Samples - Native Wear, Pay with Pi</p>
        <div className="nav">
          <a href="/">Shop</a>
          <a href="/admin">Admin</a>
          <button onClick={checkout}>Cart ({cart.length}) - Checkout</button>
        </div>
      </header>

      {loading ? <p className="center">Loading products...</p> : null}
      {!loading && products.length === 0 ? <p className="center">No products yet. Add some in Admin.</p> : null}

      <div className="grid">
        {products.map((p) => (
          <div key={p.id} className="card">
            {(p.image_url || p.image) ? <img src={p.image_url || p.image} alt={p.name} /> : <div className="noimg">SOSA</div>}
            <h3>{p.name}</h3>
            <p>{p.description || ""}</p>
            <strong>{price(p)} Pi</strong>
            <button onClick={() => setCart([...cart, p])}>Add to Cart</button>
          </div>
        ))}
      </div>
      <footer>© SOSA-outfits - Sophisticated Samples</footer>
    </main>
  );
}
