"use client";
import { useState, useEffect } from "react";
import AdminAddProducts from "@/components/AdminAddProducts";

type Product = { id: string; name: string; category: string; price: number; oldPrice?: number; rating: number; reviews: number; img: string; desc: string };
type CartItem = Product & { qty: number };
type Order = { id: string; code: string; phone: string; items: CartItem[]; totalPi: number; status: string; date: string };

const initialProducts: Product[] = [
  { id: "1", name: "Luxe Sample Set", category: "Bestseller", price: 25, oldPrice: 40, rating: 4.9, reviews: 214, img: "💄", desc: "5 luxury minis to try before you buy full size." },
  { id: "2", name: "Glow Up Kit", category: "Skincare", price: 30, oldPrice: 45, rating: 4.8, reviews: 186, img: "✨", desc: "Glow serum, cleanser and moisturizer mini kit." },
  { id: "3", name: "Hair Revival Set", category: "Haircare", price: 28, rating: 4.7, reviews: 142, img: "💇‍♀️", desc: "Shampoo, conditioner and hair oil for revival." },
  { id: "4", name: "Perfume Discovery", category: "Fragrance", price: 35, oldPrice: 50, rating: 4.9, reviews: 301, img: "🌸", desc: "6 designer-inspired perfume samples." },
  { id: "5", name: "Skincare Starter", category: "Skincare", price: 22, rating: 4.6, reviews: 98, img: "🧴", desc: "Perfect starter routine for every skin type." },
  { id: "6", name: "Makeup Pro Kit", category: "Makeup", price: 32, oldPrice: 48, rating: 4.8, reviews: 175, img: "💋", desc: "Lip, eye and face minis for a full look." },
  { id: "7", name: "Nail Glam Set", category: "Nails", price: 18, rating: 4.7, reviews: 87, img: "💅", desc: "Polish, care and glam nail essentials." },
  { id: "8", name: "Body Glow Oil", category: "Bodycare", price: 20, rating: 4.8, reviews: 120, img: "🫧", desc: "Lightweight glow oil for soft radiant skin." },
];

const categories = ["All", "Bestseller", "Skincare", "Haircare", "Fragrance", "Makeup", "Nails", "Bodycare"];

