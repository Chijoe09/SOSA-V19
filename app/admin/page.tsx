"use client";
import { useEffect, useState } from "react";
export default function Admin(){
  const [pass,setPass]=useState(""); const [ok,setOk]=useState(false); const [orders,setOrders]=useState<any[]>([]);
  const [name,setName]=useState(""); const [price,setPrice]=useState(""); const [desc,setDesc]=useState("");
  const load=()=>{ try{ setOrders(JSON.parse(localStorage.getItem("sosa_orders")||"[]")); }catch{ setOrders([]); } };
  useEffect(()=>{ load(); },[]);
  const totalPi = orders.reduce((a:any,o:any)=>a+Number(o.total||0),0);
  const setTracking=(id:string, tracking:string)=>{ const next=orders.map((o:any)=>o.id===id?{...o,tracking}:o); setOrders(next); localStorage.setItem("sosa_orders",JSON.stringify(next)); };
  if(!ok) return (<div style={{padding:20,fontFamily:"sans-serif"}}><h1>SOSA Admin</h1><input placeholder="Admin Password" value={pass} onChange={(e)=>setPass(e.target.value)} style={{width:"100%",padding:12,borderRadius:10,border:"1px solid orange"}} /><button onClick={()=>{ if(pass==="sosa123"){ setOk(true); load(); } else alert("Wrong password"); }} style={{width:"100%",padding:12,marginTop:10,borderRadius:10,background:"#000",color:"#fff",fontWeight:"bold"}}>Enter Admin</button></div>);
  return (<div style={{padding:16,fontFamily:"sans-serif"}}><h1>SOSA Admin - History</h1><a href="/">← Back to Shop</a>
    <div style={{display:"flex",gap:8,margin:"12px 0"}}><div style={{background:"#000",color:"#fff",padding:12,borderRadius:10,flex:1}}><b>Total Records<br/>{orders.length}</b><br/>Orders</div><div style={{background:"orange",padding:12,borderRadius:10,flex:1}}><b>Total Pi<br/>{totalPi.toFixed(4)}</b><br/>Test-Pi Collected</div><div style={{background:"#eee",padding:12,borderRadius:10,flex:1}}><b>Products<br/>0</b><br/>In Admin List</div></div>
    <h3>--- ORDER HISTORY ---</h3>
    {orders.map((o:any,i:number)=>{
      const isPaid = o.tracking==="Paid"||o.tracking==="Sent"||o.tracking==="Delivered"; const isSent = o.tracking==="Sent"||o.tracking==="Delivered"; const isDelivered = o.tracking==="Delivered"; const isPending = o.tracking==="Pending - Pay at Pickup";
      return (<div key={i} style={{border:"1px solid #ddd",padding:12,borderRadius:10,marginBottom:10}}>
        <b>{o.id}</b> - {o.date}<br/>Buyer: @{o.buyer}<br/>Name: {o.name} | Phone: {o.phone}<br/>Method: {o.method} | Address: {o.address}<br/>Items: {o.items}<br/><b>Total: {o.total} Pi</b> | ⭐ Points: {o.points}<br/>TX: {o.txid}<br/>
        Status: <b style={{color: isDelivered?"#16a34a":isPaid?"#16a34a":"orange"}}>{o.tracking||"Paid"}</b>
        <div style={{display:"flex",gap:6,marginTop:8}}><span style={{flex:1,textAlign:"center",padding:"6px 2px",borderRadius:20,fontSize:11,fontWeight:"bold",background: isPaid?"#16a34a":"#333",color:"#fff"}}>{isPaid?"✅ ":"⚪ "}Paid</span><span style={{flex:1,textAlign:"center",padding:"6px 2px",borderRadius:20,fontSize:11,fontWeight:"bold",background: isSent?"#16a34a":"#333",color:"#fff"}}>{isSent?"✅ ":"⚪ "}Sent</span><span style={{flex:1,textAlign:"center",padding:"6px 2px",borderRadius:20,fontSize:11,fontWeight:"bold",background: isDelivered?"#16a34a":"#333",color:"#fff"}}>{isDelivered?"✅ ":"⚪ "}Delivered</span></div>
        <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
          {isPending && <button onClick={()=>setTracking(o.id,"Paid")} style={{flex:1,padding:10,borderRadius:20,background:"#16a34a",color:"#fff",border:0,fontWeight:"bold"}}>✅ Mark Paid (they paid at shop)</button>}
          <button onClick={()=>setTracking(o.id,"Sent")} disabled={isSent} style={{flex:1,padding:10,borderRadius:20,background: isSent?"#16a34a":"#eab308",color:isSent?"#fff":"#000",border:0,fontWeight:"bold"}}>📦 Mark Sent</button>
          <button onClick={()=>setTracking(o.id,"Delivered")} disabled={isDelivered} style={{flex:1,padding:10,borderRadius:20,background: isDelivered?"#16a34a":"#000",color:"#fff",border:0,fontWeight:"bold"}}>🏠 Mark Delivered</button>
        </div>
        {isPending && <p style={{fontSize:12,color:"orange"}}>⚠️ Barcode order — NOT paid yet. Tap Mark Paid only after customer pays at pickup.</p>}
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
