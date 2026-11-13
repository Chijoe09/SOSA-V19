"use client";
import { useEffect, useState } from "react";
/*
SOSA MEMORY - DO NOT DELETE:
- Pickup: No. 1, ODICHE STREET, COKER Aguda, ORILE, LAGOS. - Self Pickup Free, ONLY at payment, NOT under app
- Delivery: 0.0001 Pi (1-2 days Lagos, 4-7 days outside Lagos)
- Cart: (X) removes ONLY that 1 item
- History: sosa_orders, Admin shows Total Records + Total Pi
- Save + clear cart ONLY in onReadyForServerCompletion AFTER Wallet says Payment succeeded!
- NEVER show "Payment finished" after await createPayment
- Memo: Name | Phone | PICKUP/DELIVERY address
- FEE: SOSA gets Grand Total. Pi takes extra 0.01 fee. Wallet shows Grand + 0.01
- EMPTY CART: Button disabled + "Cart is empty"
- BARCODE: NOT Pi payment. Reserve now, PAY AT PICKUP. Customer shows SOSA-XXXXXX at shop. Admin taps Mark Paid when they pay there. Status starts "Pending - Pay at Pickup"
- TRACKING: Paid -> Sent -> Delivered. Green when done. Customer sees in My Orders.
- REWARDS: 1 Pi = 10 pts. Points = total * 10. Leaderboard ranks by total Pi.
- Parked: New Arrivals, Follow, Share, SOSA-Social
*/
const PRODUCTS = [
  { name: "Classic Heel", price: 0.05, cat: "Footwear" },{ name: "Royal Heel", price: 0.04, cat: "Footwear" },{ name: "Lagos Heel", price: 0.03, cat: "Footwear" },
  { name: "Classic Flat", price: 0.05, cat: "Footwear" },{ name: "Royal Flat", price: 0.04, cat: "Footwear" },{ name: "Lagos Flat", price: 0.03, cat: "Footwear" },
  { name: "Executive Flat", price: 0.05, cat: "Footwear" },{ name: "Heritage Flat", price: 0.04, cat: "Footwear" },
  { name: "Classic Palm Slide", price: 0.04, cat: "Footwear" },{ name: "Royal Palm Slide", price: 0.03, cat: "Footwear" },{ name: "Lagos Palm Slide", price: 0.02, cat: "Footwear" },
  { name: "Classic Cross Bag", price: 0.05, cat: "Bags" },{ name: "Royal Cross Bag", price: 0.04, cat: "Bags" },{ name: "Lagos Cross Bag", price: 0.03, cat: "Bags" },
  { name: "Classic Hand Bag", price: 0.05, cat: "Bags" },{ name: "Royal Hand Bag", price: 0.04, cat: "Bags" },{ name: "Lagos Hand Bag", price: 0.03, cat: "Bags" },
  { name: "Classic Top", price: 0.04, cat: "Tops" },{ name: "Royal Top", price: 0.03, cat: "Tops" },{ name: "Lagos Top", price: 0.02, cat: "Tops" },
  { name: "Classic Suit", price: 0.05, cat: "Suits" },{ name: "Royal Suit", price: 0.04, cat: "Suits" },{ name: "Lagos Suit", price: 0.03, cat: "Suits" },
  { name: "Ankara Jacket Red", price: 0.05, cat: "Traditional Wears" },{ name: "Ankara Jacket Blue", price: 0.04, cat: "Traditional Wears" },{ name: "Ankara Jacket Green", price: 0.03, cat: "Traditional Wears" },{ name: "Ankara Jacket Gold", price: 0.05, cat: "Traditional Wears" },
  { name: "Traditional Wear Classic", price: 0.05, cat: "Traditional Wears" },{ name: "Traditional Wear Royal", price: 0.04, cat: "Traditional Wears" },
  { name: "Female Dress Classic", price: 0.05, cat: "Female" },{ name: "Female Dress Royal", price: 0.04, cat: "Female" },
];
const COLORS = ["Black","White","Brown","Red","Blue","Grey"]; const SIZES = ["S","M","L","XL","XXL","3XL"];
const PICKUP_ADDRESS = "No. 1, ODICHE STREET, COKER Aguda, ORILE, LAGOS.";
const PICKUP_INFO = "Self Pickup (Free): No. 1, ODICHE STREET, COKER Aguda, ORILE, LAGOS.";
const DELIVERY_INFO = "Delivery: 0.0001 Pi (1-2 days Lagos, 4-7 days outside Lagos)"; const PI_FEE = 0.01;
const getPi = () => { if (typeof window === "undefined") return null; return (window as any).Pi || null; };
const getOrders = () => { try { return JSON.parse(localStorage.getItem("sosa_orders") || "[]"); } catch { return []; } };

