"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
export default function AdminPage() {
  const [pass, setPass] = useState("");
  const [ok, setOk] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");
  async function load() {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (data) setProducts(data);
  }
  useEffect(() => { if (ok) load(); }, [ok]);
  async function addProduct() {
    if (!name || !price) return setMsg("Name + Price required");
    setMsg("Uploading...");
    let image_url = "";
    if (file) {
      const fname = Date.now() + "-" + file.name.replace(/[^a-zA-Z0-9.-]/g, "");
      const { error } = await supabase.storage.from("sosa-products").upload(fname, file);
      if (error) return setMsg("Upload failed: " + error.message);
      const { data } = supabase.storage.from("sosa-products").getPublicUrl(fname);
      image_url = data.publicUrl;
    }
    const { error } = await supabase.from("products").insert([{ name, price_pi: parseFloat(price), description: desc, image_url }]);
    if (error) return setMsg("Save failed: " + error.message);
    setMsg("✅ Product added!");
    setName(""); setPrice(""); setDesc(""); setFile(null);
    load();
  }
  if (!ok) return (
  <div style={{padding: 20, maxWidth: 400, margin: '40px auto'}}>
    <h1 style={{fontSize: 28, fontWeight: 'bold'}}>sossa Admin</h1>
    <form onSubmit={(e)=>{e.preventDefault(); if(pass) setOktrue);}}>
      <input
        type="password"
        autoFocus
        value={pass}
        onChange={(e)=>setPass(e.target.value)}
        placeholder="Admin Password"
        style={{width: '100%', padding: 16, fontSize: 18, border: '2px solid black', borderRadius: 8, marginTop: 16, marginBottom: 12}}
      />
      <button type="submit" style={{width: '100%', padding: 16, fontSize: 18, background: 'black', color: 'white', borderRadius: 8}}>
        Enter Admin
      </button>
    </form>
  </div>
);
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Product Name" className="w-full p-3 border rounded mb-2 text-black" />
      <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price in Pi e.g 2.5" type="number" step="0.01" className="w-full p-3 border rounded mb-2 text-black" />
      <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" className="w-full p-3 border rounded mb-2 text-black" />
      <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="mb-3" />
      <button onClick={addProduct} className="w-full bg-black text-white p-3 rounded font-bold">Add Product</button>
      {msg && <p className="mt-2 text-sm">{msg}</p>}
      <h2 className="text-xl font-bold mt-8 mb-2">Products ({products.length})</h2>
      {products.map(p => (
        <div key={p.id} className="flex justify-between items-center border p-2 rounded mb-2">
          <span>{p.name} - {p.price_pi} Pi</span>
          <button onClick={async () => { await supabase.from("products").delete().eq("id", p.id); load(); }} className="text-red-500 text-sm">Delete</button>
        </div>
         ))} 
    </div>
  );
}
