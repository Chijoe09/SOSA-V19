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
function phoneForLink(p: any){
  let digits = String(p || '').replace(/\D/g,'');
  if(digits.startsWith('234') && digits.length===13) return '+' + digits;
  if(digits.startsWith('0') && digits.length===11) return '+234' + digits.slice(1);
  if(digits.length===10) return '+234' + digits;
  return String(p || '');
}

export default function Admin(){
  const [pass,setPass]=useState(""); const [ok,setOk]=useState(false); const [orders,setOrders]=useState<any[]>([]);
  const [name,setName]=useState(""); const [price,setPrice]=useState(""); const [desc,setDesc]=useState("");

  // FIX: Delivered = Paid + Sent + Delivered ALL true, so green STAYS
  const normalize=(o:any)=>{
    if(o.delivered) return { ...o, paid:true, sent:true, delivered:true, tracking:"Delivered" };
    if(o.sent) return { ...o, paid: !!o.paid || o.tracking==="Sent" || o.tracking==="Delivered", sent:true, delivered:false, tracking: o.tracking==="Delivered"?"Delivered":"Sent" };
    if(o.paid!==undefined || o.sent!==undefined || o.delivered!==undefined) return { ...o, paid: !!o.paid, sent: !!o.sent, delivered: !!o.delivered };
    const t = o.tracking || "Paid";
    if(t==="Pending - Pay at Pickup") return { ...o, paid:false, sent:false, delivered:false, tracking:t };
    if(t==="Paid") return { ...o, paid:true, sent:false, delivered:false, tracking:t };
    if(t==="Sent") return { ...o, paid:true, sent:true, delivered:false, tracking:t };
    if(t==="Delivered") return { ...o, paid:true, sent:true, delivered:true, tracking:t };
    return { ...o, paid:true, sent:false, delivered:false, tracking:t };
  };

  const load=()=>{ try{ const raw=JSON.parse(localStorage.getItem("sosa_orders")||"[]"); setOrders(raw.map(normalize)); }catch{ setOrders([]); } };
  useEffect(()=>{ load(); const h=()=>load(); window.addEventListener("storage",h); return ()=>window.removeEventListener("storage",h); },[]);
  const totalPi = orders.reduce((a:any,o:any)=>a+Number(o.total||0),0);

  // FIX: Mark Delivered also marks Paid + Sent, so it STAYS green everywhere
  const setFlag=(id:string, field:string)=>{
    const next=orders.map((o:any)=>{
      if(o.id!==id) return o;
      const updated={...o};
      if(field==="delivered"){ updated.paid=true; updated.sent=true; updated.delivered=true; updated.tracking="Delivered"; }
      else if(field==="sent"){ updated.sent=true; updated.tracking="Sent"; }
      else if(field==="paid"){ updated.paid=true; updated.tracking= updated.delivered?"Delivered": updated.sent?"Sent":"Paid"; }
      return updated;
    });
    setOrders(next); localStorage.setItem("sosa_orders",JSON.stringify(next));
  };

  if(!ok) return (<div style={{padding:20,fontFamily:"sans-serif"}}><a href="/" style={{display:"inline-block",padding:"8px 12px",borderRadius:8,background:"#eee",color:"#000",textDecoration:"none",fontWeight:"bold",marginBottom:12}}>← Back To Shop</a><h1>SOSA Admin</h1><input placeholder="Admin Password" value={pass} onChange={(e)=>setPass(e.target.value)} style={{width:"100%",padding:12,borderRadius:10,border:"1px solid orange"}} /><button onClick={()=>{ if(pass==="sosa5463"){ setOk(true); load(); } else alert("Wrong password"); }} style={{width:"100%",padding:12,marginTop:10,borderRadius:10,background:"#000",color:"#fff",fontWeight:"bold"}}>Enter Admin</button></div>);
  return (<div style={{padding:16,fontFamily:"sans-serif"}}><h1>SOSA Admin - History</h1><a href="/">← Back to Shop</a>
    <div style={{display:"flex",gap:8,margin:"12px 0"}}><div style={{background:"#000",color:"#fff",padding:12,borderRadius:10,flex:1}}><b>Total Records<br/>{orders.length}</b><br/>Orders</div><div style={{background:"orange",padding:12,borderRadius:10,flex:1}}><b>Total Pi<br/>{totalPi.toFixed(4)}</b><br/>Test-Pi Collected</div><div style={{background:"#eee",padding:12,borderRadius:10,flex:1}}><b>Products<br/>0</b><br/>In Admin List</div></div>
    <h3>--- ORDER HISTORY ---</h3>
    {orders.map((o:any,i:number)=>{
      const isPaid = !!o.paid; const isSent = !!o.sent; const isDelivered = !!o.delivered; const isPending = !isPaid;
      const statusText = isDelivered ? "Delivered" : isSent ? "Sent" : isPaid ? "Paid" : "Pending - Pay at Pickup";
      return (<div key={i} style={{border:"1px solid #ddd",padding:12,borderRadius:10,marginBottom:10}}>
        <b>{o.id}</b> - {o.date}<br/>Buyer: @{o.buyer}<br/>Name: {o.name} | Phone: {fmtPhone(o.phone)} <a href={`tel:${phoneForLink(o.phone)}`}>Call</a> • <a href={`https://wa.me/${phoneForLink(o.phone).replace('+','')}`}>WhatsApp</a><br/>Method: {o.method} | Address: {o.address}<br/>Items: {o.items}<br/><b>Total: {o.total} Pi</b> | ⭐ Points: {o.points}<br/>TX: {o.txid}<br/>
        Status: <b style={{color: isDelivered?"#16a34a":isPaid?"#16a34a":"orange"}}>{statusText}</b>
        <div style={{display:"flex",gap:6,marginTop:8}}><span style={{flex:1,textAlign:"center",padding:"6px 2px",borderRadius:20,fontSize:11,fontWeight:"bold",background: isPaid?"#16a34a":"#333",color:"#fff"}}>{isPaid?"✅ ":"⚪ "}Paid</span><span style={{flex:1,textAlign:"center",padding:"6px 2px",borderRadius:20,fontSize:11,fontWeight:"bold",background: isSent?"#16a34a":"#333",color:"#fff"}}>{isSent?"✅ ":"⚪ "}Sent</span><span style={{flex:1,textAlign:"center",padding:"6px 2px",borderRadius:20,fontSize:11,fontWeight:"bold",background: isDelivered?"#16a34a":"#333",color:"#fff"}}>{isDelivered?"✅ ":"⚪ "}Delivered</span></div>
        <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
          {isPending && <button onClick={()=>setFlag(o.id,"paid")} style={{flex:1,padding:10,borderRadius:20,background:"#16a34a",color:"#fff",border:0,fontWeight:"bold"}}>✅ Mark Paid (they paid at shop)</button>}
          <button onClick={()=>setFlag(o.id,"sent")} disabled={isSent} style={{flex:1,padding:10,borderRadius:20,background: isSent?"#16a34a":"#eab308",color:isSent?"#fff":"#000",border:0,fontWeight:"bold"}}>📦 Mark Sent</button>
          <button onClick={()=>setFlag(o.id,"delivered")} disabled={isDelivered} style={{flex:1,padding:10,borderRadius:20,background: isDelivered?"#16a34a":"#000",color:"#fff",border:0,fontWeight:"bold"}}>🏠 Mark Delivered</button>
        </div>
      </div>);
    })}
    <h3>--- ADD PRODUCT ---</h3>
    <input placeholder="Product name" value={name} onChange={(e)=>setName(e.target.value)} style={{width:"100%",padding:12,marginBottom:8,borderRadius:10}} />
    <input placeholder="Price in Pi" value={price} onChange={(e)=>setPrice(e.target.value)} style={{width:"100%",padding:12,marginBottom:8,borderRadius:10}} />
    <input placeholder="Description" value={desc} onChange={(e)=>setDesc(e.target.value)} style={{width:"100%",padding:12,marginBottom:8,borderRadius:10}} />
    <button onClick={()=>alert("Product added (demo)")} style={{width:"100%",padding:12,borderRadius:10,background:"#000",color:"#fff"}}>Add Product</button>
    <button onClick={()=>{ if(confirm("Clear all history?")){ localStorage.removeItem("sosa_orders"); setOrders([]); } }} style={{width:"100%",padding:12,marginTop:8,borderRadius:10,background:"red",color:"#fff"}}>Clear History</button>
  </div>);
}
