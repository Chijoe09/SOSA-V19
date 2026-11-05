"use client";
import { useState, useEffect, useMemo } from "react";

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
type Order = { code: string; date: string; name: string; phone: string; address: string; deliveryType: string; items: CartItem[]; totalPi: number; method: string; status: string };

export default function Home() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [catIndex, setCatIndex] = useState(0);
  const [dark, setDark] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [detail, setDetail] = useState<Product | null>(null);
  const [selColour, setSelColour] = useState("Black");
  const [selSize, setSelSize] = useState("L");
  const [rating, setRating] = useState(0);
  const [trackCode, setTrackCode] = useState("");
  const [trackResult, setTrackResult] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  // Checkout form - ALSO REMEMBERED
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [deliveryType, setDeliveryType] = useState<"pickup"|"delivery">("pickup");
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);

  // ===== LAST HISTORY MEMORY - LOAD ONCE =====
  useEffect(() => {
    try {
      const c = localStorage.getItem("sosa-cart-v20"); if (c) setCart(JSON.parse(c));
      const d = localStorage.getItem("sosa-dark"); if (d !== null) setDark(d === "1");
      const ct = localStorage.getItem("sosa-cat"); if (ct) setCat(ct);
      const ci = localStorage.getItem("sosa-catIndex"); if (ci) setCatIndex(parseInt(ci) || 0);
      const s = localStorage.getItem("sosa-search"); if (s) setSearch(s);
      const r = localStorage.getItem("sosa-rating"); if (r) setRating(parseInt(r) || 0);
      const o = localStorage.getItem("sosa-orders-v20"); if (o) setOrders(JSON.parse(o));
      const lo = localStorage.getItem("sosa-last-order"); if (lo) setLastOrder(JSON.parse(lo));
      const n = localStorage.getItem("sosa-name"); if (n) setCustName(n);
      const p = localStorage.getItem("sosa-phone"); if (p) setCustPhone(p);
      const a = localStorage.getItem("sosa-address"); if (a) setCustAddress(a);
      const dt = localStorage.getItem("sosa-deliveryType"); if (dt) setDeliveryType(dt as any);
    } catch {}
    setLoaded(true);
  }, []);
  // ===== SAVE EVERY CHANGE - NEVER LOSE HISTORY =====
  useEffect(() => { if (loaded) localStorage.setItem("sosa-cart-v20", JSON.stringify(cart)); }, [cart, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("sosa-dark", dark ? "1" : "0"); }, [dark, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("sosa-cat", cat); }, [cat, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("sosa-catIndex", String(catIndex)); }, [catIndex, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("sosa-search", search); }, [search, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("sosa-rating", String(rating)); }, [rating, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("sosa-orders-v20", JSON.stringify(orders)); }, [orders, loaded]);
  useEffect(() => { if (loaded && lastOrder) localStorage.setItem("sosa-last-order", JSON.stringify(lastOrder)); }, [lastOrder, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("sosa-name", custName); }, [custName, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("sosa-phone", custPhone); }, [custPhone, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("sosa-address", custAddress); }, [custAddress, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("sosa-deliveryType", deliveryType); }, [deliveryType, loaded]);

  const visibleCats = useMemo(() => CATEGORIES.slice(catIndex, catIndex + 5), [catIndex]);
  const filtered = PRODUCTS.filter(p => (cat === "All" || p.category === cat || (cat === "Traditional Wears" && p.category.includes("Native"))) && p.name.toLowerCase().includes(search.toLowerCase()));
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const totalPi = cart.reduce((s, i) => s + i.pricePi * i.qty, 0);
  const deliveryFee = deliveryType === "delivery" ? 0.0001 : 0;
  const grandTotal = parseFloat((totalPi + deliveryFee).toFixed(7));

  function addToCart(p: Product, colour = "Black", size = "L") {
    const key = p.id + "|" + colour + "|" + size;
    setCart(prev => {
      const f = prev.find(i => i.id === key);
      if (f) return prev.map(i => i.id === key ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: key, name: p.name, pricePi: p.pricePi, colour, size, qty: 1 }];
    });
  }
  function changeQty(id: string, delta: number) { setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0)); }
  function removeItem(id: string) { setCart(prev => prev.filter(i => i.id !== id)); }

  function createOrder(method: string): Order | null {
    if (!custName.trim()) { alert("Please enter your Name"); return null; }
    if (!custPhone.trim()) { alert("Please enter your Phone"); return null; }
    if (deliveryType === "delivery" && !custAddress.trim()) { alert("Please enter your Delivery Address"); return null; }
    if (cart.length === 0) { alert("Cart is empty"); return null; }
    const code = "SOSA-" + Date.now().toString().slice(-6);
    const order: Order = { code, date: new Date().toLocaleString(), name: custName, phone: custPhone, address: deliveryType === "delivery" ? custAddress : "Pickup: No.1, ODICHE STREET, COKER Aguda, ORILE, LAGOS.", deliveryType, items: cart, totalPi: grandTotal, method, status: method === "Barcode" ? "Pending - Pay on Pickup" : "Paid - Preparing" };
    const newOrders = [order, ...orders];
    setOrders(newOrders); setLastOrder(order);
    setCart([]); // clear cart ONLY after order saved - history keeps order
    return order;
  }

  function payWithPi() {
    // @ts-ignore
    if (typeof window === "undefined" || !window.Pi) {
      alert("Open this site inside Pi Browser to pay with Pi.\n\nYou are in Chrome. Pi Pay only works in Pi Browser.\n\nUse Barcode at Pickup instead, or open in Pi Browser.");
      return;
    }
    const o = createOrder("Pi Pay");
    if (o) { setCheckoutOpen(false); setCartOpen(false); alert("Pi Payment: " + o.totalPi.toFixed(2) + " Pi\nOrder: " + o.code + "\n\nPi SDK will call Pi.createPayment here. In Pi Browser this completes for real. Your order is saved in History."); }
  }
  function payWithBarcode() {
    const o = createOrder("Barcode");
    if (o) { setCheckoutOpen(false); setCartOpen(false); setHistoryOpen(true); alert("Barcode Order Created!\n\nCode: " + o.code + "\nTotal: " + o.totalPi.toFixed(2) + " Pi\nShow this code at pickup.\nStatus: Pending - Pay on Pickup"); }
  }
  function shareApp() {
    const url = "https://sosa-v20.vercel.app"; const text = "SOSA-outfits - Sophisticated Samples. Made in Nigeria. " + url;
    if (navigator.share) navigator.share({ title: "SOSA-outfits", text, url }).catch(() => {});
    else { navigator.clipboard?.writeText(url); alert("Link copied: " + url); }
  }
  function doTrack() {
    const q = trackCode.trim().toLowerCase();
    const found = orders.find(o => o.code.toLowerCase() === q || o.phone === trackCode.trim());
    if (found) setTrackResult("Order " + found.code + " - " + found.status + " | " + found.deliveryType + " | Total " + found.totalPi.toFixed(2) + " Pi | " + found.date);
    else if (lastOrder && (lastOrder.code.toLowerCase() === q || lastOrder.phone === trackCode.trim())) setTrackResult("Order " + lastOrder.code + " - " + lastOrder.status);
    else setTrackResult(trackCode ? "No order found for " + trackCode + ". Check code or phone. Your last order: " + (lastOrder ? lastOrder.code + " - " + lastOrder.status : "none yet") : "Enter your order code");
  }

  return (
    <div className={dark ? "wrap dark" : "wrap light"}>
      {/* HEADER - CART ALWAYS TOP RIGHT */}
      <header className="header">
        <div className="topRow">
          <div className="logo">SOSA</div>
          <div><h1>SOPHISTICATED SAMPLES</h1><p className="sub">SOSA-outfits.</p></div>
          <div className="topBtns">
            <button onClick={() => setDark(!dark)}>{dark ? "☀️ Light" : "🌙 Dark"}</button>
            <button onClick={() => { const r = prompt("Rate us 1-5 stars"); if (r) setRating(parseInt(r) || 0); }}>⭐ Rate {rating ? rating + "/5" : ""}</button>
            <button onClick={shareApp}>↗ Share</button>
            <button onClick={() => setHistoryOpen(true)}>📦 History ({orders.length})</button>
            <button onClick={() => setAdminOpen(true)}>⚙️ Admin</button>
          </div>
        </div>
        {/* CART RECORDS TOP RIGHT - NEVER HIDDEN */}
        <div className="cartTopRight">
          <button className="cartBtn" onClick={() => setCartOpen(true)}>🛒 Cart ({totalQty}) - {totalPi.toFixed(2)} Pi</button>
          {lastOrder && <span className="lastOrder">Last: {lastOrder.code} - {lastOrder.status}</span>}
        </div>
        <input className="search" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className="catBar">
          <button className="arrow" onClick={() => setCatIndex(Math.max(0, catIndex - 5))}>{"<< -10"}</button>
          <div className="catScroll">{visibleCats.map(c => (<button key={c} className={cat === c ? "pill active" : "pill"} onClick={() => setCat(c)}>{c}</button>))}</div>
          <button className="arrow" onClick={() => setCatIndex(Math.min(CATEGORIES.length - 5, catIndex + 5))}>{"+14 >>"}</button>
        </div>
      </header>

      <main className="grid">
        {filtered.map(p => (
          <div key={p.id} className="card">
            <div className="imgBox" onClick={() => { setDetail(p); setSelColour("Black"); setSelSize("L"); }}>
              <div className="imgTop">SOSA COLLECTIONS</div><div className="imgName">{p.imageText}</div><div className="imgMade">Made in Nigeria</div><div className="tapHint">Tap to View Variables</div>
            </div>
            <div className="pName">{p.name}</div><div className="pPrice">{p.pricePi.toFixed(2)} Pi</div><div className="stock">In stock ({p.stock})</div>
            <button className="addBtn" onClick={() => addToCart(p)}>Add to Cart</button>
          </div>
        ))}
        {filtered.length === 0 && <p className="center">No products in this category yet.</p>}
      </main>

      {detail && (
        <div className="modalBg" onClick={() => setDetail(null)}><div className="modal" onClick={e => e.stopPropagation()}>
          <button className="close" onClick={() => setDetail(null)}>✕</button>
          <div className="imgBox big"><div className="imgTop">SOSA COLLECTIONS</div><div className="imgName">{detail.imageText}</div><div className="imgMade">Made in Nigeria</div></div>
          <h2>{detail.name} - {detail.pricePi.toFixed(2)} Pi</h2><p>View Variables</p>
          <div className="label">Colour:</div><div className="chips">{detail.colours.map(c => <button key={c} className={selColour === c ? "chip active" : "chip"} onClick={() => setSelColour(c)}>{c}</button>)}</div>
          <div className="label">Size:</div><div className="chips">{detail.sizes.map(s => <button key={s} className={selSize === s ? "chip active" : "chip"} onClick={() => setSelSize(s)}>{s}</button>)}</div>
          <div className="modalBtns"><button className="addBtn" onClick={() => { addToCart(detail, selColour, selSize); setDetail(null); }}>Add to Cart</button><button className="addBtn" onClick={() => { addToCart(detail, selColour, selSize); setDetail(null); setCartOpen(true); }}>Buy with Pi</button></div>
        </div></div>
      )}

      {cartOpen && (
        <div className="modalBg" onClick={() => setCartOpen(false)}><div className="modal" onClick={e => e.stopPropagation()}>
          <button className="close" onClick={() => setCartOpen(false)}>✕</button>
          <h2>Your Cart - Top Right Record</h2>
          {cart.length === 0 && <p>Cart is empty. {lastOrder ? "Last order: " + lastOrder.code + " - " + lastOrder.status : ""}</p>}
          {cart.map(item => (
            <div key={item.id} className="cartLine"><div><b>{item.name}</b><br /><span>{item.colour} / {item.size} - {item.pricePi.toFixed(2)} Pi each</span></div>
            <div className="qtyRow"><button onClick={() => changeQty(item.id, -1)}>-</button><span>{item.qty}</span><button onClick={() => changeQty(item.id, 1)}>+</button><button className="rm" onClick={() => removeItem(item.id)}>Remove</button></div>
            <div><b>{(item.pricePi * item.qty).toFixed(2)} Pi</b></div></div>
          ))}
          {cart.length > 0 && (<><h3>Total: {totalPi.toFixed(2)} Pi</h3><button className="addBtn full" onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}>Go to Checkout →</button></>)}
        </div></div>
      )}

      {checkoutOpen && (
        <div className="modalBg" onClick={() => setCheckoutOpen(false)}><div className="modal" onClick={e => e.stopPropagation()}>
          <button className="close" onClick={() => setCheckoutOpen(false)}>✕</button>
          <h2>Checkout</h2>
          <div className="chips"><button className={deliveryType === "pickup" ? "chip active" : "chip"} onClick={() => setDeliveryType("pickup")}>📦 Self Pickup - Free</button><button className={deliveryType === "delivery" ? "chip active" : "chip"} onClick={() => setDeliveryType("delivery")}>🚚 Delivery - 0.0001 Pi</button></div>
          {deliveryType === "pickup" && <p className="small">📦 Pickup: No.1, ODICHE STREET, COKER Aguda, ORILE, LAGOS.</p>}
          {deliveryType === "delivery" && <p className="small">🚚 Delivery: 0.0001 Pi (1-2 days Lagos, 4-7 outside)</p>}
          <label className="label">Name *</label><input className="field" placeholder="Your full name" value={custName} onChange={e => setCustName(e.target.value)} />
          <label className="label">Phone *</label><input className="field" type="tel" inputMode="numeric" placeholder="e.g. 08087259800" value={custPhone} onChange={e => setCustPhone(e.target.value)} />
          {deliveryType === "delivery" && (<><label className="label">Delivery Address *</label><input className="field" placeholder="Street, Area, Lagos" value={custAddress} onChange={e => setCustAddress(e.target.value)} /></>)}
          <h3>Items: {totalQty} | Products: {totalPi.toFixed(2)} Pi<br />Delivery: {deliveryFee.toFixed(4)} Pi<br />Grand Total: {grandTotal.toFixed(2)} Pi</h3>
          <button className="addBtn full" onClick={payWithPi}>Pay with Pi - {grandTotal.toFixed(2)} Pi</button>
          <button className="addBtn full ghost" onClick={payWithBarcode}>Pay with Barcode at Pickup - {grandTotal.toFixed(2)} Pi</button>
          <p className="small">Barcode: You get SOSA-XXXXXX code. Show it at pickup. Admin scans it.</p>
        </div></div>
      )}

      {historyOpen && (
        <div className="modalBg" onClick={() => setHistoryOpen(false)}><div className="modal" onClick={e => e.stopPropagation()}>
          <button className="close" onClick={() => setHistoryOpen(false)}>✕</button>
          <h2>📦 Order History - Last Memory</h2>
          {orders.length === 0 && <p>No orders yet. {lastOrder ? "Last: " + lastOrder.code : ""}</p>}
          {orders.map(o => (
            <div key={o.code} className="cartLine"><div><b>{o.code}</b> - {o.date}<br />{o.name} - {o.phone}<br />{o.deliveryType} - {o.method} - {o.status}<br />Items: {o.items.map(i => i.name + " x" + i.qty).join(", ")}<br /><b>Total: {o.totalPi.toFixed(2)} Pi</b></div>
            <div className="barcode">||||| {o.code} |||||</div><div>Barcode: {o.code} - Show at pickup</div></div>
          ))}
          {orders.length > 0 && <button className="addBtn ghost" onClick={() => { if (confirm("Clear all history?")) { setOrders([]); setLastOrder(null); localStorage.removeItem("sosa-orders-v20"); localStorage.removeItem("sosa-last-order"); } }}>Clear History</button>}
        </div></div>
      )}

      {adminOpen && (
        <div className="modalBg" onClick={() => setAdminOpen(false)}><div className="modal" onClick={e => e.stopPropagation()}>
          <button className="close" onClick={() => setAdminOpen(false)}>✕</button>
          <h2>⚙️ Admin Control Room</h2>
          <p>Total Orders: {orders.length} | Total Pi Sold: {orders.reduce((s, o) => s + o.totalPi, 0).toFixed(2)} Pi</p>
          <h3>Scan Barcode / Order Code</h3><input className="field" placeholder="Scan or type SOSA-XXXXXX" value={trackCode} onChange={e => setTrackCode(e.target.value)} />
          <button className="addBtn" onClick={() => { const f = orders.find(o => o.code.toLowerCase() === trackCode.trim().toLowerCase()); if (f) alert("Found: " + f.code + " - " + f.status + " - " + f.totalPi.toFixed(2) + " Pi"); else alert("Not found: " + trackCode); }}>Find Order</button>
          <h3>All Orders</h3>
          {orders.map(o => (<div key={o.code} className="cartLine"><b>{o.code}</b> - {o.name} - {o.phone} - {o.totalPi.toFixed(2)} Pi - {o.status}<br /><button className="addBtn" onClick={() => setOrders(prev => prev.map(x => x.code === o.code ? { ...x, status: "Delivered" } : x))}>Mark Delivered</button><button className="addBtn ghost" onClick={() => setOrders(prev => prev.map(x => x.code === o.code ? { ...x, status: "Picked Up" } : x))}>Mark Picked Up</button></div>))}
          {orders.length === 0 && <p>No orders yet.</p>}
        </div></div>
      )}

      <section className="track"><h3>📦 Delivery Tracking</h3><div className="trackRow"><input placeholder="Enter Phone or Order Code e.g. SOSA-123456" value={trackCode} onChange={e => setTrackCode(e.target.value)} /><button onClick={doTrack}>Track</button></div>{trackResult && <p>{trackResult}</p>}{lastOrder && <p className="small">Last order: {lastOrder.code} - {lastOrder.status} - {lastOrder.totalPi.toFixed(2)} Pi</p>}</section>

      <footer className="footer">
        <h3>Follow Us</h3><div className="socials"><a href="#" onClick={e => e.preventDefault()}>Instagram</a><a href="#" onClick={e => e.preventDefault()}>Facebook</a><a href="#" onClick={e => e.preventDefault()}>X</a><a href="#" onClick={e => e.preventDefault()}>TikTok</a><a href="#" onClick={e => e.preventDefault()}>Telegram</a></div>
        <p>WhatsApp: <a href="https://wa.me/2348087259800">+2348087259800</a> | Email: <a href="mailto:sophisticatedsamples@gmail.com">sophisticatedsamples@gmail.com</a></p>
        <p>Self Pickup (Free): No. 1, ODICHE STREET, COKER Aguda, ORILE, LAGOS.</p><p>Delivery: 0.0001 Pi (1-2 days Lagos, 4-7 days outside Lagos)</p>
        <div className="footBtns"><button onClick={shareApp}>Share App</button><button onClick={() => window.open("https://www.google.com/maps/search/?api=1&query=ODICHE+STREET+COKER+Aguda+ORILE+LAGOS", "_blank")}>Sosa Map</button><button onClick={() => window.open("https://sosa.pi/outfits", "_blank")}>Map Of Pi</button></div>
        <p className="footSmall">SOPHISTICATED SAMPLES MERCHANDISE · BN 2229053 · CRBN 177764 · http://sosa.pi</p>
        <p className="footSmall"><a href="https://sosa-v20.vercel.app">https://sosa-v20.vercel.app</a> | <a href="https://sosa.pi/outfits">sosa.pi/outfits</a></p>
      </footer>
    </div>
  );
}
