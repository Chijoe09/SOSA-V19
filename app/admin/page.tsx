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
function phoneForLink(p: any){
  let digits = String(p || '').replace(/\D/g,'');
  if(digits.startsWith('234') && digits.length===13) return '+' + digits;
  if(digits.startsWith('0') && digits.length===11) return '+234' + digits.slice(1);
  if(digits.length===10) return '+234' + digits;
  return String(p || '');
}

export default function Admin(){
  const [pass,setPass]=useState("");
  const [ok,setOk]=useState(false);
  const [orders,setOrders]=useState<any[]>([]);
  const [name,setName]=useState("");
  const [price,setPrice]=useState("");
  const [desc,setDesc]=useState("");

  const normalize=(o:any)=>{
    if(o.delivered) return { ...o, paid:true, sent:true, delivered:true, tracking:"Delivered" };
    if(o.sent) return { ...o, paid: !!o.paid || o.tracking==="Sent" || o.tracking==="Delivered", sent:true, delivered:false, tracking:"Sent" };
    if(o.paid!==undefined || o.sent!==undefined || o.delivered!==undefined){
      return { ...o, paid: !!o.paid, sent: !!o.sent, delivered: !!o.delivered };
    }
    const t = o.tracking || "Paid";
    if(t==="Pending - Pay at Pickup") return { ...o, paid:false, sent:false, delivered:false, tracking:t };
    if(t==="Paid") return { ...o, paid:true, sent:false, delivered:false, tracking:t };
    if(t==="Sent") return { ...o, paid:true, sent:true, delivered:false, tracking:t };
    if(t==="Delivered") return { ...o, paid:true, sent:true, delivered:true, tracking:t };
    return { ...o, paid:true, sent:false, delivered:false, tracking:t };
  };

  const load=()=>{
    try{
      const raw=JSON.parse(localStorage.getItem("sosa_orders")||"[]");
      setOrders(raw.map(normalize));
    }catch{ setOrders([]); }
  };

  useEffect(()=>{
    load();
    const h=()=>load();
    window.addEventListener("storage",h);
    return ()=>window.removeEventListener("storage",h);
  },[]);

  const totalPi = orders.reduce((a:any,o:any)=>a+Number(o.total||0),0);

  const setFlag=(id:string, field:string)=>{
    const next=orders.map((o:any)=>{
      if(o.id!==id) return o;
      const updated={...o};
      if(field==="delivered"){ updated.paid=true; updated.sent=true; updated.delivered=true; updated.tracking="Delivered"; }
      else if(field==="sent"){ updated.sent=true; updated.tracking="Sent"; }
      else if(field==="paid"){ updated.paid=true; updated.tracking= updated.delivered?"Delivered": updated.sent?"Sent":"Paid"; }
      return updated;
    });
    setOrders(next);
    localStorage.setItem("sosa_orders",JSON.stringify(next));
  };

  if(!ok) return (
    <div style={{padding:20,fontFamily:"sans-serif",background:"#fff",minHeight:"100vh"}}>
      <a href="/" style={{display:"inline-block",padding:"8px 12px",borderRadius:8,background:"#eee",color:"#000",textDecoration:"none",fontWeight:"bold",marginBottom:12}}>← Back To Shop</a>
      <h1 style={{margin:"8px 0"}}>SOSA Admin</h1>
      <input
        type="password"
        placeholder="Admin Password"
        value={pass}
        onChange={(e)=>setPass(e.target.value)}
        style={{width:"100%",padding:12,borderRadius:10,border:"1px solid orange",boxSizing:"border-box"}}
      />
      <button onClick={()=>{ if(pass==="sosa5463"){ setOk(true); load(); } else alert("Wrong password"); }} style={{width:"100%",padding:12,marginTop:10,borderRadius:10,background:"#000",color:"#fff",fontWeight:"bold",border:0}}>Enter Admin</button>
      <p style={{fontSize:12,color:"#888",marginTop:8}}>Password is hidden as •••• for security.</p>
    </div>
  );

  return (
    <div style={{padding:16,fontFamily:"sans-serif",background:"#f5f5f5",minHeight:"100vh",boxSizing:"border-box"}}>
      <a href="/" style={{display:"inline-block",padding:"8px 12px",borderRadius:8,background:"#fff",color:"#000",textDecoration:"none",fontWeight:"bold",marginBottom:12}}>← Back to Shop</a>
      <h1 style={{margin:"0 0 12px 0"}}>SOSA Admin - History</h1>

      {/* FIX: Stacked, not squeezed side-by-side - no overlap on phone */}
      <div style={{background:"#000",color:"#fff",padding:14,borderRadius:12,marginBottom:8}}>
        <div style={{fontSize:12,color:"#aaa"}}>Total Records</div>
        <div style={{fontSize:22,fontWeight:"bold"}}>{orders.length} Orders</div>
      </div>
      <div style={{background:"orange",padding:14,borderRadius:12,marginBottom:8}}>
        <div style={{fontSize:12}}>Total Pi Collected</div>
        <div style={{fontSize:22,fontWeight:"bold"}}>{totalPi.toFixed(4)} Pi</div>
      </div>
      <div style={{background:"#fff",padding:14,borderRadius:12,marginBottom:16,border:"1px solid #ddd"}}>
        <div style={{fontSize:12,color:"#888"}}>Products in Admin List</div>
        <div style={{fontSize:22,fontWeight:"bold"}}>0</div>
      </div>

      <h3 style={{margin:"16px 0 8px 0"}}>--- ORDER HISTORY ---</h3>
      {orders.length===0 && <p>No orders yet.</p>}

      {orders.map((o:any,i:number)=>{
        const isPaid = !!o.paid;
        const isSent = !!o.sent;
        const isDelivered = !!o.delivered;
        const isPending = !isPaid;
        const statusText = isDelivered ? "Delivered" : isSent ? "Sent" : isPaid ? "Paid" : "Pending - Pay at Pickup";
        return (
          <div key={i} style={{background:"#fff",padding:14,borderRadius:12,marginBottom:14,border:"1px solid #ddd",display:"block"}}>
            <div style={{fontWeight:"bold",fontSize:14,marginBottom:6,wordBreak:"break-all"}}>{o.id}</div>
            <div style={{fontSize:13,lineHeight:1.6,wordBreak:"break-word"}}>
              <div>Date: {o.date}</div>
              <div>Buyer: @{o.buyer}</div>
              <div>Name: {o.name}</div>
              <div>Phone: {fmtPhone(o.phone)} <a href={`tel:${phoneForLink(o.phone)}`}>Call</a> • <a href={`https://wa.me/${phoneForLink(o.phone).replace('+','')}`}>WhatsApp</a></div>
              <div>Method: {o.method}</div>
              <div>Address: {o.address}</div>
              <div>Items: {o.items}</div>
              <div><b>Total: {o.total} Pi</b> | ⭐ Points: {o.points}</div>
              <div>TX: {o.txid}</div>
              <div>Status: <b style={{color: isDelivered?"#16a34a":isPaid?"#16a34a":"orange"}}>{statusText}</b></div>
            </div>

            {/* Status pills - own line, no overlap */}
            <div style={{display:"flex",gap:6,marginTop:10}}>
              <span style={{flex:1,textAlign:"center",padding:"8px 2px",borderRadius:20,fontSize:12,fontWeight:"bold",background: isPaid?"#16a34a":"#333",color:"#fff"}}>{isPaid?"✅ ":"⚪ "}Paid</span>
              <span style={{flex:1,textAlign:"center",padding:"8px 2px",borderRadius:20,fontSize:12,fontWeight:"bold",background: isSent?"#16a34a":"#333",color:"#fff"}}>{isSent?"✅ ":"⚪ "}Sent</span>
              <span style={{flex:1,textAlign:"center",padding:"8px 2px",borderRadius:20,fontSize:12,fontWeight:"bold",background: isDelivered?"#16a34a":"#333",color:"#fff"}}>{isDelivered?"✅ ":"⚪ "}Delivered</span>
            </div>

            {/* Buttons - own lines, stacked, no overlap */}
            <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:6}}>
              {isPending && <button onClick={()=>setFlag(o.id,"paid")} style={{width:"100%",padding:11,borderRadius:20,background:"#16a34a",color:"#fff",border:0,fontWeight:"bold"}}>✅ Mark Paid (they paid at shop)</button>}
              <button onClick={()=>setFlag(o.id,"sent")} disabled={isSent} style={{width:"100%",padding:11,borderRadius:20,background: isSent?"#16a34a":"#eab308",color:isSent?"#fff":"#000",border:0,fontWeight:"bold"}}>📦 Mark Sent</button>
              <button onClick={()=>setFlag(o.id,"delivered")} disabled={isDelivered} style={{width:"100%",padding:11,borderRadius:20,background: isDelivered?"#16a34a":"#000",color:"#fff",border:0,fontWeight:"bold"}}>🏠 Mark Delivered</button>
            </div>
          </div>
        );
      })}

      <h3 style={{margin:"20px 0 8px 0"}}>--- ADD PRODUCT ---</h3>
      <div style={{background:"#fff",padding:14,borderRadius:12,border:"1px solid #ddd"}}>
        <input placeholder="Product name" value={name} onChange={(e)=>setName(e.target.value)} style={{width:"100%",padding:12,marginBottom:8,borderRadius:10,border:"1px solid #ddd",boxSizing:"border-box"}} />
        <input placeholder="Price in Pi" value={price} onChange={(e)=>setPrice(e.target.value)} style={{width:"100%",padding:12,marginBottom:8,borderRadius:10,border:"1px solid #ddd",boxSizing:"border-box"}} />
        <input placeholder="Description" value={desc} onChange={(e)=>setDesc(e.target.value)} style={{width:"100%",padding:12,marginBottom:8,borderRadius:10,border:"1px solid #ddd",boxSizing:"border-box"}} />
        <button onClick={()=>alert("Product added (demo)")} style={{width:"100%",padding:12,borderRadius:10,background:"#000",color:"#fff",border:0}}>Add Product</button>
        <button onClick={()=>{ if(confirm("Clear all history?")){ localStorage.removeItem("sosa_orders"); setOrders([]); } }} style={{width:"100%",padding:12,marginTop:8,borderRadius:10,background:"red",color:"#fff",border:0}}>Clear History</button>
      </div>
    </div>
  );
}
