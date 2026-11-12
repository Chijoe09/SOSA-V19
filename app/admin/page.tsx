"use client";
import { useEffect, useState } from "react";

export default function Admin() {
  const [pass, setPass] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [pName, setPName] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pDesc, setPDesc] = useState("");

  useEffect(() => {
    setOrders(JSON.parse(localStorage.getItem("sosa_orders") || "[]"));
    setProducts(JSON.parse(localStorage.getItem("sosa_products") || "[]"));
  }, []);

  if (!unlocked) return (
    <div style={{ padding: 20 }}>
      <h1>SOSA Admin</h1>
      <input type="password" placeholder="Admin Password" value={pass} onChange={e => setPass(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, marginBottom: 10 }} />
      <button onClick={() => { if (pass) setUnlocked(true); }} style={{ width: "100%", padding: 14, background: "#000", color: "#fff", borderRadius: 10 }}>Enter Admin</button>
    </div>
  );

  const totalPi = orders.reduce((a, o) => a + Number(o.total || 0), 0);

  return (
    <div style={{ padding: 16, background: "#fff", minHeight: "100vh" }}>
      <h1>SOSA Admin - History</h1>
      <a href="/">← Back to Shop</a>

      <div style={{ display: "flex", gap: 10, margin: "16px 0" }}>
        <div style={{ flex: 1, background: "#000", color: "#fff", padding: 14, borderRadius: 12 }}><b>Total Records</b><h2 style={{ margin: 0 }}>{orders.length}</h2><small>Orders</small></div>
        <div style={{ flex: 1, background: "orange", padding: 14, borderRadius: 12 }}><b>Total Pi</b><h2 style={{ margin: 0 }}>{totalPi.toFixed(4)}</h2><small>Test-Pi Collected</small></div>
        <div style={{ flex: 1, background: "#eee", padding: 14, borderRadius: 12 }}><b>Products</b><h2 style={{ margin: 0 }}>{products.length}</h2><small>In Admin List</small></div>
      </div>

      <h2>--- ORDER HISTORY ---</h2>
      {orders.length === 0 && <p>No orders yet on this phone. Orders are remembered in this browser's Last Memory.</p>}
      {orders.map((o, i) => (
        <div key={i} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 12, marginBottom: 10 }}>
          <b>{o.id}</b> - {o.date}<br/>
          Buyer: @{o.buyer}<br/>
          Name: {o.name} | Phone: {o.phone}<br/>
          Method: {o.method} | Address: {o.address}<br/>
          Items: {o.items}<br/>
          <b>Total: {o.total} Pi</b><br/>
          TX: {o.txid || "Barcode - pay at pickup"}
        </div>
      ))}

      <h2 style={{ marginTop: 24 }}>--- ADD PRODUCT ---</h2>
      <input placeholder="Product name" value={pName} onChange={e => setPName(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, marginBottom: 8 }} />
      <input placeholder="Price in Pi" value={pPrice} onChange={e => setPPrice(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, marginBottom: 8 }} />
      <input placeholder="Description" value={pDesc} onChange={e => setPDesc(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, marginBottom: 8 }} />
      <button onClick={() => {
        if (!pName || !pPrice) return alert("Enter name + price");
        const np = [...products, { name: pName, price: Number(pPrice), cat: pDesc || "General" }];
        setProducts(np); localStorage.setItem("sosa_products", JSON.stringify(np));
        setPName(""); setPPrice(""); setPDesc(""); alert("Product added");
      }} style={{ width: "100%", padding: 14, background: "#000", color: "#fff", borderRadius: 10 }}>Add Product</button>

      {products.map((p, i) => <p key={i} style={{ border: "1px solid #ddd", padding: 10, borderRadius: 10 }}>{p.name} - {p.price} Pi</p>)}

      <button onClick={() => { if (confirm("Clear ALL history?")) { localStorage.removeItem("sosa_orders"); setOrders([]); } }} style={{ width: "100%", padding: 12, background: "red", color: "#fff", borderRadius: 10, marginTop: 20, border: 0 }}>Clear History</button>
    </div>
  );
}
