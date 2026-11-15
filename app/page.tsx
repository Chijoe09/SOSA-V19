"use client";
import { useEffect, useState } from "react";

function fmtPhone(p: any){
  let raw = String(p || '').trim();
  let digits = raw.replace(/\D/g,'');
  if(digits.startsWith('234') && digits.length===13){
    return '+234 ' + digits.slice(3,6) + ' ' + digits.slice(6,9) + ' ' + digits.slice(9);
  }
  if(digits.startsWith('0') && digits.length===11){
    return digits.slice(0,4) + ' ' + digits.slice(4,7) + ' ' + digits.slice(7);
  }
  if(digits.length===10 && digits.startsWith('8')){
    return '0' + digits.slice(0,3) + ' ' + digits.slice(3,6) + ' ' + digits.slice(6);
  }
  return raw;
}

function getFlags(o:any){
  if(o.delivered) return { paid:true, sent:true, delivered:true };
  if(o.sent) return { paid: !!o.paid || o.tracking==="Sent", sent:true, delivered:false };
  if(o.paid!==undefined || o.sent!==undefined || o.delivered!==undefined){
    return { paid: !!o.paid, sent: !!o.sent, delivered: !!o.delivered };
  }
  const t = o.tracking || "";
  if(t==="Delivered") return { paid:true, sent:true, delivered:true };
  if(t==="Sent") return { paid:true, sent:true, delivered:false };
  if(t==="Paid") return { paid:true, sent:false, delivered:false };
  return { paid:false, sent:false, delivered:false };
}

