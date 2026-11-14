"use client";
import { useEffect, useState } from "react";

function fmtPhone(p: any){
  let raw = String(p || '').trim();
  let digits = raw.replace(/\D/g,'');
  if(digits.startsWith('234') && digits.length===13) return '+234 ' + digits.slice(3,6) + ' ' + digits.slice(6,9) + ' ' + digits.slice(9);
  if(digits.startsWith('0') && digits.length===11) return digits.slice(0,4) + ' ' + digits.slice(4,7) + ' ' + digits.slice(7);
  if(digits.length===10 && digits.startsWith('8')) return '0' + digits.slice(0,3) + ' ' + digits.slice(3,6) + ' ' + digits.slice(6);
  return raw;
}

// FIX 2: My Orders - read old tracking so green light shows
function getFlags(o:any){
  if(o.paid!==undefined || o.sent!==undefined || o.delivered!==undefined) return { paid: !!o.paid, sent: !!o.sent, delivered: !!o.delivered };
  const t = o.tracking || "";
  if(t==="Delivered") return { paid:true, sent:true, delivered:true };
  if(t==="Sent") return { paid:true, sent:true, delivered:false };
  if(t==="Paid") return { paid:true, sent:false, delivered:false };
  if(t==="Pending - Pay at Pickup") return { paid:false, sent:false, delivered:false };
  return { paid: !!o.paid, sent: !!o.sent, delivered: !!o.delivered };
}

const PRODUCTS = [
  { name: "Classic Heel", price: 0.05, cat: "Footwear" },
  { name: "Royal Heel", price: 0.04, cat: "Footwear" },
  { name: "Lagos Heel", price: 0.03, cat: "Footwear" },
  { name: "Executive Heel", price: 0.05, cat: "Footwear" },
  { name: "Heritage Heel", price: 0.04, cat: "Footwear" },
  { name: "Classic Flat", price: 0.05, cat: "Footwear" },
  { name: "Royal Flat", price: 0.04, cat: "Footwear" },
  { name: "Lagos Flat", price: 0.03, cat: "Footwear" },
  { name: "Executive Flat", price: 0.05, cat: "Footwear" },
  { name: "Heritage Flat", price: 0.04, cat: "Footwear" },
  { name: "Classic Palm Slide", price: 0.04, cat: "Footwear" },
  { name: "Royal Palm Slide", price: 0.04, cat: "Footwear" },
  { name: "Lagos Palm Slide", price: 0.03, cat: "Footwear" },
  { name: "Executive Palm Slide", price: 0.05, cat: "Footwear" },
  { name: "Heritage Palm Slide", price: 0.04, cat: "Footwear" },
];

