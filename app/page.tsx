"use client";
import { useState, useEffect } from "react";

declare global { interface Window { Pi: any } }

const PRODUCTS = [
  { id: "sosa-001", name: "Classic Heel", price: 0.05, cat: "Footwear" },
  { id: "sosa-002", name: "Royal Heel", price: 0.04, cat: "Footwear" },
  { id: "sosa-003", name: "Lagos Heel", price: 0.03, cat: "Footwear" },
  { id: "sosa-004", name: "Classic Flat", price: 0.05, cat: "Footwear" },
  { id: "sosa-005", name: "Royal Flat", price: 0.04, cat: "Footwear" },
  { id: "sosa-006", name: "Lagos Flat", price: 0.03, cat: "Footwear" },
  { id: "sosa-007", name: "Executive Flat", price: 0.05, cat: "Footwear" },
  { id: "sosa-008", name: "Heritage Flat", price: 0.04, cat: "Footwear" },
  { id: "sosa-009", name: "Classic Palm Slide", price: 0.04, cat: "Footwear" },
  { id: "sosa-010", name: "Royal Palm Slide", price: 0.03, cat: "Footwear" },
  { id: "sosa-011", name: "Lagos Palm Slide", price: 0.02, cat: "Footwear" },
  { id: "sosa-012", name: "Classic Cross Bag", price: 0.05, cat: "Bags" },
  { id: "sosa-013", name: "Royal Cross Bag", price: 0.04, cat: "Bags" },
  { id: "sosa-014", name: "Lagos Cross Bag", price: 0.03, cat: "Bags" },
  { id: "sosa-015", name: "Classic Hand Bag", price: 0.05, cat: "Bags" },
  { id: "sosa-016", name: "Royal Hand Bag", price: 0.04, cat: "Bags" },
  { id: "sosa-017", name: "Lagos Hand Bag", price: 0.03, cat: "Bags" },
  { id: "sosa-018", name: "Classic Top", price: 0.04, cat: "Tops" },
  { id: "sosa-019", name: "Royal Top", price: 0.03, cat: "Tops" },
  { id: "sosa-020", name: "Lagos Top", price: 0.02, cat: "Tops" },
  { id: "sosa-021", name: "Classic Suit", price: 0.05, cat: "Suits" },
  { id: "sosa-022", name: "Royal Suit", price: 0.04, cat: "Suits" },
  { id: "sosa-023", name: "Lagos Suit", price: 0.03, cat: "Suits" },
  { id: "sosa-024", name: "Ankara Jacket Red", price: 0.05, cat: "Traditional Wears" },
  { id: "sosa-025", name: "Ankara Jacket Blue", price: 0.04, cat: "Traditional Wears" },
  { id: "sosa-026", name: "Ankara Jacket Green", price: 0.03, cat: "Traditional Wears" },
  { id: "sosa-027", name: "Ankara Jacket Gold", price: 0.05, cat: "Traditional Wears" },
  { id: "sosa-028", name: "Traditional Wear Classic", price: 0.05, cat: "Traditional Wears" },
  { id: "sosa-029", name: "Traditional Wear Royal", price: 0.04, cat: "Traditional Wears" },
  { id: "sosa-030", name: "Female Dress Classic", price: 0.05, cat: "Female" },
  { id: "sosa-031", name: "Female Dress Royal", price: 0.04, cat: "Female" },
];

const COLORS = ["Black", "Brown", "White", "Dark Blue", "Grey"];
const SIZES = ["M", "L", "XL", "XXL", "3XL"];

