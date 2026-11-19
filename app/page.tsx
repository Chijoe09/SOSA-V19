"use client";
import { useState, useEffect } from "react";

const PRODUCTS = [
  { id: 1, name: "Classic Heel", cat: "SOSA • HEEL", price: "0.05 Pi", color: "Black", desc: "Elegant classic heel for church, wedding & office. Comfortable sole, made in Nigeria." },
  { id: 2, name: "Royal Heel", cat: "SOSA • HEEL", price: "0.04 Pi", color: "Black", desc: "Royal look, soft inner pad. Perfect for owambe & special occasions." },
  { id: 3, name: "Lagos Heel", cat: "SOSA • HEEL", price: "0.03 Pi", color: "Black", desc: "Light Lagos everyday heel. Easy to walk in, strong & durable." },
  { id: 4, name: "Executive Heel", cat: "SOSA • HEEL", price: "0.05 Pi", color: "Black", desc: "Sharp executive heel for office & meetings. Clean, classy finish." },
  { id: 5, name: "Heritage Heel", cat: "SOSA • HEEL", price: "0.04 Pi", color: "Black", desc: "Heritage design with Nigerian style. Strong, beautiful, trusted." },
  { id: 6, name: "Classic Flat", cat: "SOSA • FLAT", price: "0.05 Pi", color: "Black", desc: "Classic flat for everyday comfort. Church, office, market, all day." },
  { id: 7, name: "Royal Flat", cat: "SOSA • FLAT", price: "0.04 Pi", color: "Black", desc: "Royal flat with soft cushion. Elegant but comfortable." },
  { id: 8, name: "Lagos Flat", cat: "SOSA • FLAT", price: "0.03 Pi", color: "Black", desc: "Light Lagos flat. Walk anywhere in Lagos with ease." },
  { id: 9, name: "Executive Flat", cat: "SOSA • FLAT", price: "0.05 Pi", color: "Black", desc: "Executive flat for work. Neat, professional, comfortable." },
  { id: 10, name: "Heritage Flat", cat: "SOSA • FLAT", price: "0.04 Pi", color: "Black", desc: "Heritage flat - Nigerian craft, modern comfort." },
  { id: 11, name: "Classic Palm Slide", cat: "SOSA • SLIDE", price: "0.04 Pi", color: "Black", desc: "Classic palm slide. Easy to wear, easy to wash, very comfortable." },
  { id: 12, name: "Royal Palm Slide", cat: "SOSA • SLIDE", price: "0.04 Pi", color: "Black", desc: "Royal palm slide - soft, classy, premium feel." },
  { id: 13, name: "Lagos Palm Slide", cat: "SOSA • SLIDE", price: "0.03 Pi", color: "Black", desc: "Lagos palm slide for home & street. Light & strong." },
  { id: 14, name: "Executive Palm Slide", cat: "SOSA • SLIDE", price: "0.05 Pi", color: "Black", desc: "Executive palm slide - clean look for smart casual." },
  { id: 15, name: "Heritage Palm Slide", cat: "SOSA • SLIDE", price: "0.04 Pi", color: "Black", desc: "Heritage palm slide - our signature Nigerian slide." },
  { id: 16, name: "SOSA Signature Heel", cat: "NEW #16 • FLAGSHIP", price: "0.06 Pi", color: "Black", desc: "NEW #16 - Our flagship. Signature SOSA heel, premium finish, limited stock. The one everyone will ask about." },
  { id: 17, name: "Gold Bag", cat: "SOSA • BAG", price: "0.06 Pi", color: "Gold", desc: "Luxury gold bag for owambe, church & outing. Strong, classy, made in Nigeria." },
  { id: 18, name: "Silver Bag", cat: "SOSA • BAG", price: "0.06 Pi", color: "Silver", desc: "Elegant silver bag for owambe, church & outing. Light, strong, premium finish." },
];

const SIZES = ["S", "M", "L", "XL", "XXL"];

