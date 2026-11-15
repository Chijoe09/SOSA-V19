"use client";
import { useState } from "react";

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

// LOGO BACK - BUILT INTO CODE, NO FILE NEEDED - SOSA OUTFITS ATTACHED INSIDE EGG
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

export default function Home() {
  const [cart, setCart] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [dark, setDark] = useState(true);
  const bg = dark ? "#000" : "#f2f2f2";
  const mainText = dark ? "#fff" : "#000";
  const subText2 = dark ? "#aaa" : "#777";

  return (
    <div style={{ background: bg, color: mainText, minHeight: "100vh", fontFamily: "Arial, sans-serif", paddingBottom: 20 }}>
      <div style={{ padding: "12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <SosaLogo />
          <div>
            <h1 style={{ fontSize: 22, lineHeight: 1.1, margin: 0, fontWeight: 900 }}>SOPHISTICATED<br />SAMPLES</h1>
            {/* SOSA OUTFITS - BOLDER - MADE IN NIGERIA REMOVED HERE */}
            <p style={{ fontSize: 14, margin: "4px 0 0", fontWeight: 900, color: mainText }}>SOSA Outfits</p>
            <p style={{ fontSize: 11, margin: "2px 0 0", color: subText2 }}>Pi SDK Ready @chijo09 | 0.0 pts | 18 Products</p>
          </div>
        </div>
        <button onClick={() => setDark(!dark)} style={{ background: dark ? "#f5b301" : "#000", color: dark ? "#000" : "#fff", border: 0, borderRadius: 20, padding: "6px 10px", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <div style={{ padding: "0 12px", display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button style={{ background: dark ? "#fff" : "#000", color: dark ? "#000" : "#fff", border: 0, borderRadius: 20, padding: "5px 10px", fontSize: 11 }}>Logout</button>
        <button style={{ background: dark ? "#fff" : "#000", color: dark ? "#000" : "#fff", border: 0, borderRadius: 20, padding: "5px 10px", fontSize: 11 }}>Cart ({cart.length})</button>
        <button style={{ background: dark ? "#fff" : "#000", color: dark ? "#000" : "#fff", border: 0, borderRadius: 20, padding: "5px 10px", fontSize: 11 }}>My Orders</button>
        <button style={{ background: "#f5b301", color: "#000", border: 0, borderRadius: 20, padding: "5px 10px", fontSize: 11, fontWeight: 700 }}>Leadership Board</button>
      </div>

      <p style={{ padding: "0 12px", fontSize: 12 }}>👇 Tap any product TO SEE details before you buy. 18 Products - Grid View</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, padding: 8 }}>
        {PRODUCTS.map((p) => (
          <div key={p.id} style={{ background: "#fff", color: "#000", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ background: "#000", textAlign: "center", padding: "8px 4px", height: 70, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ color: "#f5b301", fontSize: 8, fontWeight: 700 }}>{p.cat}</div>
              <div style={{ color: "#fff", fontSize: 11, fontWeight: 800, lineHeight: 1.2 }}>{p.name}</div>
              <div style={{ color: "#aaa", fontSize: 8 }}>📷 Photo Coming Soon</div>
              <div style={{ background: "#fff", color: "#000", fontSize: 8, borderRadius: 20, padding: "2px 6px", margin: "4px auto 0", display: "inline-block" }}>{p.color}</div>
            </div>
            <div style={{ padding: 6, display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 800, lineHeight: 1.2 }}>{p.name}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#b45309" }}>{p.price} • {p.color}</div>
              <div style={{ fontSize: 9, lineHeight: 1.3, color: "#555", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.desc}</div>
              <div style={{ display: "flex", gap: 4, marginTop: "auto" }}>
                <select style={{ flex: 1, fontSize: 9, padding: 3, border: "1px solid #ddd", borderRadius: 5 }}><option>M</option><option>S</option><option>L</option></select>
                <select style={{ flex: 1, fontSize: 9, padding: 3, border: "1px solid #ddd", borderRadius: 5 }}><option>{p.color}</option><option>Black</option></select>
              </div>
              <button onClick={() => setSelected(p)} style={{ width: "100%", background: "#000", color: "#fff", border: 0, borderRadius: 6, padding: "6px 0", fontSize: 10, fontWeight: 700 }}>👁 View</button>
              <button onClick={() => setCart([...cart, p])} style={{ width: "100%", background: "#f5b301", color: "#000", border: 0, borderRadius: 6, padding: "6px 0", fontSize: 10, fontWeight: 700 }}>Add to Cart</button>
            </div>
          </div>
        ))}
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
            <p style={{ color: "#b45309", fontWeight: 800, margin: "4px 0" }}>{selected.price} • Colour: {selected.color}</p>
            <p style={{ fontSize: 13, color: "#444" }}>{selected.desc}</p>
            <button onClick={() => { setCart([...cart, selected]); setSelected(null); }} style={{ width: "100%", background: "#f5b301", border: 0, borderRadius: 20, padding: "10px 0", fontWeight: 800, marginTop: 10 }}>Add to Cart - {selected.price}</button>
          </div>
        </div>
      )}

      <div style={{ textAlign: "center", fontSize: 10, color: subText2, padding: "10px 10px 0" }}>
        SOSA © 2026 • Made in Nigeria • Pickup No.1 ODICHE STREET, COKER Aguda, ORILE, LAGOS<br />• Owner •
      </div>
      <div style={{ textAlign: "center", marginTop: 12 }}>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ background: dark ? "#fff" : "#000", color: dark ? "#000" : "#fff", border: 0, borderRadius: 20, padding: "8px 18px", fontSize: 12, fontWeight: 800 }}>
          ^<br />Back Up
        </button>
      </div>
    </div>
  );
}
