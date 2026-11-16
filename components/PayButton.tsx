"use client";
import { useEffect, useState } from "react";

declare global {
  interface Window { Pi: any }
}

const post = (url: string, body: object) =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export default function PayButton({ amount, memo }: { amount: number; memo: string }) {
  const [status, setStatus] = useState("idle");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!window.Pi) return setStatus("Pi SDK not loaded: open in Pi Browser");
    window.Pi.init({ version: "2.0", sandbox: true });
    window.Pi.authenticate(["username", "payments"], (p: any) =>
      post("/api/pi/incomplete", { paymentId: p.identifier, txid: p.transaction?.txid })
    )
      .then(() => setReady(true))
      .catch((e: any) => setStatus("auth error: " + e.message));
  }, []);

  const pay = () => {
    setStatus("creating payment...");
    window.Pi.createPayment(
      { amount, memo, metadata: { orderId: "sosa-" + Date.now() } },
      {
        onReadyForServerApproval: async (paymentId: string) => {
          setStatus("approving...");
          const r = await post("/api/pi/approve", { paymentId });
          if (!r.ok) setStatus("approve failed " + r.status);
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          setStatus("completing...");
          const r = await post("/api/pi/complete", { paymentId, txid });
          setStatus(r.ok ? "✅ payment complete" : "complete failed " + r.status);
        },
        onCancel: (paymentId: string) => {
          post("/api/pi/cancelled", { paymentId });
          setStatus("cancelled");
        },
        onError: (error: Error) => setStatus("error: " + error.message),
      }
    );
  };

  return (
    <div>
      <button onClick={pay} disabled={!ready}>Pay {amount} Test-π</button>
      <p>{status}</p>
    </div>
  );
}
