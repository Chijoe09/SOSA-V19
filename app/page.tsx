"use client";
import { useEffect, useState } from "react";

/*
SOSA MEMORY - DO NOT DELETE:
- Pickup: No. 1, ODICHE STREET, COKER Aguda, ORILE, LAGOS. - Self Pickup Free, ONLY at payment, NOT under app
- Delivery: 0.0001 Pi (1-2 days Lagos, 4-7 days outside Lagos)
- Cart: (X) must remove ONLY that 1 item - e.g. 11 items -> tap X -> 10 remain
- History: save to sosa_orders, Admin shows Total Records + Total Pi
- Save order ONLY in onReadyForServerCompletion after Wallet confirms
- Memo: Name | Phone | PICKUP/DELIVERY address
- Parked: Leaderboard, Rewards 1Pi=10pts, New Arrivals, Follow, Share, SOSA-Social
*/

const PRODUCTS = [
  { name: "Classic Heel", price: 0.05, cat: "Footwear" },
  { name: "Royal Heel", price: 0.04, cat: "Footwear" },
  { name: "Lagos Heel", price: 0.03, cat: "Footwear" },
  { name: "Classic Flat", price: 0.05, cat: "Footwear" },
  { name: "Royal Flat", price: 0.04, cat: "Footwear" },
  { name: "Lagos Flat", price: 0.03, cat: "Footwear" },
  { name: "Executive Flat", price: 0.05, cat: "Footwear" },
  { name: "Heritage Flat", price: 0.04, cat: "Footwear" },
  { name: "Classic Palm Slide", price: 0.04, cat: "Footwear" },
  { name: "Royal Palm Slide", price: 0.03, cat: "Footwear" },
  { name: "Lagos Palm Slide", price: 0.02, cat: "Footwear" },
  { name: "Classic Cross Bag", price: 0.05, cat: "Bags" },
  { name: "Royal Cross Bag", price: 0.04, cat: "Bags" },
  { name: "Lagos Cross Bag", price: 0.03, cat: "Bags" },
  { name: "Classic Hand Bag", price: 0.05, cat: "Bags" },
  { name: "Royal Hand Bag", price: 0.04, cat: "Bags" },
  { name: "Lagos Hand Bag", price: 0.03, cat: "Bags" },
  { name: "Classic Top", price: 0.04, cat: "Tops" },
  { name: "Royal Top", price: 0.03, cat: "Tops" },
  { name: "Lagos Top", price: 0.02, cat: "Tops" },
  { name: "Classic Suit", price: 0.05, cat: "Suits" },
  { name: "Royal Suit", price: 0.04, cat: "Suits" },
  { name: "Lagos Suit", price: 0.03, cat: "Suits" },
  { name: "Ankara Jacket Red", price: 0.05, cat: "Traditional Wears" },
  { name: "Ankara Jacket Blue", price: 0.04, cat: "Traditional Wears" },
  { name: "Ankara Jacket Green", price: 0.03, cat: "Traditional Wears" },
  { name: "Ankara Jacket Gold", price: 0.05, cat: "Traditional Wears" },
  { name: "Traditional Wear Classic", price: 0.05, cat: "Traditional Wears" },
  { name: "Traditional Wear Royal", price: 0.04, cat: "Traditional Wears" },
  { name: "Female Dress Classic", price: 0.05, cat: "Female" },
  { name: "Female Dress Royal", price: 0.04, cat: "Female" },
];

const COLORS = ["Black", "White", "Brown", "Red", "Blue", "Grey"];
const SIZES = ["S", "M", "L", "XL", "XXL", "3XL"];
const PICKUP_ADDRESS = "No. 1, ODICHE STREET, COKER Aguda, ORILE, LAGOS.";
const PICKUP_INFO = "Self Pickup (Free): No. 1, ODICHE STREET, COKER Aguda, ORILE, LAGOS.";
const DELIVERY_INFO = "Delivery: 0.0001 Pi (1-2 days Lagos, 4-7 days outside Lagos)";

