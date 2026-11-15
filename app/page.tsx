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

export default function Home() {
  const [cart, setCart] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [size, setSize] = useState("M");

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <div className="p-3 flex justify-between items-start">
        <div className="flex gap-2 items-center">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl">🌈</div>
          <div>
            <h1 className="text-[20px] leading-[1.1] font-black">SOPHISTICATED<br/>SAMPLES</h1>
            <p className="text-[11px] text-gray-300">SOSA-outfits. Made in Nigeria</p>
            <p className="text-[10px] text-gray-400">Pi SDK Ready @chijo09 | 0.0 pts | 18 Products</p>
          </div>
        </div>
        <button className="bg-amber-300 text-black text-[11px] font-bold px-2 py-1 rounded-full">☀️ Light</button>
      </div>

      <div className="px-3 flex gap-2 flex-wrap">
        <button className="bg-white text-black text-[11px] px-2 py-1 rounded-full">Logout</button>
        <button className="bg-white text-black text-[11px] px-2 py-1 rounded-full">Cart ({cart.length})</button>
        <button className="bg-white text-black text-[11px] px-2 py-1 rounded-full">My Orders</button>
        <button className="bg-amber-400 text-black text-[11px] font-bold px-2 py-1 rounded-full">Leadership Board</button>
      </div>

      <p className="px-3 mt-2 text-[11px]">👇 Tap any product TO SEE details before you buy. 18 Products - Grid View</p>

      {/* GRID - 3 COLUMNS, SMALL BOXES, 6 PER SCREEN */}
      <div className="grid grid-cols-3 gap-2 p-2 pb-4">
        {PRODUCTS.map((p) => (
          <div key={p.id} className="bg-white text-black rounded-xl overflow-hidden border flex flex-col">
            <div className="bg-black text-center px-1 py-2 h-[68px] flex flex-col justify-center">
              <p className="text-[8px] text-amber-400 font-bold">{p.cat}</p>
              <p className="text-[11px] font-bold text-white leading-tight">{p.name}</p>
              <p className="text-[8px] text-gray-400">📷 Photo Coming Soon</p>
              <span className="text-[8px] bg-white text-black px-1.5 py-0.5 rounded-full mx-auto mt-1">{p.color}</span>
            </div>
            <div className="p-1.5 flex flex-col gap-1 flex-1">
              <p className="text-[11px] font-bold leading-tight">{p.name}</p>
              <p className="text-[11px] font-bold text-amber-600">{p.price} • {p.color}</p>
              <p className="text-[9px] leading-[1.3] text-gray-600 line-clamp-3">{p.desc}</p>
              <div className="flex gap-1 mt-auto">
                <select value={size} onChange={(e)=>setSize(e.target.value)} className="flex-1 text-[9px] border rounded-md py-1 px-0.5 bg-white">
                  <option>M</option><option>S</option><option>L</option><option>XL</option>
                </select>
                <select className="flex-1 text-[9px] border rounded-md py-1 px-0.5 bg-white">
                  <option>{p.color}</option><option>Black</option>
                </select>
              </div>
              <button onClick={()=>setSelected(p)} className="w-full bg-black text-white text-[10px] font-bold py-1.5 rounded-md">👁 View</button>
              <button onClick={()=>setCart([...cart, p])} className="w-full bg-amber-400 text-black text-[10px] font-bold py-1.5 rounded-md">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>

      {/* VIEW MODAL - FULL INFO INTACT */}
      {selected && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center">
          <div className="bg-white text-black w-full max-w-md rounded-t-2xl p-4">
            <button onClick={()=>setSelected(null)} className="text-[12px] bg-black text-white px-3 py-1 rounded-full">← Back to Shop</button>
            <div className="bg-black text-center py-4 rounded-xl mt-3">
              <p className="text-amber-400 text-[10px] font-bold">{selected.cat}</p>
              <p className="text-white font-bold text-[16px]">{selected.name}</p>
              <p className="text-gray-400 text-[10px]">📷 Photo Coming Soon</p>
            </div>
            <p className="font-bold mt-3">{selected.name}</p>
            <p className="text-amber-600 font-bold">{selected.price} • Colour: {selected.color}</p>
            <p className="text-[13px] text-gray-600 mt-1">{selected.desc}</p>
            <p className="text-[12px] mt-2">What you are paying for: Elegant, comfortable, made in Nigeria. Heel height: Medium. Material: Quality leather-like. Fitting: True to size. Comes in SOSA branded pack.</p>
            <button onClick={()=>{setCart([...cart, selected]); setSelected(null);}} className="w-full bg-amber-400 text-black font-bold py-2.5 rounded-full mt-3">Add to Cart - {selected.price}</button>
          </div>
        </div>
      )}

      <div className="text-center text-[10px] text-gray-400 pb-6 px-3">
        SOSA © 2026 • Made in Nigeria • Pickup No.1 ODICHE STREET, COKER Aguda, ORILE, LAGOS<br/>• Owner •
      </div>
    </div>
  );
}
