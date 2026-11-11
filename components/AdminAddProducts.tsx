"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CATEGORIES = [
  "Male Native Wears",
  "Female Native Wears",
  "Handkerchiefs",
  "Accessories",
  "Others",
];

export default function AdminAddProduct({ onSaved }: { onSaved?: () => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("1");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function handlePickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setMsg("Uploading photo...");
    setUploading(true);

    const fileName = `${Date.now()}-${f.name.replace(/\s/g, "-")}`;
    const { error: uploadError } = await supabase.storage
      .from("sosa-products")
      .upload(fileName, f);

    if (uploadError) {
      setMsg("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("sosa-products")
      .getPublicUrl(fileName);

    setImageUrl(data.publicUrl);
    setMsg("Photo uploaded ✓ - image_url filled automatically");
    setUploading(false);
  }

  async function handleSave() {
    if (!name || !price) return setMsg("Please enter Name and Price");
    if (!imageUrl) return setMsg("Please pick a photo first - wait for upload ✓");
    setSaving(true);
    setMsg("Saving...");

    const { error } = await supabase.from("products").insert([
      {
        name,
        price: parseFloat(price),
        category,
        description,
        stock: parseInt(stock) || 1,
        image_url: imageUrl,
        is_visible: true,
      },
    ]);

    if (error) {
      setMsg("Save failed: " + error.message);
      setSaving(false);
      return;
    }

    setMsg("Saved ✓ Product is now live!");
    setName(""); setPrice(""); setDescription(""); setStock("1");
    setFile(null); setPreview(""); setImageUrl("");
    setSaving(false);
    onSaved?.();
  }

  return (
    <div style={{ border: "1px solid #333", padding: 16, borderRadius: 12, background: "#111", color: "#fff" }}>
      <h3>+ Add Product - Easy Admin v19</h3>

      <label>Name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Men Hand Bags" style={{ width: "100%", padding: 10, marginBottom: 10 }} />

      <label>Price (Pi)</label>
      <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 5" inputMode="decimal" style={{ width: "100%", padding: 10, marginBottom: 10 }} />

      <label>Category</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: "100%", padding: 10, marginBottom: 10 }}>
        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
      </select>

      <label>Description</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description..." style={{ width: "100%", padding: 10, marginBottom: 10 }} />

      <label>Stock</label>
      <input value={stock} onChange={(e) => setStock(e.target.value)} inputMode="numeric" style={{ width: "100%", padding: 10, marginBottom: 10 }} />

      <label>Photo</label>
      <input type="file" accept="image/*" onChange={handlePickPhoto} style={{ width: "100%", marginBottom: 10 }} />
      {preview && <img src={preview} alt="preview" style={{ width: "100%", borderRadius: 8, marginBottom: 10 }} />}
      {imageUrl && <p style={{ fontSize: 12, wordBreak: "break-all" }}>image_url: {imageUrl}</p>}

      <button onClick={handleSave} disabled={uploading || saving} style={{ width: "100%", padding: 12, background: "#FF3B00", color: "#fff", border: "none", borderRadius: 8, fontWeight: "bold" }}>
        {saving ? "Saving..." : uploading ? "Uploading Photo..." : "Save Product"}
      </button>
      {msg && <p>{msg}</p>}
    </div>
  );
}
