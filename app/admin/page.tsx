"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPage() {
  const [ok, setOk] = useState(false);
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState<any>(null);
  const [msg, setMsg] = useState("");
  const [products, setProducts] = useState<any[]>([]);

  async function load() {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (data) setProducts(data);
  }

  useEffect(() => { if (ok) load(); }, [ok]);

  async function addProduct() {
    if (!name || !price) return setMsg("Enter name and price");
    setMsg("Uploading...");
    let image_url = "";
    if (file) {
      const fname = Date.now() + "-" + file.name.replace(/\s/g, "-");
      const { error: uploadError } = await supabase.storage.from("sosa-products").upload(fname, file);
      if (uploadError) return setMsg("Upload failed: " + uploadError.message);
      const { data } = supabase.storage.from("sosa-products").getPublicUrl(fname);
      image_url = data.publicUrl;
    }
    const { error: saveError } = await supabase.from("products").insert([{ name, price_pi: parseFloat(price), description: desc, image_url }]);
    if (saveError) return setMsg("Save failed: " + saveError.message);
    setMsg("Product added!");
    setName(""); setPrice(""); setDesc(""); setFile(null);
    load();
  }

  if (!ok) return (
    <div style={{ padding: 20, maxWidth: 400, margin: "40px auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold" }}>SOSA Admin</h1>
      <form onSubmit={(e) => { e.preventDefault(); if (pass) setOk(true); }}>
        <input type="password" autoFocus value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Admin Password" style={{ width: "100%", padding: 16, fontSize: 18, border: "2px solid black", borderRadius: 8 }} />
        <button type="submit" style={{ width: "100%", padding: 16, marginTop: 12, background: "black", color: "white", borderRadius: 8 }}>Enter Admin</button>
      </form>
    </div>
  );

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1>Add Product</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" style={{ width: "100%", padding: 12, marginBottom: 12 }} />
      <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price in Pi" style={{ width: "100%", padding: 12, marginBottom: 12 }} />
      <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" style={{ width: "100%", padding: 12, marginBottom: 12 }} />
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} style={{ marginBottom: 12 }} />
      <button onClick={addProduct} style={{ width: "100%", padding: 16, background: "black", color: "white", borderRadius: 8 }}>Add Product</button>
      <p>{msg}</p>
      {products.map((p: any) => (
        <div key={p.id} style={{ border: "1px solid #ddd", padding: 12, marginTop: 12, borderRadius: 8 }}>
          <b>{p.name}</b> - {p.price_pi} Pi
        </div>
      ))}
    </div>
  );
}