export default function Home() {
  const [user, setUser] = useState<any>(null); const [sdkReady, setSdkReady] = useState(false);
  const [cart, setCart] = useState<any[]>([]); const [showCart, setShowCart] = useState(false);
  const [selected, setSelected] = useState<any>(null); const [color, setColor] = useState("Black"); const [size, setSize] = useState("L");
  const [fullName, setFullName] = useState(""); const [phone, setPhone] = useState(""); const [method, setMethod] = useState("delivery");
  const [address, setAddress] = useState(""); const [pickupPoint, setPickupPoint] = useState(PICKUP_ADDRESS);
  const [status, setStatus] = useState(""); const [paying, setPaying] = useState(false);
  const [showOrders, setShowOrders] = useState(false); const [showBoard, setShowBoard] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => { const s = document.createElement("script"); s.src = "https://sdk.minepi.com/pi-sdk.js"; s.onload = () => { const Pi = getPi(); if (Pi) { Pi.init({ version: "2.0", sandbox: true }); setSdkReady(true); } }; document.head.appendChild(s); setOrders(getOrders()); }, []);
  const refreshOrders = () => setOrders(getOrders());
  const login = async () => { const Pi = getPi(); if (!Pi) return alert("Pi SDK not loaded yet."); try { const auth = await Pi.authenticate(["username","payments"], (p:any)=>{ fetch("/api/pi/approve",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({paymentId:p.paymentId})}); }); setUser(auth.user); setStatus("Welcome "+auth.user.username); setTimeout(()=>setStatus(""),3000); } catch(e){ alert("Login failed"); } };
  const addToCart = () => { if(!selected) return; setCart([...cart,{...selected,color,size,qty:1}]); setSelected(null); setStatus("Added to cart"); setTimeout(()=>setStatus(""),2000); };
  const removeItem = (i:number) => setCart(cart.filter((_,x)=>x!==i));
  const total = cart.reduce((a,c)=>a+c.price*c.qty,0); const deliveryFee = method==="delivery"?0.0001:0; const grandTotal = total+deliveryFee; const walletTotal = grandTotal+PI_FEE;

  const saveOrder = (txid:string, barcode:string, snap:any, payType:string) => {
    const order = { id: barcode || ("SOSA-"+Date.now()), date: new Date().toLocaleString(), buyer: user?.username || snap.buyer || "Guest", name: snap.name, phone: snap.phone, method: snap.method, address: snap.method==="delivery"?snap.address:snap.pickupPoint, items: snap.cart.map((c:any)=>`${c.name} - ${c.color}/${c.size} x${c.qty}`).join(", "), total: snap.grandTotal, txid: txid || (payType==="barcode"?"Barcode - pay at pickup":txid), payType, tracking: payType==="barcode"?"Pending - Pay at Pickup":"Paid", points: Math.round(snap.grandTotal*10*10)/10 };
    const old = getOrders(); old.unshift(order); localStorage.setItem("sosa_orders", JSON.stringify(old)); refreshOrders();
  };

  const pay = async () => {
    if (paying) return; if (cart.length===0) return alert("Cart is empty - Add a product first");
    if (!fullName||!phone) return alert("Please enter your Full Name and Phone Number first");
    if (method==="delivery"&&!address) return alert("Please enter your Delivery Address"); if (!user) return alert("Please Login with Pi first");
    const Pi = getPi(); if (!Pi) return alert("Pi SDK not ready");
    const snap = { cart:[...cart], name:fullName, phone, method, address, pickupPoint, grandTotal, buyer:user.username };
    const memo = `SOSA Order - ${cart.map((c)=>c.name).join(", ")} | ${fullName} | ${phone} | ${method==="delivery"?"DELIVERY: "+address:"PICKUP: "+pickupPoint}`;
    setPaying(true); setStatus("Waiting for Wallet approval... Do NOT close");
    try { await Pi.createPayment({ amount: grandTotal, memo: memo.slice(0,200), metadata:{ name:fullName, phone, method, address: method==="delivery"?address:pickupPoint } }, {
      onReadyForServerApproval:(paymentId:string)=>{ setStatus("Payment approved by Pi, waiting for Wallet..."); return fetch("/api/pi/approve",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({paymentId})}); },
      onReadyForServerCompletion:(paymentId:string, txid:string)=>{ saveOrder(txid,"",snap,"pi"); setCart([]); setShowCart(false); setPaying(false); setStatus(""); alert("Payment SUCCESS! Order saved. Tracking: Paid ✅. We will contact you on "+phone); return fetch("/api/pi/complete",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({paymentId,txid})}); },
      onCancel:()=>{ setPaying(false); setStatus(""); alert("Payment cancelled - no money taken"); },
      onError:(e:any)=>{ setPaying(false); setStatus(""); alert("Payment error: "+e.message); },
      onIncompletePaymentFound:(p:any)=>{ fetch("/api/pi/complete",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({paymentId:p.paymentId,txid:p.transaction?.txid})}); },
    }); setTimeout(()=>{ setPaying((prev)=>{ if(prev) setStatus(""); return false; }); },60000);
    } catch(e:any){ setPaying(false); setStatus(""); if(e.message&&e.message.toLowerCase().includes("cancel")) alert("Payment cancelled"); else alert(e.message); }
  };

  const payBarcode = () => {
    if (cart.length===0) return alert("Cart is empty - Add a product first"); if (!fullName||!phone) return alert("Enter Name and Phone first"); if (method==="delivery"&&!address) return alert("Enter Delivery Address");
    const code = "SOSA-"+Math.floor(100000+Math.random()*900000); const snap = { cart:[...cart], name:fullName, phone, method, address, pickupPoint, grandTotal, buyer:user?.username||"Guest" };
    saveOrder("",code,snap,"barcode"); setCart([]);
    alert(`Barcode Payment: Your barcode ${code} - Show it at pickup to PAY THERE. Total: ${grandTotal} Pi. Status: Pending - Pay at Pickup. We will contact ${phone}`);
  };

  // Leaderboard: group by buyer
    
  const myOrders = user ? orders.filter((o:any)=>o.buyer===user.username) : orders;
  const myPoints = myOrders.reduce((a:any,o:any)=>a+Number(o.total||0)*10,0);
    const boardMap:any = {};
  orders.forEach((o:any) => {
    if (!boardMap[o.buyer]) {
      boardMap[o.buyer] = { buyer: o.buyer, total: 0, orders: 0, points: 0 };
    }
    boardMap[o.buyer].total += Number(o.total || 0);
    boardMap[o.buyer].orders += 1;
    boardMap[o.buyer].points += Number(o.total || 0) * 10;
  });
  const board:any[] = Object.values(boardMap);
  board.sort((a:any, b:any) => b.total - a.total);
  const Track = (props:any) => {
    const tracking = props.tracking;
    const steps = ["Paid", "Sent", "Delivered"];
    let idx = 0;
    if (tracking === "Pending - Pay at Pickup") {
      idx = -1;
    }
    if (tracking === "Sent") {
      idx = 1;
    }
    if (tracking === "Delivered") {
      idx = 2;
    }
    return (
      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        <span style={{ flex: 1, textAlign: "center", padding: 6, borderRadius: 20, fontSize: 11, fontWeight: "bold", background: 0 <= idx ? "#16a34a" : "#333", color: "#fff" }}>
          {0 <= idx ? "YES " : "NO "}Paid
        </span>
        <span style={{ flex: 1, textAlign: "center", padding: 6, borderRadius: 20, fontSize: 11, fontWeight: "bold", background: 1 <= idx ? "#16a34a" : "#333", color: "#fff" }}>
          {1 <= idx ? "YES " : "NO "}Sent
        </span>
        <span style={{ flex: 1, textAlign: "center", padding: 6, borderRadius: 20, fontSize: 11, fontWeight: "bold", background: 2 <= idx ? "#16a34a" : "#333", color: "#fff" }}>
          {2 <= idx ? "YES " : "NO "}Delivered
        </span>
      </div>
    );
  };
    <h1>SOPHISTICATED SAMPLES</h1><p>SOSA-outfits. Made in Nigeria</p>
    <p style={{color:"orange",fontSize:13}}>{sdkReady ? "Pi SDK Ready" : "Loading Pi..."} {user ? " @ " + user + " | " + myPoints.toFixed(1) + " pts" : ""}</p>
