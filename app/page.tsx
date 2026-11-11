"use client";
import { useState, useEffect, useMemo } from "react";
import AdminAddProducts from "@/components/AdminAddProducts";  <-- NEW, add this

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
  const [dark, setDark] = useState(true);const [catsPerPage, setCatsPerPage] = useState(5);
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
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [deliveryType, setDeliveryType] = useState<"pickup"|"delivery">("pickup");
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);

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
    setCart([]);
    return order;
  }

  async function payWithPi() {
  if (cart.length === 0) { alert("Cart is empty"); return; }
  // @ts-ignore
  if (typeof window === "undefined" || !window.Pi) {
    alert("Open this site inside Pi Browser to pay with Pi.");
    return;
  }
  // @ts-ignore
  const Pi = window.Pi;
  try { Pi.init({ version: "2.0", sandbox:true }); } catch(e) {}

  const amount = Number(grandTotal.toFixed(2));
  if (!amount || amount <= 0) { alert("Invalid total"); return; }

  try {
        // @ts-ignore
    await Pi.authenticate(["username", "payments"], (payment: any) => {
      fetch("/api/pi/incomplete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: payment.identifier, txid: payment.transaction?.txid }),
      });
    });

    // @ts-ignore
    await Pi.createPayment({
      amount: amount,
      memo: "SOSA Outfits order - " + cart.length + " item(s)",
      metadata: { name: custName, phone: custPhone, deliveryType: deliveryType, address: custAddress, cart: cart.map((i: any) => i.name) }
    }, {
      onReadyForServerApproval: async (paymentId: string) => {
        await fetch("/api/pi/approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId })
        });
      },
      onReadyForServerCompletion: async (paymentId: string, txid: string) => {
        await fetch("/api/pi/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId, txid })
        });
        const o = createOrder("Pi Pay - Paid");
        if (o) { setCheckoutOpen(false); setCartOpen(false); alert("Payment Complete! Order " + o.code + " is Paid. Check History."); }
      },
      onCancel: () => { alert("Payment cancelled"); },
      onError: (e: any) => { alert("Payment error: " + (e?.message || "Unknown")); }
    });
  } catch (e: any) {
    alert("Pi payment failed: " + (e?.message || "Cancelled"));
  }
}
  function payWithBarcode() {
    const o = createOrder("Barcode");
    if (o) { setCheckoutOpen(false); setCartOpen(false); setHistoryOpen(true); alert("Barcode Order Created!\n\nCode: " + o.code + "\nTotal: " + o.totalPi.toFixed(2) + " Pi\nShow this code at pickup.\nStatus: Pending - Pay on Pickup"); }
  }
  function shareApp() {
    const url = "https://sosa-v19-nqkiejyop-chijoe09.vercel.app/"; const text = "SOSA-outfits - Sophisticated Samples. Made in Nigeria. " + url;
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
      <header className="header">
        <div className="topRow">
          <div className="logo">SOSA</div>
          <div><h1>SOPHISTICATED SAMPLES</h1><p className="sub">SOSA-outfits.</p></div>
          <div className="topBtns">
            <button onClick={() => setDark(!dark)}>{dark ? "☀️ Light" : "🌙 Dark"}</button>
            <button onClick={() => { const r = prompt("Rate us 1-5 stars"); if (r) setRating(parseInt(r) || 0); }}>⭐ Rate {rating ? rating + "/5" : ""}</button>
            <button onClick={shareApp}>↗ Share</button>
            <button onClick={() => setHistoryOpen(true)}>📦 History ({orders.length})</button>
            style={{display: typeof window !== "undefined" && window.location.href.includes("admin=sosa5463") ? "inline-block" : "none"}} onClick={()=>{ if(prompt("Enter Admin PIN")==="sosa5463"){ setAdminOpen(true) } else { alert("Wrong PIN") } }}>⚙️ Admin</button>
          </div>
        </div>
        <div className="cartTopRight">
          <button className="cartBtn" onClick={() => setCartOpen(true)}>🛒 Cart ({totalQty}) - {totalPi.toFixed(2)} Pi</button>
          {lastOrder && <span className="lastOrder">Last: {lastOrder.code} - {lastOrder.status}</span>}
        </div>
        <input className="search" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className="catBar">
  <button className="arrow" disabled={catIndex===0} onClick={()=>setCatIndex(i=>Math.max(0,i-5))}>{"<< Prev"}</button>

  <div style={{flex:1, textAlign:"center"}}>
    <div style={{fontWeight:800, fontSize:14, color:"#fff"}}>
      Page {Math.floor(catIndex/5)+1} of {Math.ceil(CATEGORIES.length/5)} • {Math.ceil(CATEGORIES.length/5)-(Math.floor(catIndex/5)+1)} pages left to view
    </div>
    <div style={{height:6, background:"#333", borderRadius:99, overflow:"hidden", marginTop:4}}>
      <div style={{width:`${((Math.floor(catIndex/5)+1)/Math.ceil(CATEGORIES.length/5))*100}%`, height:"100%", background:"#ff7a00"}} />
    </div>
  </div>

  <button className="arrow" disabled={catIndex+5>=CATEGORIES.length} onClick={()=>setCatIndex(i=>Math.min(CATEGORIES.length-5,i+5))}>{"Next >>"}</button>
</div>

<div className="catScroll">
  {CATEGORIES.slice(catIndex, catIndex+5).map(c=>(
    <button key={c} className={cat===c?"pill active":"pill"} onClick={()=>setCat(c)}>{c}</button>
  ))}
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
<div className="modalBg" onClick={()=>setCheckoutOpen(false)}>
<div className="modal" onClick={(e)=>e.stopPropagation()}>
<button className="close" onClick={()=>setCheckoutOpen(false)}>X</button>
<h2>Checkout</h2>

<div className="chips">
<button className={deliveryType==="pickup" ? "chip active" : "chip"} onClick={()=>setDeliveryType("pickup")}>📦 Self Pickup - Free</button>
<button className={deliveryType==="delivery" ? "chip active" : "chip"} onClick={()=>setDeliveryType("delivery")}>🚚 Delivery - 0.0001 Pi</button>
</div>

{deliveryType==="pickup" && <p>📦 Pickup: No.1, ODICHE STREET, COKER Aguda, ORILE, LAGOS.</p>}
{deliveryType==="delivery" && <p>🚚 Delivery: 0.0001 Pi (1-2 days Lagos, 4-7 outside)</p>}

<label className="label">Name</label>
<input className="input" placeholder="Your Name" value={custName} onChange={(e)=>setCustName(e.target.value)} autoComplete="name" />

<label className="label">Phone</label>
<input className="input" placeholder="080..." value={custPhone} onChange={(e)=>setCustPhone(e.target.value.replace(/[^0-9+]/g,""))} type="tel" inputMode="tel" autoComplete="tel" maxLength={11} />

{deliveryType==="delivery" && (
<>
<label className="label">Delivery Address</label>
<input className="input" placeholder="Street, Area, Lagos" value={custAddress} onChange={(e)=>setCustAddress(e.target.value)} autoComplete="street-address" />
</>
)}

<h3>Items: {totalQty} | Products: {cart.map(i=>i.name+" x"+i.qty).join(", ")}</h3>
<h3>Grand Total: {grandTotal} Pi</h3>
<button className="addBtn" onClick={payWithPi}>Pay with Pi - {grandTotal} Pi</button>
<button className="addBtn" onClick={payWithBarcode}>Pay with Barcode at Pickup - {grandTotal} Pi</button>
<p className="small">Barcode: You will get a real SOSA-XXXXXX code after you tap above. Show it at pickup. Admin scans it.</p>

</div>
</div>
)}

      {historyOpen && (
        <div className="modalBg" onClick={() => setHistoryOpen(false)}><div className="modal" onClick={e => e.stopPropagation()}>
          <button className="close" onClick={() => setHistoryOpen(false)}>✕</button>
          <h2>📦 Order History - Last Memory</h2>
          {lastOrder && <p>Last Order: {lastOrder.code} - {lastOrder.status}</p>}
          {orders.length === 0 && <p>No orders yet.</p>}
          {orders.map(o => (
            <div key={o.code} className="orderCard">
              <div><b>{o.code}</b> - {o.status} - {o.method}</div>
              <div>{o.date} - {o.name} - {o.phone} - {o.deliveryType}</div>
              <div>Items: {o.items.map(i => i.name + " x" + i.qty).join(", ")}</div>
              <div>Total: {o.totalPi.toFixed(2)} Pi</div>
              <div className="barcode">||||| {o.code} |||||</div>
              <div style={{fontSize: "12px", textAlign: "center"}}>{o.code}</div>
            </div>
          ))}
          {orders.length > 0 && <button className="addBtn" onClick={() => { if (confirm("Clear all history?")) { setOrders([]); setLastOrder(null); localStorage.removeItem("sosa-orders-v20"); localStorage.removeItem("sosa-last-order"); } }}>Clear History</button>}
        </div></div>
      )}

      {adminOpen && (
        <div className="modalBg" onClick={() => setAdminOpen(false)}><div className="modal" onClick={e => e.stopPropagation()}>
          <button className="close" onClick={() => setAdminOpen(false)}>✕</button>
          <h2>⚙️ Admin - All Orders</h2><div style={{background:"#222", padding:10, borderRadius:10, margin:"10px 0"}}>
            <AdminAddProducts onSaved={() => window.location.reload()} />
  <label className="label">Categories Per Page - controls total pages</label>
  <input className="input" type="number" value={catsPerPage} onChange={(e)=>{
    const v = parseInt(e.target.value)||1;
    setCatsPerPage(v);
    setCatIndex(0);
  }} />
  <p className="small">Now: {CATEGORIES.length} categories / {catsPerPage} per page = {Math.ceil(CATEGORIES.length/catsPerPage)} pages total</p>
</div>
          <p>Total Orders: {orders.length}</p>
          <input className="input" placeholder="Track by code or phone..." value={trackCode} onChange={e => setTrackCode(e.target.value)} />
          <button className="addBtn" onClick={doTrack}>Track Order</button>
          {trackResult && <p>{trackResult}</p>}
          {orders.map(o => (
            <div key={o.code} className="orderCard">
              <div><b>{o.code}</b> - {o.status}</div>
              <div>{o.name} - {o.phone} - {o.address}</div>
              <div>{o.items.map(i => i.name + " x" + i.qty).join(", ")} - {o.totalPi.toFixed(2)} Pi</div>
              <div className="barcode">||||| {o.code} |||||</div>
            </div>
          ))}
        </div></div>
      )}
    </div>
  );
                                                                                                                                                                                                                                                                                                                                     }
