"use client";
import { useState, useEffect, useMemo } from "react";

// --- DATA - PRIMARY SOURCE ---
// Classic = 0.05, Royal = 0.04, Lagos = 0.03, Executive = 0.05, Heritage = 0.04
type Product = { id: string; name: string; pricePi: number; category: string; stock: number; colours: string[]; sizes: string[]; imageText: string };
const PRODUCTS: Product[] = [
  { id:"sosa-001", name:"Classic Heel", pricePi:0.05, category:"Female Footwear Palm", stock:20, colours:["Black","Brown","White","Dark Blue","Grey","Light Blue"], sizes:["M","L","XL","XXL","3XL"], imageText:"Classic Heel" },
  { id:"sosa-002", name:"Royal Heel", pricePi:0.04, category:"Female Footwear Palm", stock:20, colours:["Black","Brown","White","Dark Blue","Grey","Light Blue"], sizes:["M","L","XL","XXL","3XL"], imageText:"Royal Heel" },
  { id:"sosa-003", name:"Lagos Heel", pricePi:0.03, category:"Female Footwear Palm", stock:20, colours:["Black","Brown","White","Dark Blue","Grey","Light Blue"], sizes:["M","L","XL","XXL","3XL"], imageText:"Lagos Heel" },
  { id:"sosa-004", name:"Classic Flat", pricePi:0.05, category:"Female Footwear Palm", stock:20, colours:["Black","Brown","White","Dark Blue","Grey","Light Blue"], sizes:["M","L","XL","XXL","3XL"], imageText:"Classic Flat" },
  { id:"sosa-005", name:"Royal Flat", pricePi:0.04, category:"Female Footwear Palm", stock:20, colours:["Black","Brown","White","Dark Blue","Grey","Light Blue"], sizes:["M","L","XL","XXL","3XL"], imageText:"Royal Flat" },
  { id:"sosa-006", name:"Lagos Flat", pricePi:0.03, category:"Female Footwear Palm", stock:20, colours:["Black","Brown","White","Dark Blue","Grey","Light Blue"], sizes:["M","L","XL","XXL","3XL"], imageText:"Lagos Flat" },
  { id:"sosa-007", name:"Executive Flat", pricePi:0.05, category:"Female Footwear Palm", stock:20, colours:["Black","Brown","White","Dark Blue","Grey","Light Blue"], sizes:["M","L","XL","XXL","3XL"], imageText:"Executive Flat" },
  { id:"sosa-008", name:"Heritage Flat", pricePi:0.04, category:"Female Footwear Palm", stock:20, colours:["Black","Brown","White","Dark Blue","Grey","Light Blue"], sizes:["M","L","XL","XXL","3XL"], imageText:"Heritage Flat" },
  { id:"sosa-009", name:"Classic Palm Slide", pricePi:0.05, category:"Men Footwear Palm", stock:20, colours:["Black","Brown","White","Dark Blue","Grey","Light Blue"], sizes:["M","L","XL","XXL","3XL"], imageText:"Classic Palm Slide" },
  { id:"sosa-010", name:"Royal Palm Slide", pricePi:0.04, category:"Men Footwear Palm", stock:20, colours:["Black","Brown","White","Dark Blue","Grey","Light Blue"], sizes:["M","L","XL","XXL","3XL"], imageText:"Royal Palm Slide" },
  { id:"sosa-011", name:"Lagos Palm Slide", pricePi:0.03, category:"Men Footwear Palm", stock:20, colours:["Black","Brown","White","Dark Blue","Grey","Light Blue"], sizes:["M","L","XL","XXL","3XL"], imageText:"Lagos Palm Slide" },
  { id:"sosa-012", name:"Classic Cross Bag", pricePi:0.05, category:"Men Hand Bags", stock:20, colours:["Black","Brown","White","Dark Blue","Grey","Light Blue"], sizes:["M","L","XL","XXL","3XL"], imageText:"Classic Cross Bag" },
  { id:"sosa-013", name:"Royal Cross Bag", pricePi:0.04, category:"Men Hand Bags", stock:20, colours:["Black","Brown","White","Dark Blue","Grey","Light Blue"], sizes:["M","L","XL","XXL","3XL"], imageText:"Royal Cross Bag" },
  { id:"sosa-014", name:"Lagos Cross Bag", pricePi:0.03, category:"Men Hand Bags", stock:20, colours:["Black","Brown","White","Dark Blue","Grey","Light Blue"], sizes:["M","L","XL","XXL","3XL"], imageText:"Lagos Cross Bag" },
  { id:"sosa-015", name:"Classic Hand Bag", pricePi:0.05, category:"Female Hand Bags", stock:20, colours:["Black","Brown","White","Dark Blue","Grey","Light Blue"], sizes:["M","L","XL","XXL","3XL"], imageText:"Classic Hand Bag" },
  { id:"sosa-016", name:"Royal Hand Bag", pricePi:0.04, category:"Female Hand Bags", stock:20, colours:["Black","Brown","White","Dark Blue","Grey","Light Blue"], sizes:["M","L","XL","XXL","3XL"], imageText:"Royal Hand Bag" },
  { id:"sosa-017", name:"Lagos Hand Bag", pricePi:0.03, category:"Female Hand Bags", stock:20, colours:["Black","Brown","White","Dark Blue","Grey","Light Blue"], sizes:["M","L","XL","XXL","3XL"], imageText:"Lagos Hand Bag" },
  { id:"sosa-018", name:"Classic Top", pricePi:0.05, category:"Male Tops", stock:20, colours:["Black","Brown","White","Dark Blue","Grey","Light Blue"], sizes:["M","L","XL","XXL","3XL"], imageText:"Classic Top" },
  { id:"sosa-019", name:"Royal Top", pricePi:0.04, category:"Male Tops", stock:20, colours:["Black","Brown","White","Dark Blue","Grey","Light Blue"], sizes:["M","L","XL","XXL","3XL"], imageText:"Royal Top" },
  { id:"sosa-020", name:"Lagos Top", pricePi:0.03, category:"Male Tops", stock:20, colours:["Black","Brown","White","Dark Blue","Grey","Light Blue"], sizes:["M","L","XL","XXL","3XL"], imageText:"Lagos Top" },
  { id:"sosa-021", name:"Classic Suit", pricePi:0.05, category:"Male Suits", stock:20, colours:["Black","Brown","White","Dark Blue","Grey","Light Blue"], sizes:["M","L","XL","XXL","3XL"], imageText:"Classic Suit" },
  { id:"sosa-022", name:"Royal Suit", pricePi:0.04, category:"Male Suits", stock:20, colours:["Black","Brown","White","Dark Blue","Grey","Light Blue"], sizes:["M","L","XL","XXL","3XL"], imageText:"Royal Suit" },
  { id:"sosa-023", name:"Lagos Suit", pricePi:0.03, category:"Male Suits", stock:20, colours:["Black","Brown","White","Dark Blue","Grey","Light Blue"], sizes:["M","L","XL","XXL","3XL"], imageText:"Lagos Suit" },
  { id:"sosa-024", name:"Ankara Jacket Red", pricePi:2.5, category:"Female Native Wears", stock:10, colours:["Black","Brown","White","Dark Blue","Grey","Light Blue"], sizes:["M","L","XL","XXL","3XL"], imageText:"Ankara Jacket Red" },
];