export default function Home() {
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [color, setColor] = useState("Black");
  const [size, setSize] = useState("L");
  const [user, setUser] = useState<any>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://sdk.minepi.com/pi-sdk.js";
    s.onload = () => {
      window.Pi.init({ version: "2.0", sandbox: false });
      setStatus("Pi SDK Ready");
    };
    document.head.appendChild(s);
  }, []);

  const total = cart.reduce((a, c) => a + c.price * c.qty, 0);

  const addToCart = (p: any) => {
    setCart([...cart, { ...p, color, size, qty: 1 }]);
    setSelected(null);
  };

  const loginPi = async () => {
    try {
      const auth = await window.Pi.authenticate(["username", "payments"], (p: any) => console.log(p));
      setUser(auth.user);
      alert("Welcome " + auth.user.username);
    } catch (e: any) { alert("Pi Login failed: " + e.message); }
  };

  const payWithPi = async () => {
    if (!window.Pi) return alert("Open in Pi Browser");
    if (cart.length === 0) return alert("Cart empty");
    try {
      if (!user) {
        const auth = await window.Pi.authenticate(["username", "payments"], () => {});
        setUser(auth.user);
      }
      setStatus("Creating Pi Payment...");
      await window.Pi.createPayment({
        amount: Number(total.toFixed(4)),
        memo: "SOSA Order - " + cart.map(c=>c.name).join(", "),
        metadata: { orderId: "SOSA-" + Date.now(), items: cart },
      }, {
        onReadyForServerApproval: async (paymentId: string) => {
          await fetch("/api/pi/approve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paymentId }) });
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          await fetch("/api/pi/complete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paymentId, txid }) });
          alert("Payment SUCCESS! TX: " + txid);
          setCart([]); setShowCart(false); setStatus("Payment Complete");
        },
        onCancel: () => { setStatus("Payment Cancelled"); alert("Payment cancelled"); },
        onError: (e: any) => { setStatus("Payment Error"); alert("Payment error: " + e.message); },
      });
    } catch (e: any) { alert("Pi Pay failed: " + e.message); }
  };

  const payBarcode = () => {
    const code = "SOSA-" + Math.floor(100000 + Math.random() * 900000);
    alert("Barcode Payment: Your barcode " + code + " - Show it at pickup. Total: " + total.toFixed(2) + " Pi");
  };

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", padding: 16, fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800 }}>SOPHISTICATED SAMPLES</h1>
      <p>SOSA-outfits. Made in Nigeria</p>
      <p style={{ color: "#ff7a00", fontSize: 12 }}>{status} {user ? " | @" + user.username : ""}</p>
      <button onClick={loginPi} style={{ background: "#ff7a00", border: 0, padding: "10px 16px", borderRadius: 20, fontWeight: 700 }}>Login with Pi</button>
      <button onClick={() => setShowCart(true)} style={{ background: "#fff", color: "#000", border: 0, padding: "10px 16px", borderRadius: 20, marginLeft: 8, fontWeight: 700 }}>Cart ({cart.length}) - {total.toFixed(2)} Pi</button>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
        {PRODUCTS.map(p => (
          <div key={p.id} style={{ background: "#111", padding: 12, borderRadius: 12 }}>
            <div style={{ background: "#fff", color: "#000", padding: 20, textAlign: "center", borderRadius: 8, fontWeight: 700 }}>{p.name}</div>
            <p>{p.name} - {p.price} Pi - {p.cat}</p>
            <button onClick={() => { setSelected(p); setColor("Black"); setSize("L"); }} style={{ background: "#ff7a00", border: 0, padding: "8px 12px", borderRadius: 20, width: "100%", fontWeight: 700 }}>Add to Cart</button>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", color: "#000", padding: 20, borderRadius: 12, width: "90%" }}>
            <h2>{selected.name} - {selected.price} Pi</h2>
            <p>Colour:</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{COLORS.map(c => <button key={c} onClick={() => setColor(c)} style={{ background: color === c ? "#ff7a00" : "#eee", border: 0, padding: "6px 10px", borderRadius: 20 }}>{c}</button>)}</div>
            <p>Size:</p>
            <div style={{ display: "flex", gap: 6 }}>{SIZES.map(s => <button key={s} onClick={() => setSize(s)} style={{ background: size === s ? "#ff7a00" : "#eee", border: 0, padding: "6px 10px", borderRadius: 20 }}>{s}</button>)}</div>
            <button onClick={() => addToCart(selected)} style={{ background: "#ff7a00", border: 0, padding: "12px", borderRadius: 20, width: "100%", marginTop: 16, fontWeight: 800 }}>Add to Cart - {selected.price} Pi</button>
            <button onClick={() => setSelected(null)} style={{ background: "#eee", border: 0, padding: "10px", borderRadius: 20, width: "100%", marginTop: 8 }}>Close</button>
          </div>
        </div>
      )}

      {showCart && (
        <div style={{ position: "fixed", inset: 0, background: "#000", padding: 16, overflowY: "auto" }}>
          <h2>Your Cart</h2>
          {cart.map((c, i) => <p key={i}>{c.name} - {c.color} / {c.size} - {c.price} Pi x {c.qty}</p>)}
          <h3>Total: {total.toFixed(2)} Pi</h3>
          <p style={{ fontSize: 12, color: "#aaa" }}>Delivery: 0.0001 Pi if Delivery selected. Pickup is Free.</p>
          <button onClick={payWithPi} style={{ background: "#ff7a00", border: 0, padding: "14px", borderRadius: 20, width: "100%", fontWeight: 800 }}>Pay with Pi - {total.toFixed(2)} Pi</button>
          <button onClick={payBarcode} style={{ background: "#333", color: "#fff", border: 0, padding: "14px", borderRadius: 20, width: "100%", marginTop: 8 }}>Pay with Barcode at Pickup</button>
          <button onClick={() => setShowCart(false)} style={{ background: "#eee", color: "#000", border: 0, padding: "10px", borderRadius: 20, width: "100%", marginTop: 8 }}>Close Cart</button>
        </div>
      )}
    </div>
  );
   }