function SosaLogo() {
  return (
    <div style={{ width: 56, height: 62, background: "#FFF8DC", borderRadius: 10, overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="54" height="60" viewBox="0 0 54 60" style={{ display: "block" }}>
        <defs><clipPath id="egg2"><ellipse cx="27" cy="30" rx="25" ry="28" /></clipPath></defs>
        <ellipse cx="27" cy="30" rx="25" ry="28" fill="#fff" />
        <g clipPath="url(#egg2)">
          <rect x="0" y="0" width="54" height="60" fill="#fff" />
          <path d="M0 12 Q27 4 54 10 L54 20 Q27 12 0 20 Z" fill="#0096e6" />
          <path d="M0 26 Q27 18 54 24 L54 34 Q27 26 0 34 Z" fill="#ffc107" />
          <path d="M0 40 Q27 32 54 38 L54 48 Q27 40 0 48 Z" fill="#e53935" />
          <path d="M0 52 Q27 44 54 52 L54 60 L0 60 Z" fill="#00843d" />
        </g>
        <text x="27" y="52" textAnchor="middle" style={{ fontSize: 8.5, fontWeight: 900, fill: "#00843d", fontFamily: "Arial" }}>SOSA</text>
        <text x="27" y="59" textAnchor="middle" style={{ fontSize: 6.5, fontWeight: 700, fill: "#fff", fontFamily: "Arial" }}>Outfits</text>
      </svg>
    </div>
  );
}

function Barcode({ code }: { code: string }) {
  const bars = code.split("").map((ch, i) => ({ w: (ch.charCodeAt(0) % 4) + 1, black: i % 2 === 0 }));
  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: "10px 12px 8px", marginTop: 10 }}>
      <div style={{ display: "flex", alignItems: "flex-end", height: 48, gap: 2, justifyContent: "center" }}>
        {bars.map((b, i) => (<div key={i} style={{ width: b.w, height: 48, background: b.black ? "#000" : "#fff" }} />))}
        <div style={{ width: 3, height: 48, background: "#000" }} />
        <div style={{ width: 1, height: 48, background: "#000" }} />
        <div style={{ width: 2, height: 48, background: "#000" }} />
      </div>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 800, letterSpacing: 2, color: "#000", marginTop: 4 }}>{code}</div>
      <div style={{ textAlign: "center", fontSize: 10, color: "#555" }}>Show this barcode at pickup - SOSA Outfits</div>
    </div>
  );
}

