"use client";
import { useEffect, useState } from "react";
import "@/types/pi";
import { supabase } from "@/lib/supabase";
import { cartTotal, DELIVERY_FEE } from "@/lib/products";
import type { CartLine, DeliveryType, OrderRow } from "@/lib/types";

export default function DevCheckout({ lines, onDone }: { lines: CartLine[]; onDone?: () => void }) {
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("pickup");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [msg, setMsg] = useState("");
  const isDelivery = deliveryType === "pickup" ? false : true;
  const total = cartTotal(lines, isDelivery);

  useEffect(() => { window.Pi?.init({ version: "2.0", sandbox: true }); }, []);

  const pay = async () => {
    if (!name.trim() || !phone.trim() || (isDelivery && !address.trim())) { setMsg("Please fill all required details"); return; }
    if (!window.Pi) { setMsg("Open in Pi Browser to pay"); return; }
    try {
      await window.Pi.authenticate(["username", "payments"], (payment: any) => {
        fetch("/api/pi/incomplete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId: payment.identifier, txid: payment.transaction?.txid })
        });
      });
      const orderId = Date.now().toString();
      const order: OrderRow = {
        paymentId: "", txid: "", customerName: name.trim(), phone: phone.trim(),
        address: isDelivery ? address.trim() : "", deliveryType,
        productIds: lines.map((l) => ({ id: l.product.id, qty: l.qty })), totalPi: total, status: "paid",
      };
      window.Pi.createPayment(
        { amount: total, memo: "SOSA-" + orderId.slice(-6), metadata: { orderId, customerName: name.trim() } },
        {
          onReadyForServerApproval: (paymentId) => {
            fetch("/api/pi/approve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paymentId }) });
          },
          onReadyForServerCompletion: async (paymentId, txid) => {
            if (supabase) await supabase.from("orders").insert({ ...order, paymentId, txid });
            await fetch("/api/pi/complete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paymentId, txid }) });
            setMsg("Payment complete. Thank you!");
            onDone?.();
          },
          onCancel: () => setMsg("Payment cancelled"),
          onError: (e) => setMsg("Payment error: " + e.message),
          onIncompletePaymentFound: (payment: any) => {
            fetch("/api/pi/incomplete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId: payment.identifier, txid: payment.transaction?.txid })
            });
          },
        }
      );
    } catch (e) { setMsg(e instanceof Error ? e.message : "Payment failed"); }
  };

  const input = "w-full rounded-xl border border-black/20 bg-transparent p-3 dark:border-white/20";
  return (
    <div className="mx-auto max-w-md space-y-3 p-4">
      <div className="flex gap-2">
        {(["pickup", "delivery"] as DeliveryType[]).map((t) => (
          <button key={t} onClick={() => setDeliveryType(t)}
            className={`flex-1 rounded-xl border p-2 ${deliveryType === t ? "bg-black text-white dark:bg-white dark:text-black" : ""}`}>
            {t === "pickup" ? "Self Pickup" : "Delivery"}
          </button>
        ))}
      </div>
      <p className="text-sm">
        {isDelivery ? `Delivery: ${DELIVERY_FEE} Pi (1-2 days Lagos, 4-7 outside)` : "Pickup: No.1, ODICHE STREET, COKER Aguda, ORILE, LAGOS."}
      </p>
      <input className={input} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input className={input} type="tel" inputMode="numeric" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
      {isDelivery && <input className={input} placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />}
      <button onClick={pay} disabled={lines.length === 0} className="w-full rounded-xl bg-black py-3 text-white disabled:opacity-40 dark:bg-white dark:text-black">
        Pay {total} Pi
      </button>
      {msg && <p className="text-sm">{msg}</p>}
    </div>
  );
}