// NO MORE FAKE DRAWINGS - Honest photo placeholder. Real photo goes here when you send it.
function PhotoBox({ name, cat, color }:{ name:string, cat:string, color:string }){
  return (
    <div style={{background: color==="Brown" ? "#3E2A1A" : "#111", color:"#fff", borderRadius:12, padding:16, width:110, height:110, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center", flexShrink:0}}>
      <div style={{fontSize:10,letterSpacing:2,color:"orange",fontWeight:"bold"}}>SOSA • {cat.toUpperCase()}</div>
      <div style={{fontSize:14,fontWeight:"bold",margin:"6px 0",lineHeight:1.2}}>{name}</div>
      <div style={{fontSize:10,color:"#aaa"}}>📸 Photo Coming Soon</div>
      <div style={{fontSize:10,marginTop:6,background: color==="Brown" ? "#8B4513" : "#fff", color: color==="Brown" ? "#fff" : "#000", padding:"3px 10px", borderRadius:20, fontWeight:"bold"}}>{color}</div>
    </div>
  );
}

const PRODUCTS = [
  { name: "Classic Heel", price: 0.05, cat: "Heel", desc: "Elegant classic heel for church, wedding & office. Comfortable sole, made in Nigeria.", detail: "Heel height: Medium. Material: Quality leather-like. Fitting: True to size. Comes in SOSA branded pack." },
  { name: "Royal Heel", price: 0.04, cat: "Heel", desc: "Royal look, soft inner pad. Perfect for owambe & special occasions.", detail: "Heel height: Medium. Material: Quality leather-like. Fitting: True to size." },
  { name: "Lagos Heel", price: 0.03, cat: "Heel", desc: "Light Lagos everyday heel. Easy to walk in, strong & durable.", detail: "Heel height: Low-Medium. Best for daily use." },
  { name: "Executive Heel", price: 0.05, cat: "Heel", desc: "Sharp executive heel for office & meetings. Clean, classy finish.", detail: "Heel height: Medium. Office-ready, all-day comfort." },
  { name: "Heritage Heel", price: 0.04, cat: "Heel", desc: "Heritage design with Nigerian style. Strong, beautiful, timeless.", detail: "Heritage collection. Durable sole, premium finish." },
  { name: "Classic Flat", price: 0.05, cat: "Flat", desc: "Classic flat for everyday comfort. Church, office, market - all day.", detail: "Flat sole. Soft inner. True to size." },
  { name: "Royal Flat", price: 0.04, cat: "Flat", desc: "Royal flat with soft cushion. Elegant but comfortable.", detail: "Flat sole. Cushioned insole." },
  { name: "Lagos Flat", price: 0.03, cat: "Flat", desc: "Light Lagos flat. Walk anywhere in Lagos with ease.", detail: "Lightweight, everyday flat." },
  { name: "Executive Flat", price: 0.05, cat: "Flat", desc: "Executive flat for work. Neat, professional, comfortable.", detail: "Office flat. All-day comfort." },
  { name: "Heritage Flat", price: 0.04, cat: "Flat", desc: "Heritage flat - Nigerian craft, modern comfort.", detail: "Heritage collection. Durable." },
  { name: "Classic Palm Slide", price: 0.04, cat: "Slide", desc: "Classic palm slide. Easy to wear, easy to wash, very comfortable.", detail: "Slide-on. No stress. Everyday wear." },
  { name: "Royal Palm Slide", price: 0.04, cat: "Slide", desc: "Royal palm slide - soft, classy, premium feel.", detail: "Soft sole, premium finish." },
  { name: "Lagos Palm Slide", price: 0.03, cat: "Slide", desc: "Lagos palm slide for home & street. Light & strong.", detail: "Everyday slide." },
  { name: "Executive Palm Slide", price: 0.05, cat: "Slide", desc: "Executive palm slide - clean look for smart casual.", detail: "Smart casual slide." },
  { name: "Heritage Palm Slide", price: 0.04, cat: "Slide", desc: "Heritage palm slide - our signature Nigerian slide.", detail: "Heritage collection. Signature design." },
];

export default function Home(){
  const [user, setUser] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [view, setView] = useState("shop");
  const [selected, setSelected] = useState<any>(null);
  const [detailQty, setDetailQty] = useState(1);
  const [orders, setOrders] = useState<any[]>([]);
  const [points, setPoints] = useState(0);
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [method, setMethod] = useState("pickup");
  const [address, setAddress] = useState("No. 1, ODICHE STREET, COKER Aguda, ORILE, LAGOS.");
  const [paying, setPaying] = useState(false);
  const [selSize, setSelSize] = useState<any>({});
  const [selColor, setSelColor] = useState<any>({});

  const reloadOrders = ()=>{
    try{
      const o = JSON.parse(localStorage.getItem("sosa_orders")||"[]");
      setOrders(o);
      setPoints(o.reduce((a:any,x:any)=>a+Number(x.points||0),0));
    }catch{}
  };

  useEffect(()=>{
    reloadOrders();
    try{
      const c = JSON.parse(localStorage.getItem("sosa_cart")||"[]");
      if(Array.isArray(c)) setCart(c.map((x:any)=>({ ...x, qty: x.qty || 1 })));
    }catch{}
    const h = ()=>reloadOrders();
    window.addEventListener("storage", h);
    window.addEventListener("focus", h);
    const u = localStorage.getItem("sosa_user");
    if(u) setUser(JSON.parse(u));
    return ()=>{
      window.removeEventListener("storage", h);
      window.removeEventListener("focus", h);
    };
  },[]);

  const saveCart = (next:any[])=>{
    setCart(next);
    localStorage.setItem("sosa_cart", JSON.stringify(next));
  };

  const saveOrders = (next:any[])=>{
    setOrders(next);
    localStorage.setItem("sosa_orders", JSON.stringify(next));
    setPoints(next.reduce((a:any,x:any)=>a+Number(x.points||0),0));
  };

  const login = ()=>{
    const u = { username:"chijoe09", name:"Jude Chijoe" };
    setUser(u);
    localStorage.setItem("sosa_user", JSON.stringify(u));
  };

  const addToCart = (p:any, qty:number=1)=>{
    const size = selSize[p.name] || "M";
    const color = selColor[p.name] || "Black";
    const found = cart.find((c:any)=>c.name===p.name && c.size===size && c.color===color);
    if(found){
      saveCart(cart.map((c:any)=> c===found ? { ...c, qty: (c.qty||1)+qty } : c));
    } else {
      saveCart([...cart, { ...p, size, color, qty: qty, id: Date.now()+Math.random() }]);
    }
  };

  const changeQty = (id:any, delta:number)=>{
    const next = cart.map((c:any)=>{
      if(c.id!==id) return c;
      return { ...c, qty: Math.max(1, (c.qty||1)+delta) };
    });
    saveCart(next);
  };

  const cartCount = cart.reduce((a:any,c:any)=>a+(c.qty||1),0);
  const total = cart.reduce((a:any,c:any)=>a+Number(c.price||0)*(c.qty||1),0);
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

  const validate = ()=>{
    if(!custName.trim()){ alert("Enter Full Name"); return false; }
    const digits = custPhone.replace(/\D/g,'');
    if(digits.length!==11 && digits.length!==13 && digits.length!==10){
      alert("Enter valid phone: 08176675579 or +2348176675579");
      return false;
    }
    if(method==="delivery" && !address.trim()){ alert("Enter delivery address"); return false; }
    if(cart.length===0){ alert("Cart is empty"); return false; }
    return true;
  };

  const createOrder = (paid:boolean, txid:string)=>{
    const order = {
      id: "SOSA-"+Date.now(),
      date: new Date().toLocaleString(),
      buyer: user?.username || "chijoe09",
      name: custName,
      phone: custPhone,
      method: method==="pickup" ? "pickup" : "delivery",
      address: method==="pickup" ? "No. 1, ODICHE STREET, COKER Aguda, ORILE, LAGOS." : address,
      items: cart.map((c:any)=>`${c.name} - ${c.color}/${c.size} x${c.qty||1}`).join(", "),
      total: Number(grandTotal.toFixed(4)),
      points: Number(total.toFixed(1)),
      txid: txid,
      paid: paid,
      sent: false,
      delivered: false,
      tracking: paid ? "Paid" : "Pending - Pay at Pickup"
    };
    const next = [order, ...orders];
    saveOrders(next);
    saveCart([]);
    setView("orders");
    alert(paid ? `Payment SUCCESS! Order saved. Tracking: Paid ✅ We will contact you on ${custPhone}` : `Barcode Order saved. Pay at pickup. We will contact you on ${custPhone}`);
  };

  const payWithPi = async ()=>{
    if(!validate()) return;
    setPaying(true);
    try{
      // @ts-ignore
      const Pi = (window as any).Pi;
      if(!Pi){
        alert("Open in Pi Browser to pay with Pi");
        setPaying(false);
        return;
      }
      await Pi.createPayment({
        amount: grandTotal,
        memo: `SOSA Order - ${cart.map((c:any)=>c.name).join(", ")} | ${custName} | ${custPhone} | ${method==="pickup"?"PICKUP":"DELIVERY"}: ${address}`,
        metadata: { name: custName, phone: custPhone, method, address }
      },{
        onReadyForServerApproval: (paymentId:string)=>{},
        onReadyForServerCompletion: (paymentId:string, txid:string)=>{
          createOrder(true, txid);
          setPaying(false);
        },
        onCancel: ()=>{ setPaying(false); },
        onError: ()=>{ setPaying(false); alert("Payment failed"); },
      });
    }catch(e){
      setPaying(false);
      alert("Payment error");
    }
  };

  const payWithBarcode = ()=>{
    if(!validate()) return;
    createOrder(false, "BARCODE-"+Date.now());
  };

  const openDetail = (p:any)=>{
    setSelected(p);
    setDetailQty(1);
    setView("detail");
    window.scrollTo(0,0);
  };

  const goShop = ()=>{
    setView("shop");
    window.scrollTo(0,0);
  };

  return (
    <div style={{background:"#000",color:"#fff",minHeight:"100vh",padding:16,fontFamily:"sans-serif"}}>
      {view!=="shop" && (
        <div style={{background:"#000",padding:"8px 0",marginBottom:8}}>
          <button onClick={goShop} style={{padding:"10px 16px",borderRadius:10,background:"#fff",color:"#000",fontWeight:"bold",border:0,width:"100%"}}>← Back to Shop</button>
        </div>
      )}

      <h1 style={{fontSize:28,fontWeight:"bold",lineHeight:1.1,margin:0}}>SOPHISTICATED<br/>SAMPLES</h1>
      <p style={{margin:"8px 0"}}>SOSA-outfits. Made in Nigeria</p>
      <p style={{color:"orange",fontSize:13,margin:"0 0 12px 0"}}>Pi SDK Ready @chijoe09 | {points.toFixed(1)} pts</p>

      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
        {!user ? (
          <button onClick={login} style={{padding:"6px 10px",borderRadius:6,background:"#fff",color:"#000",border:0}}>Login with Pi</button>
        ) : (
          <button onClick={()=>{setUser(null); localStorage.removeItem("sosa_user");}} style={{padding:"6px 10px",borderRadius:6,background:"#fff",color:"#000",border:0}}>Logout</button>
        )}
        <button onClick={()=>{reloadOrders(); setView("cart"); window.scrollTo(0,0);}} style={{padding:"6px 10px",borderRadius:6,background:"#fff",color:"#000",border:0}}>Cart ({cartCount})</button>
        <button onClick={()=>{reloadOrders(); setView("orders"); window.scrollTo(0,0);}} style={{padding:"6px 10px",borderRadius:6,background:"#fff",color:"#000",border:0}}>My Orders</button>
        <button onClick={()=>{setView("leader"); window.scrollTo(0,0);}} style={{padding:"6px 10px",borderRadius:6,background:"orange",color:"#000",fontWeight:"bold",border:0}}>🏆 Leadership Board</button>
      </div>

      {view==="leader" && (
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
        </div>
      )}

      {view==="shop" && (
        <div>
          <p style={{fontSize:12,color:"#aaa",marginBottom:8}}>👆 Tap any product to SEE details before you buy.</p>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {PRODUCTS.map((p:any)=>{
              const col = selColor[p.name] || "Black";
              return (
                <div key={p.name} style={{background:"#fff",color:"#000",borderRadius:14,padding:14,display:"flex",gap:12,alignItems:"center"}}>
                  <div onClick={()=>openDetail(p)} style={{cursor:"pointer"}}>
                    <PhotoBox name={p.name} cat={p.cat} color={col} />
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:"bold",fontSize:16}}>{p.name}</div>
                    <div style={{fontSize:15,fontWeight:"bold",color:"orange"}}>{p.price} Pi • {p.cat} • {col}</div>
                    <div style={{fontSize:12,color:"#666",margin:"4px 0"}}>{p.desc}</div>
                    <div style={{display:"flex",gap:6,marginTop:6}}>
                      <select value={selSize[p.name]||"M"} onChange={(e)=>setSelSize({...selSize,[p.name]:e.target.value})} style={{flex:1,padding:8,borderRadius:8,border:"1px solid #ddd",fontSize:14}}>
                        <option value="S">Size S</option><option value="M">Size M</option><option value="L">Size L</option><option value="XL">Size XL</option><option value="XXL">Size XXL</option>
                      </select>
                      <select value={col} onChange={(e)=>setSelColor({...selColor,[p.name]:e.target.value})} style={{flex:1,padding:8,borderRadius:8,border:"1px solid #ddd",fontSize:14}}>
                        <option value="Black">Black</option><option value="Brown">Brown</option>
                      </select>
                    </div>
                    <div style={{display:"flex",gap:6,marginTop:8}}>
                      <button onClick={()=>openDetail(p)} style={{flex:1,padding:"10px 8px",borderRadius:20,background:"#000",color:"#fff",border:0,fontWeight:"bold",fontSize:13}}>👁️ View</button>
                      <button onClick={()=>addToCart(p,1)} style={{flex:1,padding:"10px 8px",borderRadius:20,background:"orange",border:0,fontWeight:"bold",fontSize:13}}>Add to Cart</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{textAlign:"center",marginTop:24,paddingBottom:20}}>
            <p style={{fontSize:11,color:"#666"}}>SOSA © 2026 • Made in Nigeria • Pickup: No.1 ODICHE STREET, COKER Aguda, ORILE, LAGOS</p>
            <a href="/admin" style={{fontSize:10,color:"#333",textDecoration:"none"}}>• Owner •</a>
          </div>
        </div>
      )}

      {view==="detail" && selected && (
        <div style={{background:"#fff",color:"#000",borderRadius:12,padding:16}}>
          <div style={{textAlign:"center",margin:"8px 0"}}>
            <div style={{background: (selColor[selected.name]||"Black")==="Brown" ? "#3E2A1A" : "#111", color:"#fff", borderRadius:16, padding:24, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
              <div style={{fontSize:11,letterSpacing:3,color:"orange",fontWeight:"bold"}}>SOSA • {selected.cat.toUpperCase()}</div>
              <div style={{fontSize:22,fontWeight:"bold",margin:"10px 0"}}>{selected.name}</div>
              <div style={{fontSize:12,color:"#aaa"}}>📸 Real photo coming soon</div>
              <div style={{fontSize:12,marginTop:10,background: (selColor[selected.name]||"Black")==="Brown" ? "#8B4513" : "#fff", color: (selColor[selected.name]||"Black")==="Brown" ? "#fff" : "#000", padding:"6px 16px", borderRadius:20, fontWeight:"bold"}}>Colour: {selColor[selected.name]||"Black"} • Size: {selSize[selected.name]||"M"}</div>
            </div>
          </div>
          <h2 style={{margin:"12px 0 0 0"}}>{selected.name}</h2>
          <p style={{fontSize:20,fontWeight:"bold",color:"orange",margin:"6px 0"}}>{selected.price} Pi</p>
          <p style={{fontSize:13}}><b>What you are paying for:</b><br/>{selected.desc}</p>
          <p style={{fontSize:13,background:"#f5f5f5",padding:10,borderRadius:10}}>{selected.detail}<br/><br/>✅ Made in Nigeria<br/>✅ SOSA branded pack<br/>✅ Pickup at No.1 ODICHE STREET, COKER Aguda, ORILE, LAGOS or Delivery<br/>✅ Pay with Pi or Pay at Pickup (Barcode)</p>
          <p style={{fontSize:12,fontWeight:"bold"}}>Pick Colour:</p>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <button onClick={()=>setSelColor({...selColor,[selected.name]:"Black"})} style={{flex:1,padding:12,borderRadius:12,background:(selColor[selected.name]||"Black")==="Black"?"#000":"#fff",color:(selColor[selected.name]||"Black")==="Black"?"#fff":"#000",border:"2px solid #000",fontWeight:"bold"}}>⬛ Black</button>
            <button onClick={()=>setSelColor({...selColor,[selected.name]:"Brown"})} style={{flex:1,padding:12,borderRadius:12,background:(selColor[selected.name]||"Black")==="Brown"?"#8B4513":"#fff",color:(selColor[selected.name]||"Black")==="Brown"?"#fff":"#000",border:"2px solid #8B4513",fontWeight:"bold"}}>🟫 Brown</button>
          </div>
          <p style={{fontSize:12}}>Choose Size:</p>
          <div style={{display:"flex",gap:6}}>
            {["S","M","L","XL","XXL"].map((s:string)=>(
              <button key={s} onClick={()=>setSelSize({...selSize,[selected.name]:s})} style={{flex:1,padding:10,borderRadius:10,background:(selSize[selected.name]||"M")===s?"orange":"#eee",border:0,fontWeight:"bold"}}>{s}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:8,marginTop:12,alignItems:"center"}}>
            <button onClick={()=>setDetailQty(Math.max(1,detailQty-1))} style={{padding:"8px 16px",borderRadius:20,background:"#000",color:"#fff",border:0,fontWeight:"bold",fontSize:18}}>-</button>
            <b>Qty: {detailQty}</b>
            <button onClick={()=>setDetailQty(detailQty+1)} style={{padding:"8px 16px",borderRadius:20,background:"orange",border:0,fontWeight:"bold",fontSize:18}}>+</button>
            <b style={{marginLeft:"auto"}}>Total: {(selected.price*detailQty).toFixed(4)} Pi</b>
          </div>
          <button onClick={()=>{addToCart(selected,detailQty); setView("cart"); window.scrollTo(0,0);}} style={{width:"100%",padding:14,borderRadius:20,background:"orange",border:0,fontWeight:"bold",marginTop:12}}>Add to Cart - {(selected.price*detailQty).toFixed(4)} Pi</button>
          <button onClick={goShop} style={{width:"100%",padding:12,borderRadius:10,background:"#eee",border:0,marginTop:8}}>← Continue Shopping</button>
        </div>
      )}

      {view==="orders" && (
        <div>
          <h2>My Orders</h2>
          {orders.length===0 && <p>No orders yet.</p>}
          {orders.map((o:any,i:number)=>{
            const f = getFlags(o);
            const statusText = f.delivered ? "Delivered" : f.sent ? "Sent" : f.paid ? "Paid" : "Pending - Pay at Pickup";
            return (
              <div key={i} style={{background:"#fff",color:"#000",padding:12,borderRadius:12,marginTop:10}}>
                <b>{o.id}</b><br/>{o.date}<br/>Items: {o.items}<br/>Total: {o.total} Pi<br/>Phone: {fmtPhone(o.phone)}<br/>
                Status: <b style={{color: f.delivered||f.paid ? "#16a34a" : "orange"}}>{statusText}</b><br/>
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

      {view==="cart" && (
        <div style={{background:"#111",padding:12,borderRadius:12}}>
          <h2 style={{marginTop:0}}>Cart ({cartCount})</h2>
          {cart.length===0 && <p>Cart is empty. Go add a product.</p>}
          {cart.map((c:any,i:number)=>(
            <div key={i} style={{background:"#fff",color:"#000",padding:10,borderRadius:10,marginBottom:8}}>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <PhotoBox name={c.name} cat={c.cat || "Heel"} color={c.color} />
                <div style={{flex:1}}>
                  <b>{c.name}</b> - {c.color} / {c.size} - {c.price} Pi x {c.qty||1} = {(Number(c.price)*(c.qty||1)).toFixed(4)} Pi
                </div>
                <button onClick={()=>saveCart(cart.filter((_:any,idx:number)=>idx!==i))} style={{background:"red",color:"#fff",border:0,borderRadius:50,padding:"2px 8px"}}>X</button>
              </div>
              <div style={{display:"flex",gap:8,marginTop:8,alignItems:"center"}}>
                <button onClick={()=>changeQty(c.id,-1)} style={{padding:"6px 14px",borderRadius:20,background:"#000",color:"#fff",border:0,fontWeight:"bold",fontSize:16}}>-</button>
                <b>Qty: {c.qty||1}</b>
                <button onClick={()=>changeQty(c.id,1)} style={{padding:"6px 14px",borderRadius:20,background:"orange",color:"#000",border:0,fontWeight:"bold",fontSize:16}}>+</button>
              </div>
            </div>
          ))}
          <p>Total: {total.toFixed(4)} Pi</p>
          <h3>--- CHECKOUT DETAILS ---</h3>
          <input placeholder="Full Name *" value={custName} onChange={(e)=>setCustName(e.target.value)} style={{width:"100%",padding:12,borderRadius:10,marginBottom:8,border:0,boxSizing:"border-box"}} />
          <input type="tel" inputMode="tel" autoComplete="tel" placeholder="Phone Number / WhatsApp *" value={custPhone} onChange={(e)=>setCustPhone(e.target.value.replace(/[^0-9+]/g, ""))} style={{width:"100%",padding:12,borderRadius:10,marginBottom:8,border:0,boxSizing:"border-box"}} />
          <p style={{fontSize:11,color:"#aaa",marginTop:-4}}>Example: 08176675579 or +2348176675579 — numbers only</p>
          <div style={{background:"#222",padding:10,borderRadius:10,fontSize:12,marginBottom:8}}>🏠 Self Pickup (Free): No. 1, ODICHE STREET, COKER Aguda, ORILE, LAGOS.<br/>🚚 Delivery: 0.0001 Pi (1-2 days Lagos, 4-7 days outside Lagos)</div>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <button onClick={()=>setMethod("delivery")} style={{flex:1,padding:12,borderRadius:20,background:method==="delivery"?"orange":"#333",color:"#fff",border:0,fontWeight:"bold"}}>🚚 Delivery (+0.0001 Pi)</button>
            <button onClick={()=>setMethod("pickup")} style={{flex:1,padding:12,borderRadius:20,background:method==="pickup"?"orange":"#333",color:"#fff",border:0,fontWeight:"bold"}}>🏠 Self Pickup (Free)</button>
          </div>
          <p>Self Pickup Address:</p>
          <input value={method==="pickup"?"No. 1, ODICHE STREET, COKER Aguda, ORILE, LAGOS.":address} onChange={(e)=>setAddress(e.target.value)} disabled={method==="pickup"} style={{width:"100%",padding:12,borderRadius:10,marginBottom:8,boxSizing:"border-box"}} />
          <p>Grand Total (SOSA): {total.toFixed(4)} Pi {method==="delivery"?"+ 0.0001 delivery":"(self pickup free)"}<br/>+ Pi Network Fee: 0.01 Pi (paid to Pi, NOT SOSA)<br/>Wallet will show: {(grandTotal+0.01).toFixed(4)} Pi total</p>
          <button onClick={payWithPi} disabled={paying} style={{width:"100%",padding:14,borderRadius:20,background:"orange",border:0,fontWeight:"bold",marginBottom:8}}>{paying?"Waiting for Wallet approval... DO NOT tap Pay again":`Pay with Pi - ${grandTotal.toFixed(4)} Pi`}</button>
          <button onClick={payWithBarcode} style={{width:"100%",padding:14,borderRadius:20,background:"#fff",color:"#000",border:0,fontWeight:"bold"}}>Pay with Barcode at Pickup — Pay when you come to shop. Show barcode.</button>
          <p style={{fontSize:12,textAlign:"center"}}>Barcode = Reserve now, pay at pickup. No Pi taken now.</p>
          <button onClick={goShop} style={{width:"100%",padding:12,borderRadius:10,background:"#fff",color:"#000",fontWeight:"bold",border:0,marginTop:8}}>← Back to Shop</button>
        </div>
      )}
    </div>
  );
}