export default function Home() {
  const [cart, setCart] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  // Leadership points: 1 Pi = 10 pts, only paid orders count
const myPoints = orders
  .filter((o) => o.status && o.status.includes("PAID"))
  .reduce((sum, o) => sum + parseFloat(o.total || "0"), 0) * 10;
  const [selected, setSelected] = useState<any>(null);
  const [dark, setDark] = useState(true);
  const [panel, setPanel] = useState<string | null>(null);
  const [payStatus, setPayStatus] = useState<string>("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryType, setDeliveryType] = useState("delivery");
  const [choices, setChoices] = useState<any>({});
  const [orderCode] = useState(() => "SOSA-" + Math.floor(100000 + Math.random() * 900000));

  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://sdk.minepi.com/pi-sdk.js"; s.async = true;
    s.onload = () => { try { (window as any).Pi.init({ version: "2.0", sandbox: true }); } catch {} };
    document.body.appendChild(s);
  }, []);

  const bg = dark ? "#000" : "#f2f2f2";
  const mainText = dark ? "#fff" : "#000";
  const subText2 = dark ? "#aaa" : "#777";
  const getChoice = (p: any) => choices[p.id] || { size: "M", color: p.color };
  const addToCart = (p: any) => {
    const ch = getChoice(p);
    const key = p.id + "-" + ch.color + "-" + ch.size;
    const f = cart.find((c) => c.key === key);
    if (f) setCart(cart.map((c) => c.key === key ? { ...c, qty: c.qty + 1 } : c));
    else setCart([...cart, { ...p, key, size: ch.size, color: ch.color, qty: 1 }]);
  };
  const inc = (key: string) => setCart(cart.map((c) => c.key === key ? { ...c, qty: c.qty + 1 } : c));
  const dec = (key: string) => setCart(cart.map((c) => c.key === key ? { ...c, qty: Math.max(1, c.qty - 1) } : c));
  const removeItem = (key: string) => setCart(cart.filter((c) => c.key !== key));
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const subtotal = cart.reduce((s, c) => s + parseFloat(c.price) * c.qty, 0);
  const deliveryFee = deliveryType === "delivery" ? 0.0001 : 0;
  const grandTotal = (subtotal + deliveryFee).toFixed(4);

  const saveOrder = (status: string, txid?: string, code?: string) => {
    const newOrder = { id: Date.now(), code: code || orderCode, items: [...cart], total: grandTotal, subtotal: subtotal.toFixed(4), deliveryFee, deliveryType, fullName, phone, address, date: new Date().toLocaleString(), txid: txid || "", status };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setPanel("orders");
    setPayStatus("");
  };

  // TEST PI - NOW WITH REAL APPROVAL VIA BACKEND
  const checkout = async () => {
    if (cart.length === 0) return;
    if (!fullName.trim() || !phone.trim()) { setPayStatus("❌ Please enter Full Name and Phone Number / WhatsApp first."); return; }
    if (deliveryType === "delivery" && !address.trim()) { setPayStatus("❌ Please enter Delivery Address."); return; }
    const Pi = (window as any).Pi;
    if (!Pi) { setPayStatus("❌ Open this site in Pi Browser to pay with Test Pi."); return; }
    setPayStatus("⏳ Opening Pi Test Wallet... Approve in Pi Browser.");
    try {
      const auth = await Pi.authenticate(["username", "payments"], (p: any) => {});
      // Handle any unfinished payment from last expired try
      try { await Pi.getIncompletePayments?.((p: any) => {}); } catch {}
      await Pi.createPayment({ amount: parseFloat(grandTotal), memo: "SOSA Outfits - " + fullName + " - " + deliveryType, metadata: { fullName, phone, address, deliveryType, items: cart, orderCode } }, {
        onReadyForServerApproval: async (paymentId: string) => {
          setPayStatus("⏳ Wallet opened - Approving payment now (this is what failed before)...");
          // THIS IS THE FIX: actually call backend to approve, don't just wait
          const res = await fetch("/api/pi/approve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paymentId }) });
          if (!res.ok) { setPayStatus("❌ Approval failed - Check Vercel PI_API_KEY. See steps below. Order NOT lost."); throw new Error("approve failed"); }
          setPayStatus("✅ Approved! Now confirm in your Wallet...");
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          // Tell backend to complete it
          await fetch("/api/pi/complete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paymentId, txid }) }).catch(() => {});
          saveOrder("✅ TEST PAID - Pi Test Payment Confirmed", txid, orderCode);
        },
        onCancel: () => { setPayStatus("❌ Payment cancelled. No Test Pi taken. Your cart is still saved."); },
        onError: (e: any) => { setPayStatus("❌ " + (e?.message || "Test Pi error. If it says approval failed, do Step 2 below.")); },
      });
    } catch (e: any) { setPayStatus("❌ " + (e?.message || "Test Pi error. Try again in Pi Browser.")); }
  };

  const btnStyle: any = { background: dark ? "#fff" : "#000", color: dark ? "#000" : "#fff", border: 0, borderRadius: 20, padding: "7px 12px", fontSize: 12, fontWeight: 700 };
  const inputStyle: any = { width: "100%", padding: "12px", borderRadius: 10, border: "none", fontSize: 14, boxSizing: "border-box" as any, marginTop: 8, background: "#fff", color: "#000" };

  return (
    <div style={{ background: bg, color: mainText, minHeight: "100vh", fontFamily: "Arial, sans-serif", paddingBottom: 20 }}>
      <div style={{ padding: "12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <SosaLogo />
          <div>
            <h1 style={{ fontSize: 22, lineHeight: 1.1, margin: 0, fontWeight: 900 }}>SOPHISTICATED<br />SAMPLES</h1>
            <p style={{ fontSize: 14, margin: "4px 0 0", fontWeight: 900, color: mainText }}>SOSA Outfits</p>
            <p style={{ fontSize: 11, margin: "2px 0 0", color: subText2 }}>Test Pi @chijo09 | {myPoints.toFixed(1)} pts | 18 Products</p>
          </div>
        </div>
        <button onClick={() => setDark(!dark)} style={{ background: dark ? "#f5b301" : "#000", color: dark ? "#000" : "#fff", border: 0, borderRadius: 20, padding: "6px 10px", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{dark ? "☀️ Light" : "🌙 Dark"}</button>
      </div>
      <div style={{ padding: "0 12px", display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button onClick={() => setPanel("logout")} style={btnStyle}>Logout</button>
        <button onClick={() => setPanel("cart")} style={btnStyle}>Cart ({cartCount})</button>
        <button onClick={() => setPanel("orders")} style={btnStyle}>My Orders</button>
        <button onClick={() => setPanel("board")} style={{ background: "#f5b301", color: "#000", border: 0, borderRadius: 20, padding: "7px 12px", fontSize: 12, fontWeight: 700 }}>Leadership Board</button>
      </div>
      <p style={{ padding: "0 12px", fontSize: 12 }}>👇 Tap any product TO SEE details before you buy. 18 Products - Grid View</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, padding: 8 }}>
        {PRODUCTS.map((p) => {
          const ch = getChoice(p);
          return (
          <div key={p.id} style={{ background: "#fff", color: "#000", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ background: "#000", textAlign: "center", padding: "8px 4px", height: 70, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ color: "#f5b301", fontSize: 8, fontWeight: 700 }}>{p.cat}</div>
              <div style={{ color: "#fff", fontSize: 11, fontWeight: 800, lineHeight: 1.2 }}>{p.name}</div>
              <div style={{ color: "#aaa", fontSize: 8 }}>📷 Photo Coming Soon</div>
              <div style={{ background: "#fff", color: "#000", fontSize: 8, borderRadius: 20, padding: "2px 6px", margin: "4px auto 0", display: "inline-block" }}>{ch.color}</div>
            </div>
            <div style={{ padding: 6, display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 800, lineHeight: 1.2 }}>{p.name}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#b45309" }}>{p.price} • {ch.color}</div>
              <div style={{ fontSize: 9, lineHeight: 1.3, color: "#555", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.desc}</div>
              <div style={{ display: "flex", gap: 4, marginTop: "auto" }}>
                <select value={ch.size} onChange={(e) => setChoices({ ...choices, [p.id]: { ...ch, size: e.target.value } })} style={{ flex: 1, fontSize: 9, padding: 3, border: "1px solid #ddd", borderRadius: 5 }}>{SIZES.map((s) => <option key={s} value={s}>{s}</option>)}</select>
                <select value={ch.color} onChange={(e) => setChoices({ ...choices, [p.id]: { ...ch, color: e.target.value } })} style={{ flex: 1, fontSize: 9, padding: 3, border: "1px solid #ddd", borderRadius: 5 }}><option>Black</option><option>Red</option><option>Gold</option><option>Silver</option></select>
              </div>
              <button onClick={() => setSelected({ ...p, size: ch.size, color: ch.color })} style={{ width: "100%", background: "#000", color: "#fff", border: 0, borderRadius: 6, padding: "6px 0", fontSize: 10, fontWeight: 700 }}>👁 View</button>
              <button onClick={() => addToCart(p)} style={{ width: "100%", background: "#f5b301", color: "#000", border: 0, borderRadius: 6, padding: "6px 0", fontSize: 10, fontWeight: 700 }}>Add to Cart</button>
            </div>
          </div>
          );
        })}
      </div>
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: "#fff", color: "#000", width: "100%", maxWidth: 480, borderRadius: "16px 16px 0 0", padding: 16 }}>
            <button onClick={() => setSelected(null)} style={{ background: "#000", color: "#fff", border: 0, borderRadius: 20, padding: "6px 12px", fontSize: 12 }}>← Back to Shop</button>
            <div style={{ background: "#000", textAlign: "center", padding: 14, borderRadius: 10, marginTop: 10 }}>
              <div style={{ color: "#f5b301", fontSize: 10, fontWeight: 700 }}>{selected.cat}</div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>{selected.name}</div>
              <div style={{ color: "#aaa", fontSize: 10 }}>📷 Photo Coming Soon</div>
            </div>
            <p style={{ fontWeight: 800, margin: "10px 0 0" }}>{selected.name}</p>
            <p style={{ color: "#b45309", fontWeight: 800, margin: "4px 0" }}>{selected.price} • Colour: {selected.color} • Size: {selected.size}</p>
            <p style={{ fontSize: 13, color: "#444" }}>{selected.desc}</p>
            <button onClick={() => { addToCart(selected); setSelected(null); }} style={{ width: "100%", background: "#f5b301", border: 0, borderRadius: 20, padding: "10px 0", fontWeight: 800, marginTop: 10 }}>Add to Cart - {selected.price}</button>
          </div>
        </div>
      )}
      {panel === "cart" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 60, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: "#000", color: "#fff", width: "100%", maxWidth: 480, maxHeight: "92vh", overflowY: "auto", borderRadius: "16px 16px 0 0", padding: 16 }}>
            <button onClick={() => { setPanel(null); setPayStatus(""); }} style={{ background: "#fff", color: "#000", border: 0, borderRadius: 20, padding: "6px 12px", fontSize: 12, fontWeight: 700 }}>← Back to Shop</button>
            <h2 style={{ margin: "14px 0", fontSize: 26 }}>Your Cart</h2>
            {payStatus && <div style={{ background: "#fff3cd", color: "#000", borderRadius: 8, padding: 10, fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{payStatus}</div>}
            {cart.length === 0 && <p style={{ fontSize: 13, color: "#ccc" }}>Your cart is empty. Tap Add to Cart on any product.</p>}
            {cart.map((item) => (
              <div key={item.key} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, background: "#111", borderRadius: 10, padding: "12px 12px" }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{item.name} - {item.color} / {item.size} - {item.price} x {item.qty}</span>
                  <button onClick={() => removeItem(item.key)} style={{ width: 30, height: 30, minWidth: 30, borderRadius: "50%", background: "#ff0000", color: "#fff", border: 0, fontWeight: 900, fontSize: 14 }}>X</button>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, paddingLeft: 4 }}>
                  <button onClick={() => dec(item.key)} style={{ width: 30, height: 30, borderRadius: "50%", border: "1px solid #555", background: "#222", color: "#fff", fontSize: 18, fontWeight: 900 }}>−</button>
                  <span style={{ fontWeight: 800, fontSize: 14 }}>{item.qty}</span>
                  <button onClick={() => inc(item.key)} style={{ width: 30, height: 30, borderRadius: "50%", border: 0, background: "#f5b301", color: "#000", fontSize: 18, fontWeight: 900 }}>+</button>
                </div>
              </div>
            ))}
            <p style={{ fontSize: 16, fontWeight: 800, margin: "10px 0" }}>Total: {subtotal.toFixed(2)} Pi</p>
            <h3 style={{ fontSize: 18, margin: "16px 0 6px" }}>--- CHECKOUT DETAILS ---</h3>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name *" style={inputStyle} />
            <input type="tel" inputMode="tel" autoComplete="tel" pattern="[0-9+ ]*" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number / WhatsApp *" style={inputStyle} />
            <p style={{ fontSize: 13, lineHeight: 1.6, margin: "14px 0 0" }}>🏪 Self Pickup (Free): No. 1, ODICHE STREET, COKER Aguda, ORILE, LAGOS.</p>
            <p style={{ fontSize: 13, lineHeight: 1.6, margin: "6px 0 10px" }}>🚚 Delivery: 0.0001 Pi (1-2 days Lagos, 4-7 days outside Lagos)</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setDeliveryType("delivery")} style={{ flex: 1, padding: "12px 6px", borderRadius: 10, border: 0, background: deliveryType === "delivery" ? "#f5a301" : "#333", color: deliveryType === "delivery" ? "#000" : "#fff", fontWeight: 800, fontSize: 12 }}>🚚 Delivery (+0.0001 Pi)</button>
              <button onClick={() => setDeliveryType("pickup")} style={{ flex: 1, padding: "12px 6px", borderRadius: 10, border: 0, background: deliveryType === "pickup" ? "#f5a301" : "#333", color: deliveryType === "pickup" ? "#000" : "#fff", fontWeight: 800, fontSize: 12 }}>🏪 Self Pickup (Free)</button>
            </div>
            {deliveryType === "delivery" && <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Delivery Address - House No, Street, Area, City, State *" rows={2} style={{ ...inputStyle, resize: "vertical" as any }} />}
            {deliveryType === "pickup" && <p style={{ fontSize: 12, color: "#ccc", marginTop: 10 }}>Pickup at No.1 ODICHE STREET, COKER Aguda, ORILE, LAGOS. No address needed.</p>}
            <p style={{ fontSize: 15, fontWeight: 800, margin: "14px 0" }}>Grand Total: {grandTotal} Pi {deliveryType === "delivery" ? "(incl. delivery - 1-2 days Lagos, 4-7 days outside Lagos)" : "(pickup - free)"}</p>
            {cart.length > 0 && <Barcode code={orderCode} />}
            {cart.length > 0 && <button onClick={checkout} style={{ width: "100%", background: "#f5b301", color: "#000", border: 0, borderRadius: 20, padding: "12px 0", fontWeight: 800, marginTop: 12 }}>Pay with Pi - {grandTotal} Pi</button>}
            {cart.length > 0 && <button onClick={() => { if (!fullName.trim() || !phone.trim()) { setPayStatus("❌ Enter Full Name + Phone first."); return; } saveOrder("⏳ PENDING - Pay on Pickup / WhatsApp", "", orderCode); }} style={{ width: "100%", background: "#fff", color: "#000", border: 0, borderRadius: 20, padding: "11px 0", fontWeight: 800, marginTop: 8 }}>Save Order as Pending (Pay Later)</button>}
            <button onClick={() => { setPanel(null); setPayStatus(""); }} style={{ width: "100%", background: "transparent", color: "#fff", border: 0, padding: "10px 0", fontWeight: 700 }}>← Back to Shop</button>
          </div>
        </div>
      )}
      {panel === "orders" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 60, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: "#fff", color: "#000", width: "100%", maxWidth: 480, maxHeight: "85vh", overflowY: "auto", borderRadius: "16px 16px 0 0", padding: 16 }}>
            <button onClick={() => setPanel(null)} style={{ background: "#000", color: "#fff", border: 0, borderRadius: 20, padding: "6px 12px", fontSize: 12 }}>← Back to Shop</button>
            <h2 style={{ margin: "10px 0" }}>📦 My Orders ({orders.length})</h2>
            {orders.length === 0 && <p style={{ fontSize: 13, color: "#555" }}>No orders yet.</p>}
            {orders.map((o) => (
              <div key={o.id} style={{ border: "1px solid #eee", borderRadius: 10, padding: 10, marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: "#777" }}>{o.date}</div>
                <div style={{ fontSize: 12 }}><b>Name:</b> {o.fullName} • <b>Phone:</b> {o.phone}</div>
                <div style={{ fontSize: 12 }}><b>{o.deliveryType === "pickup" ? "🏪 Self Pickup (Free)" : "🚚 Delivery"}</b> {o.deliveryType === "delivery" ? "- " + o.address : "- ODICHE STREET, COKER"}</div>
                <div style={{ fontWeight: 800, fontSize: 13 }}>Grand Total: {o.total} Pi (Subtotal {o.subtotal} + Fee {o.deliveryFee})</div>
                {o.items.map((it: any, j: number) => <div key={j} style={{ fontSize: 12 }}>• {it.name} - {it.color} / {it.size} x {it.qty} - {it.price}</div>)}
                <div style={{ fontSize: 12, color: "green", fontWeight: 700, marginTop: 4 }}>{o.status}</div>
                {o.txid && <div style={{ fontSize: 11, color: "#555", wordBreak: "break-all" }}>Tx: {o.txid}</div>}
                <Barcode code={o.code} />
              </div>
            ))}
          </div>
        </div>
      )}
      {panel === "board" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 60, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: "#fff", color: "#000", width: "100%", maxWidth: 480, maxHeight: "85vh", overflowY: "auto", borderRadius: "16px 16px 0 0", padding: 16 }}>
            <button onClick={() => setPanel(null)} style={{ background: "#000", color: "#fff", border: 0, borderRadius: 20, padding: "6px 12px", fontSize: 12 }}>← Back to Shop</button>
            <h2 style={{ margin: "10px 0 4px" }}>🏆 Leadership Board</h2>
            {[ { name: "@chijo09 (You)", pts: myPoints.toFixed(1) + " pts", rank: "1" }, { name: "@sosa_fan1", pts: "12.5 pts", rank: "2" }, { name: "@lagos_queen", pts: "8.0 pts", rank: "3" }, { name: "@owambe_star", pts: "5.5 pts", rank: "4" } ].map((u) => (
              <div key={u.rank} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #eee", padding: "10px 0" }}><span style={{ fontWeight: 800, fontSize: 13 }}>#{u.rank} {u.name}</span><span style={{ color: "#b45309", fontWeight: 800 }}>{u.pts}</span></div>
            ))}
          </div>
        </div>
      )}
      {panel === "logout" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", color: "#000", width: "100%", maxWidth: 360, borderRadius: 16, padding: 20, textAlign: "center" }}>
            <h2 style={{ margin: "0 0 8px" }}>Logout?</h2>
            <p style={{ fontSize: 13, color: "#555" }}>You are logged in as @chijo09.</p>
            <button onClick={() => setPanel(null)} style={{ width: "100%", background: "#000", color: "#fff", border: 0, borderRadius: 20, padding: "10px 0", fontWeight: 800, marginTop: 10 }}>Stay Logged In</button>
            <button onClick={() => { alert("Logged out"); setPanel(null); }} style={{ width: "100%", background: "#eee", border: 0, borderRadius: 20, padding: "10px 0", fontWeight: 800, marginTop: 8 }}>Yes, Logout</button>
          </div>
        </div>
      )}
      <div style={{ textAlign: "center", fontSize: 10, color: subText2, padding: "10px 10px 0" }}>SOSA © 2026 • Made in Nigeria • Pickup No.1 ODICHE STREET, COKER Aguda, ORILE, LAGOS<br />• Owner •</div>
      <div style={{ textAlign: "center", marginTop: 12 }}>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ background: dark ? "#fff" : "#000", color: dark ? "#000" : "#fff", border: 0, borderRadius: 20, padding: "8px 18px", fontSize: 12, fontWeight: 800 }}>^<br />Back Up</button>
      </div>
    </div>
  );
}
