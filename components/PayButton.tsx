"use client";
import { useEffect, useState } from "react";

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
    const Pi = (window as any).Pi;
    if (!Pi) return setStatus("Pi SDK not loaded: open in Pi Browser");
    Pi.init({ version: "2.0", sandbox: true });
    Pi.authenticate(["username", "payments"], (p: any) =>
      post("/api/pi/incomplete", { paymentId: p.identifier, txid: p.transaction?.txid })
    )
      .then(() => setReady(true))
      .catch((e: any) => setStatus("auth error: " + e.message));
  }, []);

  const pay = () => {
    const Pi = (window as any).Pi;
    setStatus("creating payment...");
    Pi.createPayment(
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