export default function Home(){
  const [user, setUser] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showLeader, setShowLeader] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [points, setPoints] = useState(0);
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [method, setMethod] = useState("pickup");
  const [address, setAddress] = useState("No. 1, ODICHE STREET, COKER Aguda, ORILE, LAGOS.");
  const [paying, setPaying] = useState(false);

  useEffect(()=>{
    try{
      const o = JSON.parse(localStorage.getItem("sosa_orders")||"[]");
      setOrders(o); setPoints(o.reduce((a:any,x:any)=>a+Number(x.points||0),0));
    }catch{}
    const u = localStorage.getItem("sosa_user");
    if(u) setUser(JSON.parse(u));
  },[]);

  const saveOrders=(next:any[])=>{ setOrders(next); localStorage.setItem("sosa_orders", JSON.stringify(next)); setPoints(next.reduce((a:any,x:any)=>a+Number(x.points||0),0)); };
  const login=()=>{ const u={username:"chijoe09",name:"Jude Chijoe"}; setUser(u); localStorage.setItem("sosa_user", JSON.stringify(u)); };
  const addToCart=(p:any)=>{ const size=prompt("Choose size: S, M, L, XL, XXL","M")||"M"; const color=prompt("Choose color: Black / Brown","Black")||"Black"; setCart([...cart,{...p,size,color,id:Date.now()+Math.random()}]); };
  const total = cart.reduce((a:any,c:any)=>a+Number(c.price||0),0);
  const deliveryFee = method==="delivery" ? 0.0001 : 0;
  const grandTotal = total + deliveryFee;

  const leaderMap: any = {};
  orders.forEach((o:any)=>{
    const key = o.buyer || o.name || "Guest";
    if(!leaderMap[key]) leaderMap[key] = { name: o.name || key, buyer: key, points: 0, orders: 0, total: 0 };
    leaderMap[key].points += Number(o.points||0);
    leaderMap[key].orders += 1;
    leaderMap[key].total += Number(o.total||0);
  });
  const leaders = Object.values(leaderMap).sort((a:any,b:any)=>b.points-a.points).slice(0,10);

  const validate=()=>{
    if(!custName.trim()){ alert("Enter Full Name"); return false; }
    const digits = custPhone.replace(/\D/g,'');
    if(digits.length!==11 && digits.length!==13 && digits.length!==10){ alert("Enter valid phone: 08176675579 or +2348176675579"); return false; }
    if(method==="delivery" && !address.trim()){ alert("Enter delivery address"); return false; }
    if(cart.length===0){ alert("Cart is empty"); return false; }
    return true;
  };

  const createOrder=(paid:boolean, txid:string)=>{
    const order={ id:"SOSA-"+Date.now(), date:new Date().toLocaleString(), buyer:user?.username||"chijoe09", name:custName, phone:custPhone, method:method==="pickup"?"pickup":"delivery", address:method==="pickup"?"No. 1, ODICHE STREET, COKER Aguda, ORILE, LAGOS.":address, items:cart.map((c:any)=>`${c.name} - ${c.color}/${c.size} x1`).join(", "), total:Number(grandTotal.toFixed(4)), points:Number(total.toFixed(1)), txid:txid, paid:paid, sent:false, delivered:false, tracking:paid?"Paid":"Pending - Pay at Pickup" };
    const next=[order,...orders]; saveOrders(next); setCart([]); setShowCart(false);
    alert(paid?`Payment SUCCESS! Order saved. Tracking: Paid ✅ We will contact you on ${custPhone}`:`Barcode Order saved. Pay at pickup. We will contact you on ${custPhone}`);
  };

  const payWithPi=async()=>{
    if(!validate()) return; setPaying(true);
    try{
      // @ts-ignore
      const Pi=(window as any).Pi;
      if(!Pi){ alert("Open in Pi Browser to pay with Pi"); setPaying(false); return; }
      await Pi.createPayment({ amount:grandTotal, memo:`SOSA Order - ${cart.map((c:any)=>c.name).join(", ")} | ${custName} | ${custPhone} | ${method==="pickup"?"PICKUP":"DELIVERY"}: ${address}`, metadata:{name:custName,phone:custPhone,method,address} },{
        onReadyForServerApproval:(paymentId:string)=>{},
        onReadyForServerCompletion:(paymentId:string,txid:string)=>{ createOrder(true,txid); setPaying(false); },
        onCancel:()=>{ setPaying(false); }, onError:()=>{ setPaying(false); alert("Payment failed"); },
      });
    }catch(e){ setPaying(false); alert("Payment error"); }
  };
  const payWithBarcode=()=>{ if(!validate()) return; createOrder(false,"BARCODE-"+Date.now()); };

  return (
    <div style={{background:"#000",color:"#fff",minHeight:"100vh",padding:16,fontFamily:"sans-serif"}}>
      <h1 style={{fontSize:28,fontWeight:"bold",lineHeight:1.1}}>SOPHISTICATED<br/>SAMPLES</h1>
      <p>SOSA-outfits. Made in Nigeria</p>
      <p style={{color:"orange",fontSize:13}}>Pi SDK Ready @chijoe09 | {points.toFixed(1)} pts</p>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
        {!user ? <button onClick={login} style={{padding:"6px 10px",borderRadius:6,background:"#fff",color:"#000"}}>Login with Pi</button> : <button onClick={()=>{setUser(null); localStorage.removeItem("sosa_user");}} style={{padding:"6px 10px",borderRadius:6,background:"#fff",color:"#000"}}>Logout</button>}
        <button onClick={()=>{setShowCart(true); setShowOrders(false); setShowLeader(false);}} style={{padding:"6px 10px",borderRadius:6,background:"#fff",color:"#000"}}>Cart ({cart.length})</button>
        <button onClick={()=>{setShowOrders(true); setShowCart(false); setShowLeader(false);}} style={{padding:"6px 10px",borderRadius:6,background:"#fff",color:"#000"}}>My Orders</button>
        <button onClick={()=>{setShowLeader(true); setShowCart(false); setShowOrders(false);}} style={{padding:"6px 10px",borderRadius:6,background:"orange",color:"#000",fontWeight:"bold"}}>🏆 Leadership Board</button>
        <a href="/admin" style={{padding:"6px 10px",borderRadius:6,background:"#fff",color:"#000",textDecoration:"none"}}>Admin</a>
      </div>

      {showLeader && (
        <div style={{background:"#111",padding:12,borderRadius:12}}>
          <h2>🏆 SOSA Leadership Board</h2>
          <p style={{fontSize:12,color:"#aaa"}}>Top buyers by ⭐ Points. More orders = more points = higher rank.</p>
          <p>Your Points: <b style={{color:"orange"}}>{points.toFixed(1)} pts</b></p>
          {leaders.length===0 && <p>No buyers yet. Be the first!</p>}
          {leaders.map((l:any,i:number)=>(
            <div key={i} style={{background: i===0?"orange":"#fff", color:"#000", padding:12, borderRadius:12, marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <span><b>{i===0?"👑 #1 ":i===1?"🥈 #2 ":i===2?"🥉 #3 ":`#${i+1} `}{l.name}</b><br/><span style={{fontSize:11}}>@{l.buyer} • {l.orders} order(s) • {Number(l.total).toFixed(4)} Pi</span></span>
              <b style={{fontSize:18}}>⭐ {Number(l.points).toFixed(1)}</b>
            </div>
          ))}
          <button onClick={()=>setShowLeader(false)} style={{width:"100%",padding:12,borderRadius:10,background:"#333",color:"#fff",border:0,marginTop:8}}>← Back to Shop</button>
        </div>
      )}

      {!showCart && !showOrders && !showLeader && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {PRODUCTS.map((p:any,i:number)=>(
            <div key={i} style={{background:"#fff",color:"#000",borderRadius:12,padding:12,textAlign:"center"}}>
              <b>{p.name}</b><br/><span style={{fontSize:12}}>{p.name} - {p.price} Pi - {p.cat}</span><br/>
              <button onClick={()=>addToCart(p)} style={{marginTop:8,padding:"10px 14px",borderRadius:20,background:"orange",border:0,fontWeight:"bold",width:"100%"}}>Add to Cart</button>
            </div>
          ))}
        </div>
      )}

      {showOrders && (
        <div><h2>My Orders</h2><button onClick={()=>setShowOrders(false)} style={{padding:8,borderRadius:8}}>← Back</button>
          {orders.length===0 && <p>No orders yet.</p>}
          {orders.map((o:any,i:number)=>{
            const f = getFlags(o);
            const statusText = f.delivered ? "Delivered" : f.sent ? "Sent" : f.paid ? "Paid" : "Pending - Pay at Pickup";
            return (
            <div key={i} style={{background:"#fff",color:"#000",padding:12,borderRadius:12,marginTop:10}}>
              <b>{o.id}</b><br/>{o.date}<br/>Items: {o.items}<br/>Total: {o.total} Pi<br/>Phone: {fmtPhone(o.phone)}<br/>
              Status: <b style={{color: f.delivered||f.paid?"#16a34a":"orange"}}>{statusText}</b><br/>
              <div style={{display:"flex",gap:6,marginTop:8}}>
                <span style={{flex:1,textAlign:"center",padding:6,borderRadius:20,background:f.paid?"#16a34a":"#333",color:"#fff",fontSize:11}}>{f.paid?"✅ ":"⚪ "}Paid</span>
                <span style={{flex:1,textAlign:"center",padding:6,borderRadius:20,background:f.sent?"#16a34a":"#333",color:"#fff",fontSize:11}}>{f.sent?"✅ ":"⚪ "}Sent</span>
                <span style={{flex:1,textAlign:"center",padding:6,borderRadius:20,background:f.delivered?"#16a34a":"#333",color:"#fff",fontSize:11}}>{f.delivered?"✅ ":"⚪ "}Delivered</span>
              </div>
            </div>
            );
          })}
        </div>
      )}

      {showCart && (
        <div style={{background:"#111",padding:12,borderRadius:12}}><h2>Cart</h2>
          {cart.map((c:any,i:number)=>(
            <div key={i} style={{background:"#fff",color:"#000",padding:10,borderRadius:10,marginBottom:8,display:"flex",justifyContent:"space-between"}}>
              <span>{c.name} - {c.color} / {c.size} - {c.price} Pi x 1</span>
              <button onClick={()=>setCart(cart.filter((_:any,idx:number)=>idx!==i))} style={{background:"red",color:"#fff",border:0,borderRadius:50,padding:"2px 8px"}}>X</button>
            </div>
          ))}
          <p>Total: {total.toFixed(2)} Pi</p><h3>--- CHECKOUT DETAILS ---</h3>
          <input placeholder="Full Name *" value={custName} onChange={(e)=>setCustName(e.target.value)} style={{width:"100%",padding:12,borderRadius:10,marginBottom:8,border:0}} />
          <input type="tel" inputMode="tel" autoComplete="tel" placeholder="Phone Number / WhatsApp *" value={custPhone} onChange={(e)=>setCustPhone(e.target.value.replace(/[^0-9+]/g, ""))} style={{width:"100%",padding:12,borderRadius:10,marginBottom:8,border:0}} />
          <p style={{fontSize:11,color:"#aaa",marginTop:-4}}>Example: 08176675579 or +2348176675579 — numbers only</p>
          <div style={{background:"#222",padding:10,borderRadius:10,fontSize:12,marginBottom:8}}>🏠 Self Pickup (Free): No. 1, ODICHE STREET, COKER Aguda, ORILE, LAGOS.<br/>🚚 Delivery: 0.0001 Pi (1-2 days Lagos, 4-7 days outside Lagos)</div>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <button onClick={()=>setMethod("delivery")} style={{flex:1,padding:12,borderRadius:20,background:method==="delivery"?"orange":"#333",color:"#fff",border:0,fontWeight:"bold"}}>🚚 Delivery (+0.0001 Pi)</button>
            <button onClick={()=>setMethod("pickup")} style={{flex:1,padding:12,borderRadius:20,background:method==="pickup"?"orange":"#333",color:"#fff",border:0,fontWeight:"bold"}}>🏠 Self Pickup (Free)</button>
          </div>
          <p>Self Pickup Address:</p>
          <input value={method==="pickup"?"No. 1, ODICHE STREET, COKER Aguda, ORILE, LAGOS.":address} onChange={(e)=>setAddress(e.target.value)} disabled={method==="pickup"} style={{width:"100%",padding:12,borderRadius:10,marginBottom:8}} />
          <p>Grand Total (SOSA): {total.toFixed(4)} Pi {method==="delivery"?"+ 0.0001 delivery":"(self pickup free)"}<br/>+ Pi Network Fee: 0.01 Pi (paid to Pi, NOT SOSA)<br/>Wallet will show: {(grandTotal+0.01).toFixed(4)} Pi total</p>
          <button onClick={payWithPi} disabled={paying} style={{width:"100%",padding:14,borderRadius:20,background:"orange",border:0,fontWeight:"bold",marginBottom:8}}>{paying?"Waiting for Wallet approval... DO NOT tap Pay again":`Pay with Pi - ${grandTotal.toFixed(4)} Pi`}</button>
          <button onClick={payWithBarcode} style={{width:"100%",padding:14,borderRadius:20,background:"#fff",color:"#000",border:0,fontWeight:"bold"}}>Pay with Barcode at Pickup — Pay when you come to shop. Show barcode.</button>
          <p style={{fontSize:12,textAlign:"center"}}>Barcode = Reserve now, pay at pickup. No Pi taken now.</p>
          <button onClick={()=>setShowCart(false)} style={{width:"100%",padding:12,borderRadius:10,background:"#333",color:"#fff",border:0,marginTop:8}}>Close Cart</button>
        </div>
      )}
    </div>
  );
}