export default function Home() {
  const [search, setSearch] = useState("");
  const [catIndex, setCatIndex] = useState(0);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [trackCode, setTrackCode] = useState("");
  const [trackResult, setTrackResult] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [adminOpen, setAdminOpen] = useState(false);
  const [showTrack, setShowTrack] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sosa_orders");
    if (saved) setOrders(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("sosa_orders", JSON.stringify(orders));
  }, [orders]);

  const filtered = products.filter((p) => {
    const cat = categories[catIndex];
    const matchCat = cat === "All" || p.category === cat;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  function addToCart(p: Product) {
    setCart((prev) => {
      const found = prev.find((i) => i.id === p.id);
      if (found) return prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...p, qty: 1 }];
    });
  }

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }

  function updateQty(id: string, delta: number) {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)));
  }

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  function createOrder(payMethod: string) {
    if (cart.length === 0) { alert("Cart is empty"); return null; }
    const code = "SOSA-" + Date.now().toString().slice(-6);
    const o: Order = { id: code, code: code, phone: phone, items: cart, totalPi: cartTotal, status: payMethod + " - Processing", date: new Date().toLocaleString() };
    setOrders((prev) => [o, ...prev]);
    setLastOrder(o);
    setCart([]);
    return o;
  }

  async function payWithPi() {
    try {
      const Pi = (window as any).Pi;
      if (!Pi) { alert("Open this in Pi Browser to pay with Pi"); return; }
      await Pi.init({ version: "2.0" });
      const auth = await Pi.authenticate(["payments", "username"], () => {});
      const payment = await Pi.createPayment({
        amount: cartTotal,
        memo: "SOSA Order",
        metadata: { order: "SOSA" },
      }, {
        onReadyForServerApproval: async (paymentId: string) => { console.log(paymentId); },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => { console.log(paymentId, txid); },
        onCancel: () => alert("Payment cancelled"),
        onError: (e: any) => { alert("Payment error: " + (e.message || "Unknown")); setCheckoutOpen(false); },
      });
      console.log(payment);
      const o = createOrder("Pi Pay Paid");
      if (o) setCheckoutOpen(false);
    } catch (e: any) {
      alert("Payment error: " + (e.message || "Unknown"));
      setCheckoutOpen(false);
    }
  }

  function payWithBarcode() {
    const o = createOrder("Barcode - Pay on Delivery");
    if (o) setCheckoutOpen(false);
  }

  function shareApp() {
    const text = "SOSA - Sophisticated Samples. Made in Nigeria.";
    if (navigator.share) { navigator.share({ title: "SOSA", text, url: "https://sosa-v19.vercel.app" }); } else { alert("Link copied: https://sosa-v19.vercel.app"); }
  }

  function doTrack() {
    const q = trackCode.trim().toLowerCase();
    const found = orders.find((o) => o.code.toLowerCase() === q || o.phone === trackCode.trim());
    if (found) {
      setTrackResult("Order " + found.code + " - " + found.status);
    } else if (lastOrder && (lastOrder.code.toLowerCase() === q || lastOrder.phone === trackCode.trim())) {
      setTrackResult("Order " + lastOrder.code + " - " + lastOrder.status);
    } else {
      setTrackResult(trackCode ? "No order found for " + trackCode : "Enter your order code");
    }
  }

  return (
    <div className="min-h-screen bg-pink-50 text-gray-900">
      <header className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-20">
        <div><h1 className="text-2xl font-bold text-pink-600">SOSA 💄</h1><p className="text-xs">Sophisticated Samples</p></div>
        <div className="flex gap-2">
          <button onClick={() => setShowTrack(!showTrack)} className="bg-gray-100 px-3 py-2 rounded-full text-sm">Track Order</button>
          <button onClick={() => setCartOpen(true)} className="bg-pink-600 text-white px-4 py-2 rounded-full">Cart ({cartCount})</button>
        </div>
      </header>

      {showTrack && (
        <div className="bg-white m-4 p-4 rounded-xl shadow">
          <h2 className="font-bold mb-2">Track Your Order</h2>
          <input value={trackCode} onChange={(e) => setTrackCode(e.target.value)} placeholder="Enter order code or phone" className="border p-2 rounded w-full mb-2" />
          <button onClick={doTrack} className="bg-pink-600 text-white px-4 py-2 rounded-full w-full">Track</button>
          {trackResult && <p className="mt-2 text-sm">{trackResult}</p>}
        </div>
      )}

      <div className="p-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search samples..." className="border p-3 rounded-full w-full mb-4 bg-white" />
        <div className="flex gap-2 overflow-x-auto mb-4">
          {categories.map((c, i) => (
            <button key={c} onClick={() => setCatIndex(i)} className={catIndex === i ? "bg-pink-600 text-white px-4 py-2 rounded-full whitespace-nowrap" : "bg-white px-4 py-2 rounded-full whitespace-nowrap"}>{c}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white rounded-xl p-3 shadow">
              <div className="text-4xl text-center">{p.img}</div>
              <h3 className="font-bold mt-2">{p.name}</h3>
              <p className="text-xs text-gray-500">{p.desc}</p>
              <p className="text-sm mt-1">⭐ {p.rating} ({p.reviews})</p>
              <p className="font-bold mt-1">${p.price} {p.oldPrice && <span className="line-through text-gray-400 text-sm">${p.oldPrice}</span>}</p>
              <button onClick={() => addToCart(p)} className="bg-pink-600 text-white w-full py-2 rounded-full mt-2">Add to Cart</button>
            </div>
          ))}
        </div>
      </div>

      {cartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-30">
          <div className="bg-white w-full max-w-md p-4 overflow-y-auto">
            <div className="flex justify-between"><h2 className="font-bold text-xl">Your Cart</h2><button onClick={() => setCartOpen(false)}>✕</button></div>
            {cart.length === 0 && <p className="mt-4">Cart is empty</p>}
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b py-3">
                <div><p className="font-bold">{item.name}</p><p>${item.price} x {item.qty}</p></div>
                <div className="flex gap-2 items-center">
                  <button onClick={() => updateQty(item.id, -1)} className="bg-gray-100 px-2 rounded">-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="bg-gray-100 px-2 rounded">+</button>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500">Remove</button>
                </div>
              </div>
            ))}
            {cart.length > 0 && (
              <div className="mt-4">
                <p className="font-bold">Total: ${cartTotal}</p>
                <button onClick={() => { setCartOpen(false); setCheckoutOpen(true); }} className="bg-pink-600 text-white w-full py-3 rounded-full mt-2">Checkout</button>
              </div>
            )}
          </div>
        </div>
      )}

      {checkoutOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-xl p-4 w-full max-w-md">
            <div className="flex justify-between"><h2 className="font-bold text-xl">Checkout</h2><button onClick={() => setCheckoutOpen(false)}>✕</button></div>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="border p-2 rounded w-full mt-3" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="border p-2 rounded w-full mt-2" />
            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Delivery Address" className="border p-2 rounded w-full mt-2" />
            <p className="font-bold mt-3">Total: ${cartTotal}</p>
            <button onClick={payWithPi} className="bg-purple-600 text-white w-full py-3 rounded-full mt-3">Pay with Pi 🟣</button>
            <button onClick={payWithBarcode} className="bg-gray-900 text-white w-full py-3 rounded-full mt-2">Pay with Barcode / Pay on Delivery</button>
            {lastOrder && <p className="text-sm mt-2">Last Order: {lastOrder.code} - {lastOrder.status}</p>}
          </div>
        </div>
      )}

      <div className="p-4 flex gap-2">
        <button onClick={shareApp} className="bg-white border px-4 py-2 rounded-full flex-1">Share App</button>
        <button onClick={() => setAdminOpen(true)} className="bg-white border px-4 py-2 rounded-full flex-1">Admin</button>
      </div>

      {adminOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-xl p-4 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between"><h2 className="font-bold">Admin</h2><button onClick={() => setAdminOpen(false)}>✕</button></div>
            <AdminAddProducts />
            <div className="mt-4"><h3 className="font-bold">Orders ({orders.length})</h3>{orders.map((o) => (<p key={o.id} className="text-sm border-b py-1">{o.code} - {o.status} - ${o.totalPi}</p>))}</div>
          </div>
        </div>
      )}

      <footer className="text-center p-6 text-sm text-gray-500">SOSA - Sophisticated Samples • Made in Nigeria 🇳🇬</footer>
    </div>
  );
}