const getPi = () => { if (typeof window === "undefined") return null; return (window as any).Pi || null; };

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [color, setColor] = useState("Black");
  const [size, setSize] = useState("L");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState("delivery");
  const [address, setAddress] = useState("");
  const [pickupPoint, setPickupPoint] = useState(PICKUP_ADDRESS);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://sdk.minepi.com/pi-sdk.js";
    s.onload = () => { const Pi = getPi(); if (Pi) { Pi.init({ version: "2.0", sandbox: true }); setSdkReady(true); } };
    document.head.appendChild(s);
  }, []);

  const login = async () => {
    const Pi = getPi(); if (!Pi) return alert("Pi SDK not loaded yet.");
    try {
      const auth = await Pi.authenticate(["username", "payments"], (p: any) => { fetch("/api/pi/approve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paymentId: p.paymentId }) }); });
      setUser(auth.user); setStatus("Welcome " + auth.user.username); setTimeout(() => setStatus(""), 3000);
    } catch (e) { alert("Login failed"); }
  };

  const addToCart = () => { if (!selected) return; setCart([...cart, { ...selected, color, size, qty: 1 }]); setSelected(null); setStatus("Added to cart"); setTimeout(() => setStatus(""), 2000); };
  // (X) - removes ONLY that one item
  const removeItem = (index: number) => { setCart(cart.filter((_, i) => i !== index)); };

  const total = cart.reduce((a, c) => a + c.price * c.qty, 0);
  const deliveryFee = method === "delivery" ? 0.0001 : 0;
  const grandTotal = total + deliveryFee;

  const saveOrder = (txid: string, barcode: string, snap: any) => {
    const order = { id: barcode || ("SOSA-" + Date.now()), date: new Date().toLocaleString(), buyer: user?.username || snap.buyer || "Guest", name: snap.name, phone: snap.phone, method: snap.method, address: snap.method === "delivery" ? snap.address : snap.pickupPoint, items: snap.cart.map((c: any) => `${c.name} - ${c.color}/${c.size} x${c.qty}`).join(", "), total: snap.grandTotal, txid };
    const old = JSON.parse(localStorage.getItem("sosa_orders") || "[]"); old.unshift(order); localStorage.setItem("sosa_orders", JSON.stringify(old));
  };

  const pay = async () => {
    if (cart.length === 0) return alert("Cart is empty");
    if (!fullName || !phone) return alert("Please enter your Full Name and Phone Number first");
    if (method === "delivery" && !address) return alert("Please enter your Delivery Address");
    if (!user) return alert("Please Login with Pi first");
    const Pi = getPi(); if (!Pi) return alert("Pi SDK not ready");
    const snap = { cart: [...cart], name: fullName, phone, method, address, pickupPoint, grandTotal, buyer: user.username };
    const memo = `SOSA Order - ${cart.map((c) => c.name).join(", ")} | ${fullName} | ${phone} | ${method === "delivery" ? "DELIVERY: " + address : "PICKUP: " + pickupPoint}`;
    let saved = false;
    try {
      await Pi.createPayment({ amount: grandTotal, memo: memo.slice(0, 200), metadata: { name: fullName, phone, method, address: method === "delivery" ? address : pickupPoint } },
        {
          onReadyForServerApproval: (paymentId: string) => fetch("/api/pi/approve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paymentId }) }),
          onReadyForServerCompletion: (paymentId: string, txid: string) => { if (!saved) { saved = true; saveOrder(txid, "", snap); } return fetch("/api/pi/complete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paymentId, txid }) }); },
          onCancel: () => alert("Payment cancelled"), onError: (e: any) => alert("Payment error: " + e.message),
          onIncompletePaymentFound: (p: any) => { fetch("/api/pi/complete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paymentId: p.paymentId, txid: p.transaction?.txid }) }); },
        });
      if (saved) { setCart([]); setShowCart(false); alert("Payment SUCCESS! Order saved. We will contact you on " + phone); } else { alert("Payment finished. Please check Admin History."); }
    } catch (e: any) { alert(e.message); }
  };

  const payBarcode = () => {
    if (!fullName || !phone) return alert("Enter Name and Phone first");
    if (method === "delivery" && !address) return alert("Enter Delivery Address");
    const code = "SOSA-" + Math.floor(100000 + Math.random() * 900000);
    const snap = { cart: [...cart], name: fullName, phone, method, address, pickupPoint, grandTotal, buyer: user?.username || "Guest" };
    saveOrder("", code, snap); setCart([]);
    alert(`Barcode Payment: Your barcode ${code} - Show it at pickup. Total: ${grandTotal} Pi. We will contact ${phone}`);
  };

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", padding: 16, fontFamily: "sans-serif" }}>
      <h1>SOPHISTICATED SAMPLES</h1><p>SOSA-outfits. Made in Nigeria</p>
      <p style={{ color: "orange", fontSize: 13 }}>{sdkReady ? "Pi SDK Ready" : "Loading Pi..."} {user ? `| @${user.username}` : ""} {status ? `| ${status}` : ""}</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {user ? (<button onClick={() => setUser(null)} style={{ background: "orange", padding: "10px 16px", borderRadius: 20, border: 0, fontWeight: "bold" }}>Logout @{user.username}</button>) : (<button onClick={login} style={{ background: "orange", padding: "10px 16px", borderRadius: 20, border: 0, fontWeight: "bold" }}>Login with Pi</button>)}
        <button onClick={() => setShowCart(true)} style={{ background: "#fff", padding: "10px 16px", borderRadius: 20, border: 0, fontWeight: "bold" }}>Cart ({cart.length}) - {total.toFixed(2)} Pi</button>
        <a href="/admin" style={{ background: "#333", color: "#fff", padding: "10px 12px", borderRadius: 20, textDecoration: "none", fontSize: 13 }}>Admin / Orders</a>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {PRODUCTS.map((p, i) => (<div key={i} style={{ background: "#111", borderRadius: 12, padding: 10, textAlign: "center" }}><div style={{ background: "#eee", color: "#000", padding: 18, borderRadius: 8, fontWeight: "bold" }}>{p.name}</div><p style={{ fontSize: 13, margin: "8px 0" }}>{p.name} - {p.price} Pi - {p.cat}</p><button onClick={() => { setSelected(p); setColor("Black"); setSize("L"); }} style={{ background: "orange", width: "100%", padding: 10, borderRadius: 20, border: 0, fontWeight: "bold" }}>Add to Cart</button></div>))}
      </div>
      {/* NO ADDRESS UNDER APP - REMOVED ON PURPOSE */}

      {selected && (<div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}><div style={{ background: "#fff", color: "#000", padding: 20, borderRadius: 16, width: "90%", maxWidth: 360 }}><h3>{selected.name} - {selected.price} Pi</h3><p>Colour</p><div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{COLORS.map((c) => (<button key={c} onClick={() => setColor(c)} style={{ padding: "8px 12px", borderRadius: 20, background: color === c ? "orange" : "#eee", border: 0 }}>{c}</button>))}</div><p>Size</p><div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{SIZES.map((s) => (<button key={s} onClick={() => setSize(s)} style={{ padding: "8px 12px", borderRadius: 20, background: size === s ? "orange" : "#eee", border: 0 }}>{s}</button>))}</div><button onClick={addToCart} style={{ background: "orange", width: "100%", padding: 12, borderRadius: 20, border: 0, fontWeight: "bold", marginTop: 16 }}>Add to Cart - {selected.price} Pi</button><button onClick={() => setSelected(null)} style={{ width: "100%", padding: 10, marginTop: 8, borderRadius: 20 }}>Close</button></div></div>)}

      {showCart && (<div style={{ position: "fixed", inset: 0, background: "#000", padding: 20, overflowY: "auto", zIndex: 60 }}>
        <h2>Your Cart</h2>
        {cart.map((c, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#111", padding: 10, borderRadius: 10, marginBottom: 8 }}>
            <span>{c.name} - {c.color} / {c.size} - {c.price} Pi x {c.qty}</span>
            <button onClick={() => removeItem(i)} style={{ background: "red", color: "#fff", border: 0, borderRadius: 20, padding: "6px 12px", fontWeight: "bold" }}>X</button>
          </div>
        ))}
        <p><b>Total: {total.toFixed(2)} Pi</b></p>
        <h3>--- CHECKOUT DETAILS ---</h3>
        <input placeholder="Full Name *" value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ width: "100%", padding: 12, marginBottom: 8, borderRadius: 10, boxSizing: "border-box" }} />
        <input placeholder="Phone Number / WhatsApp *" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: "100%", padding: 12, marginBottom: 12, borderRadius: 10, boxSizing: "border-box" }} />
        <div style={{ background: "#111", padding: 12, borderRadius: 12, marginBottom: 12, fontSize: 13, lineHeight: 1.6 }}>
          <div>🏪 {PICKUP_INFO}</div><div style={{ marginTop: 6 }}>🚚 {DELIVERY_INFO}</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setMethod("delivery")} style={{ flex: 1, padding: 12, borderRadius: 20, background: method === "delivery" ? "orange" : "#333", color: "#fff", border: 0, fontWeight: "bold" }}>🚚 Delivery (+0.0001 Pi)</button>
          <button onClick={() => setMethod("pickup")} style={{ flex: 1, padding: 12, borderRadius: 20, background: method === "pickup" ? "orange" : "#333", color: "#fff", border: 0, fontWeight: "bold" }}>🏪 Self Pickup (Free)</button>
        </div>
        {method === "delivery" ? (<textarea placeholder="Delivery Address - House No, Street, Area, City, State *" value={address} onChange={(e) => setAddress(e.target.value)} style={{ width: "100%", padding: 12, marginTop: 12, borderRadius: 10, minHeight: 70, boxSizing: "border-box" }} />) : (<div style={{ marginTop: 12 }}><p>Self Pickup Address:</p><select value={pickupPoint} onChange={(e) => setPickupPoint(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10 }}><option value={PICKUP_ADDRESS}>{PICKUP_ADDRESS}</option></select><p style={{ fontSize: 13, background: "#222", padding: 10, borderRadius: 10, marginTop: 8 }}>🏪 Self Pickup (Free): {PICKUP_ADDRESS}<br/>Show your barcode at this pickup point.</p></div>)}
        <p style={{ marginTop: 12 }}><b>Grand Total: {grandTotal.toFixed(4)} Pi</b> {method === "delivery" ? "(incl. delivery - 1-2 days Lagos, 4-7 days outside Lagos)" : "(self pickup free)"}</p>
        <button onClick={pay} style={{ background: "orange", width: "100%", padding: 14, borderRadius: 20, border: 0, fontWeight: "bold", marginTop: 8 }}>Pay with Pi - {grandTotal.toFixed(4)} Pi</button>
        <button onClick={payBarcode} style={{ background: "#333", color: "#fff", width: "100%", padding: 14, borderRadius: 20, border: 0, marginTop: 8 }}>Pay with Barcode at Pickup</button>
        <button onClick={() => setShowCart(false)} style={{ width: "100%", padding: 12, borderRadius: 20, marginTop: 8 }}>Close Cart</button>
      </div>)}
    </div>
  );
}