<div style={{display:"flex",gap:8}}>
{user ? <button onClick={()=>setUser(null)}>Logout</button> : <button onClick={()=>setUser(prompt("Enter your name") || "")}>Login</button>}
</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{PRODUCTS.map((p,i)=>(<div key={i} style={{background:"#111",borderRadius:12,padding:10,textAlign:"center"}}><div style={{background:"#eee",color:"#000",padding:18,borderRadius:8,fontWeight:"bold"}}>{p.name}</div><p style={{fontSize:13,margin:"8px 0"}}>{p.name} - {p.price} Pi - {p.cat}</p><button onClick={()=>{setSelected(p); setColor("Black"); setSize("L");}} style={{background:"orange",width:"100%",padding:10,borderRadius:20,border:0,fontWeight:"bold"}}>Add to Cart</button></div>))}</div>

    {selected && (<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50}}><div style={{background:"#fff",color:"#000",padding:20,borderRadius:16,width:"90%",maxWidth:360}}><h3>{selected.name} - {selected.price} Pi</h3><p>Colour</p><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{COLORS.map((c)=>(<button key={c} onClick={()=>setColor(c)} style={{padding:"8px 12px",borderRadius:20,background:color===c?"orange":"#eee",border:0}}>{c}</button>))}</div><p>Size</p><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{SIZES.map((s)=>(<button key={s} onClick={()=>setSize(s)} style={{padding:"8px 12px",borderRadius:20,background:size===s?"orange":"#eee",border:0}}>{s}</button>))}</div><button onClick={addToCart} style={{background:"orange",width:"100%",padding:12,borderRadius:20,border:0,fontWeight:"bold",marginTop:16}}>Add to Cart - {selected.price} Pi</button><button onClick={()=>setSelected(null)} style={{width:"100%",padding:10,marginTop:8,borderRadius:20}}>Close</button></div></div>)}

    {showCart && (<div style={{position:"fixed",inset:0,background:"#000",padding:20,paddingBottom:120,overflowY:"auto",zIndex:60}}><h2>Your Cart</h2>{cart.length===0 && <p style={{background:"#222",padding:12,borderRadius:10}}>Your cart is empty. Go back and add a product first.</p>}{cart.map((c,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#111",padding:10,borderRadius:10,marginBottom:8}}><span>{c.name} - {c.color} / {c.size} - {c.price} Pi x {c.qty}</span><button onClick={()=>removeItem(i)} style={{background:"red",color:"#fff",border:0,borderRadius:20,padding:"6px 12px",fontWeight:"bold"}}>X</button></div>))}<p><b>Total: {total.toFixed(2)} Pi</b></p><h3>--- CHECKOUT DETAILS ---</h3><input placeholder="Full Name *" value={fullName} onChange={(e)=>setFullName(e.target.value)} style={{width:"100%",padding:12,marginBottom:8,borderRadius:10,boxSizing:"border-box"}} /><input placeholder="Phone Number / WhatsApp *" value={phone} onChange={(e)=>setPhone(e.target.value)} style={{width:"100%",padding:12,marginBottom:12,borderRadius:10,boxSizing:"border-box"}} /><div style={{background:"#111",padding:12,borderRadius:12,marginBottom:12,fontSize:13,lineHeight:1.6}}><div>🏪 {PICKUP_INFO}</div><div style={{marginTop:6}}>🚚 {DELIVERY_INFO}</div></div><div style={{display:"flex",gap:8}}><button onClick={()=>setMethod("delivery")} style={{flex:1,padding:12,borderRadius:20,background:method==="delivery"?"orange":"#333",color:"#fff",border:0,fontWeight:"bold"}}>🚚 Delivery (+0.0001 Pi)</button><button onClick={()=>setMethod("pickup")} style={{flex:1,padding:12,borderRadius:20,background:method==="pickup"?"orange":"#333",color:"#fff",border:0,fontWeight:"bold"}}>🏪 Self Pickup (Free)</button></div>{method==="delivery"?(<textarea placeholder="Delivery Address - House No, Street, Area, City, State *" value={address} onChange={(e)=>setAddress(e.target.value)} style={{width:"100%",padding:12,marginTop:12,borderRadius:10,minHeight:70,boxSizing:"border-box"}} />):(<div style={{marginTop:12}}><p>Self Pickup Address:</p><select value={pickupPoint} onChange={(e)=>setPickupPoint(e.target.value)} style={{width:"100%",padding:12,borderRadius:10}}><option value={PICKUP_ADDRESS}>{PICKUP_ADDRESS}</option></select><p style={{fontSize:13,background:"#222",padding:10,borderRadius:10,marginTop:8}}>🏪 Self Pickup (Free): {PICKUP_ADDRESS}<br/>Show your barcode at this pickup point.</p></div>)}<div style={{background:"#111",padding:12,borderRadius:12,marginTop:12,fontSize:13,lineHeight:1.7}}><div><b>Grand Total (to SOSA): {grandTotal.toFixed(4)} Pi</b> {method==="delivery"?"(incl. delivery - 1-2 days Lagos, 4-7 days outside Lagos)":"(self pickup free)"}</div><div>+ Pi Network Fee: 0.01 Pi (paid to Pi, NOT to SOSA)</div><div><b>Wallet will show: {walletTotal.toFixed(4)} Pi total</b> {cart.length===0?"":`( ${grandTotal.toFixed(4)} to SOSA + 0.01 Pi fee )`}</div></div><button onClick={pay} disabled={paying||cart.length===0} style={{background:cart.length===0?"#555":paying?"#888":"orange",color:cart.length===0?"#aaa":"#000",width:"100%",padding:14,borderRadius:20,border:0,fontWeight:"bold",marginTop:8}}>{cart.length===0?"Cart is empty - Add a product first":paying?"Waiting for Wallet... Please approve in Wallet":`Pay with Pi - ${grandTotal.toFixed(4)} Pi`}</button>{paying && <p style={{textAlign:"center",color:"orange",fontSize:13}}>⏳ Waiting for Wallet approval... Do NOT tap Pay again</p>}<button onClick={payBarcode} disabled={cart.length===0} style={{background:cart.length===0?"#222":"#333",color:cart.length===0?"#888":"#fff",width:"100%",padding:14,borderRadius:20,border:0,marginTop:8}}>Pay with Barcode at Pickup — Pay when you come to shop. Show barcode.</button><p style={{fontSize:12,color:"#aaa",textAlign:"center"}}>Barcode = Reserve now, pay at pickup. No Pi taken now.</p><button onClick={()=>setShowCart(false)} style={{width:"100%",padding:12,borderRadius:20,marginTop:8}}>Close Cart</button></div>)}

    {showOrders && (<div style={{position:"fixed",inset:0,background:"#000",padding:20,overflowY:"auto",zIndex:70}}><h2>📦 My Orders / Tracking</h2><p>{user?`@${user.username} — ⭐ ${myPoints.toFixed(1)} pts (1 Pi = 10 pts)`:"Login to see only your orders"}</p>{myOrders.length===0 && <p>No orders yet.</p>}{myOrders.map((o:any,i:number)=>(<div key={i} style={{background:"#111",padding:12,borderRadius:12,marginBottom:10}}><b>{o.id}</b> — {o.date}<div style={{fontSize:13,marginTop:6}}>Items: {o.items}<br/>Total: {o.total} Pi | Method: {o.method} | Points: {o.points} ⭐<br/>Status: <b style={{color: o.tracking==="Delivered"?"#16a34a":o.tracking==="Paid"?"#16a34a":"orange"}}>{o.tracking}</b></div><Track tracking={o.tracking} /></div>))}<button onClick={()=>setShowOrders(false)} style={{width:"100%",padding:12,borderRadius:20,marginTop:8}}>Close</button></div>)}

    {showBoard && (<div style={{position:"fixed",inset:0,background:"#000",padding:20,overflowY:"auto",zIndex:70}}><h2>🏆 SOSA Leaderboard</h2><p>1 Pi = 10 pts. Ranked by Total Pi spent. This proves successful transactions.</p>{board.map((b:any,i:number)=>(<div key={i} style={{background: i===0?"#eab308":"#111",color: i===0?"#000":"#fff",padding:12,borderRadius:12,marginBottom:8,display:"flex",justifyContent:"space-between"}}><span>#{i+1} @{b.buyer} — {b.orders} order(s)</span><span><b>{Number(b.total).toFixed(4)} Pi</b> | ⭐ {Number(b.points).toFixed(1)} pts</span></div>))}{board.length===0 && <p>No orders yet.</p>}<button onClick={()=>setShowBoard(false)} style={{width:"100%",padding:12,borderRadius:20,marginTop:8}}>Close</button></div>)}
  </div>);
  }