const CATEGORIES = ["All","Traditional Wears","Female Native Wears","Male Native Wears","Men Shoes Box1 Leather","Men Shoes Box2 Sneakers","Men Footwear Palm","Female Footwear Palm","Men Hand Bags","Female Hand Bags","Male Tops","Female Tops","Male Suits","Female Suits","Male Single / Boxers","Female Bra / Underwear"];

type CartItem = { id: string; name: string; pricePi: number; colour: string; size: string; qty: number };

export default function Home() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [catIndex, setCatIndex] = useState(0);
  const [dark, setDark] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [detail, setDetail] = useState<Product | null>(null);
  const [selColour, setSelColour] = useState("Black");
  const [selSize, setSelSize] = useState("L");
  const [rating, setRating] = useState(0);
  const [trackCode, setTrackCode] = useState("");
  const [trackResult, setTrackResult] = useState("");

  // Load dark + cart from localStorage
  useEffect(() => {
    try {
      const d = localStorage.getItem("sosa-dark");
      if (d !== null) setDark(d === "1");
      const c = localStorage.getItem("sosa-cart-v20");
      if (c) setCart(JSON.parse(c));
    } catch {}
  }, []);
  useEffect(() => { try { localStorage.setItem("sosa-dark", dark ? "1" : "0"); } catch {} }, [dark]);
  useEffect(() => { try { localStorage.setItem("sosa-cart-v20", JSON.stringify(cart)); } catch {} }, [cart]);

  const visibleCats = useMemo(() => CATEGORIES.slice(catIndex, catIndex + 5), [catIndex]);
  const filtered = PRODUCTS.filter(p => (cat === "All" || p.category === cat || (cat === "Traditional Wears" && p.category.includes("Native"))) && p.name.toLowerCase().includes(search.toLowerCase()));
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const totalPi = cart.reduce((s, i) => s + i.pricePi * i.qty, 0);

  function addToCart(p: Product, colour = "Black", size = "L") {
    const key = p.id + colour + size;
    setCart(prev => {
      const found = prev.find(i => i.id === key);
      if (found) return prev.map(i => i.id === key ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: key, name: p.name, pricePi: p.pricePi, colour, size, qty: 1 }];
    });
  }
  function changeQty(id: string, delta: number) {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));
  }
  function removeItem(id: string) { setCart(prev => prev.filter(i => i.id !== id)); }

  function payWithPi() {
    // Pi SDK check - NEVER stuck on Processing in Chrome
    // @ts-ignore
    if (typeof window === "undefined" || !window.Pi) {
      alert("Open this site inside Pi Browser to pay with Pi.\n\nYou are in Chrome. Pi Pay only works in Pi Browser.");
      return;
    }
    alert("Pi Pay: Total " + totalPi.toFixed(2) + " Pi\n\nPi SDK detected. Full Pi payment + Barcode will be connected in Step 2.");
  }

  function shareApp() {
    const url = "https://sosa-v20.vercel.app";
    const text = "SOSA-outfits - Sophisticated Samples. Made in Nigeria. " + url;
    if (navigator.share) navigator.share({ title: "SOSA-outfits", text, url }).catch(() => {});
    else { navigator.clipboard?.writeText(url); alert("Link copied: " + url); }
  }

  return (
    <div className={dark ? "wrap dark" : "wrap light"}>
      {/* HEADER */}
      <header className="header">
        <div className="topRow">
          <div className="logo">SOSA</div>
          <div>
            <h1>SOPHISTICATED SAMPLES</h1>
            <p className="sub">SOSA-outfits.</p>
          </div>
          <div className="topBtns">
            <button onClick={() => setDark(!dark)}>{dark ? "☀️ Light" : "🌙 Dark"}</button>
            <button onClick={() => { const r = prompt("Rate us 1-5 stars"); if (r) setRating(parseInt(r) || 0); }}>⭐ Rate {rating ? rating + "/5" : ""}</button>
            <button onClick={shareApp}>↗ Share</button>
            <button className="cartBtn" onClick={() => setCartOpen(true)}>🛒 Cart ({totalQty}) - {totalPi.toFixed(2)} Pi</button>
          </div>
        </div>
        <input className="search" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        {/* CATEGORY ARROWS IN TOP BAR - NOT BLOCKING */}
        <div className="catBar">
          <button className="arrow" onClick={() => setCatIndex(Math.max(0, catIndex - 5))}>{"<< -10"}</button>
          <div className="catScroll">
            {visibleCats.map(c => (
              <button key={c} className={cat === c ? "pill active" : "pill"} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          <button className="arrow" onClick={() => setCatIndex(Math.min(CATEGORIES.length - 5, catIndex + 5))}>{"+14 >>"}</button>
        </div>
      </header>

      {/* PRODUCTS */}
      <main className="grid">
        {filtered.map(p => (
          <div key={p.id} className="card">
            <div className="imgBox" onClick={() => { setDetail(p); setSelColour("Black"); setSelSize("L"); }}>
              <div className="imgTop">SOSA COLLECTIONS</div>
              <div className="imgName">{p.imageText}</div>
              <div className="imgMade">Made in Nigeria</div>
              <div className="tapHint">Tap to View Variables</div>
            </div>
            <div className="pName">{p.name}</div>
            <div className="pPrice">{p.pricePi.toFixed(2)} Pi</div>
            <div className="stock">In stock ({p.stock})</div>
            <button className="addBtn" onClick={() => addToCart(p)}>Add to Cart</button>
          </div>
        ))}
        {filtered.length === 0 && <p className="center">No products in this category yet.</p>}
      </main>

      {/* DETAIL MODAL - VIEW VARIABLES */}
      {detail && (
        <div className="modalBg" onClick={() => setDetail(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="close" onClick={() => setDetail(null)}>✕</button>
            <div className="imgBox big">
              <div className="imgTop">SOSA COLLECTIONS</div>
              <div className="imgName">{detail.imageText}</div>
              <div className="imgMade">Made in Nigeria</div>
            </div>
            <h2>{detail.name} - {detail.pricePi.toFixed(2)} Pi</h2>
            <p>View Variables</p>
            <div className="label">Colour:</div>
            <div className="chips">{detail.colours.map(c => <button key={c} className={selColour === c ? "chip active" : "chip"} onClick={() => setSelColour(c)}>{c}</button>)}</div>
            <div className="label">Size:</div>
            <div className="chips">{detail.sizes.map(s => <button key={s} className={selSize === s ? "chip active" : "chip"} onClick={() => setSelSize(s)}>{s}</button>)}</div>
            <div className="modalBtns">
              <button className="addBtn" onClick={() => { addToCart(detail, selColour, selSize); setDetail(null); }}>Add to Cart</button>
              <button className="addBtn" onClick={() => { addToCart(detail, selColour, selSize); setDetail(null); setCartOpen(true); }}>Buy with Pi</button>
            </div>
          </div>
        </div>
      )}

      {/* CART DRAWER - WITH + / - */}
      {cartOpen && (
        <div className="modalBg" onClick={() => setCartOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="close" onClick={() => setCartOpen(false)}>✕</button>
            <h2>Your Cart</h2>
            {cart.length === 0 && <p>Cart is empty.</p>}
            {cart.map(item => (
              <div key={item.id} className="cartLine">
                <div><b>{item.name}</b><br /><span>{item.colour} / {item.size} - {item.pricePi.toFixed(2)} Pi each</span></div>
                <div className="qtyRow">
                  <button onClick={() => changeQty(item.id, -1)}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => changeQty(item.id, 1)}>+</button>
                  <button className="rm" onClick={() => removeItem(item.id)}>Remove</button>
                </div>
                <div><b>{(item.pricePi * item.qty).toFixed(2)} Pi</b></div>
              </div>
            ))}
            {cart.length > 0 && (
              <>
                <h3>Total: {totalPi.toFixed(2)} Pi</h3>
                <p className="small">Delivery: 0.0001 Pi if Delivery selected at checkout. Pickup is Free.</p>
                <button className="addBtn full" onClick={payWithPi}>Pay with Pi - {totalPi.toFixed(2)} Pi</button>
                <button className="addBtn full ghost" onClick={() => alert("Barcode Payment: Your barcode SOSA-" + Date.now().toString().slice(-6) + " will show here in Step 2. Show it at pickup.")}>Pay with Barcode at Pickup</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* TRACKING */}
      <section className="track">
        <h3>📦 Delivery Tracking</h3>
        <div className="trackRow">
          <input placeholder="Enter Phone or Order Code e.g. SOSA-123456" value={trackCode} onChange={e => setTrackCode(e.target.value)} />
          <button onClick={() => setTrackResult(trackCode ? "Order " + trackCode + ": Status - Preparing. Delivery: 1-2 days Lagos, 4-7 outside. Full live tracking connects in Step 2 with Supabase." : "Enter your order code")}>Track</button>
        </div>
        {trackResult && <p>{trackResult}</p>}
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <h3>Follow Us</h3>
        <div className="socials">
          <a href="#" onClick={e => e.preventDefault()}>Instagram</a><a href="#" onClick={e => e.preventDefault()}>Facebook</a><a href="#" onClick={e => e.preventDefault()}>X</a><a href="#" onClick={e => e.preventDefault()}>TikTok</a><a href="#" onClick={e => e.preventDefault()}>Telegram</a>
        </div>
        <p>WhatsApp: <a href="https://wa.me/2348087259800">+2348087259800</a> | Email: <a href="mailto:sophisticatedsamples@gmail.com">sophisticatedsamples@gmail.com</a></p>
        <p>Self Pickup (Free): No. 1, ODICHE STREET, COKER Aguda, ORILE, LAGOS.</p>
        <p>Delivery: 0.0001 Pi (1-2 days Lagos, 4-7 days outside Lagos)</p>
        <div className="footBtns">
          <button onClick={shareApp}>Share App</button>
          <button onClick={() => window.open("https://www.google.com/maps/search/?api=1&query=ODICHE+STREET+COKER+Aguda+ORILE+LAGOS", "_blank")}>Sosa Map</button>
          <button onClick={() => window.open("https://sosa.pi/outfits", "_blank")}>Map Of Pi</button>
        </div>
        <p className="footSmall">SOPHISTICATED SAMPLES MERCHANDISE · BN 2229053 · CRBN 177764 · http://sosa.pi</p>
        <p className="footSmall"><a href="https://sosa-v20.vercel.app">https://sosa-v20.vercel.app</a> | <a href="https://sosa.pi/outfits">sosa.pi/outfits</a></p>
      </footer>
    </div>
  );
                                                                                                                                                                         }
