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
  const [showCart, setShowCart] = useState(false);
  const [paying, setPaying] = useState(false);

  const price = (p: Product) => Number(p.pricePi ?? p.price_pi ?? 0);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) {
        // Hide junk test products from shop
        const clean = (data as Product[]).filter(
          (p) => !(p.name?.trim() === "New Item" && price(p) === 0)
        );
        setProducts(clean);
      }
      setLoading(false);
    }
    load();
    // Init Pi SDK as soon as page loads
    const t = setInterval(() => {
      const Pi = (window as any).Pi;
      if (Pi) {
        try {
          Pi.init({ version: "2.0", sandbox: false });
        } catch (e) {}
        clearInterval(t);
      }
    }, 500);
    return () => clearInterval(t);
  }, []);

  const total = cart.reduce((s, p) => s + price(p), 0);

  function addToCart(p: Product) {
    setCart([...cart, p]);
  }

  function removeFromCart(index: number) {
    setCart(cart.filter((_, i) => i !== index));
  }

  async function checkout() {
    if (cart.length === 0) return alert("Cart is empty");
    // @ts-ignore
    const Pi = (window as any).Pi;
    if (!Pi) {
      return alert("Open this site inside Pi Browser to pay with Pi.\n\nIn Chrome it will not work - Pi Browser only.");
    }
    setPaying(true);
    try {
      // 1. Init - fixes "SDK not initialized"
      try {
        await Pi.init({ version: "2.0", sandbox: false });
      } catch (e) {}

      // 2. Authenticate
      await Pi.authenticate(
        ["username", "payments"],
        (incomplete: any) => {
          // Handle incomplete payment from last time
          if (incomplete) {
            fetch("/api/pi/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId: incomplete.identifier, txid: incomplete.transaction?.txid }),
            });
          }
        }
      );

      // 3. Create payment
      await Pi.createPayment(
        {
          amount: total,
          memo: "SOSA Order - " + cart.map((c) => c.name).join(", "),
          metadata: { items: cart.map((c) => c.id) },
        },
        {
          onReadyForServerApproval: async (paymentId: string) => {
            await fetch("/api/pi/approve", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId }),
            });
          },
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            await fetch("/api/pi/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId, txid }),
            });
            alert("Payment complete! Thank you for shopping with SOSA.");
            setCart([]);
            setShowCart(false);
          },
          onCancel: () => alert("Payment cancelled"),
          onError: (e: any) => alert("Payment error: " + (e?.message || JSON.stringify(e))),
        }
      );
    } catch (e: any) {
      alert(e?.message || "Payment failed. Make sure you are in Pi Browser.");
    }
    setPaying(false);
  }

  return (
    <main className="shop">
      <header className="hero">
        <h1>SOSA-outfits</h1>
        <p>Sophisticated Samples - Native Wear, Pay with Pi</p>
        <div className="nav">
          <a href="/">Shop</a>
          <a href="/admin">Admin</a>
          <button onClick={() => setShowCart(!showCart)}>
            Cart ({cart.length}) - {total.toFixed(2)} Pi
          </button>
        </div>
      </header>

      {showCart && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3>Your Cart</h3>
          {cart.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            <>
              {cart.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #333" }}>
                  <span>{item.name} - {price(item)} Pi</span>
                  <button onClick={() => removeFromCart(i)} style={{ background: "#ff4444", color: "#fff", padding: "4px 10px" }}>Remove</button>
                </div>
              ))}
              <p style={{ fontWeight: 800, marginTop: 12 }}>Total: {total.toFixed(2)} Pi</p>
              <button onClick={checkout} disabled={paying}>
                {paying ? "Processing..." : `Pay ${total.toFixed(2)} Pi with Pi`}
              </button>
              <p style={{ fontSize: 12, opacity: 0.7 }}>You must checkout inside Pi Browser</p>
            </>
          )}
        </div>
      )}

      {loading ? <p className="center">Loading products...</p> : null}
      {!loading && products.length === 0 ? (
        <p className="center">No products yet. Add some in Admin.</p>
      ) : null}

      <div className="grid">
        {products.map((p) => (
          <div key={p.id} className="card">
            {p.image_url || p.image ? (
              <img src={p.image_url || p.image} alt={p.name} />
            ) : (
              <div className="noimg">SOSA</div>
            )}
            <h3>{p.name}</h3>
            <p>{p.description || ""}</p>
            <strong>{price(p)} Pi</strong>
            <br />
            <br />
            <button onClick={() => addToCart(p)}>Add to Cart</button>
          </div>
        ))}
      </div>
      <footer>© SOSA-outfits - Sophisticated Samples</footer>
    </main>
  );
        }
