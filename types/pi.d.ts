export interface PiPaymentCallbacks {
  onReadyForServerApproval: (paymentId: string) => void;
  onReadyForServerCompletion: (paymentId: string, txid: string) => void;
  onCancel: (paymentId: string) => void;
  onError: (error: Error, payment?: unknown) => void;
}
export interface PiSDK {
  init: (cfg: { version: string; sandbox: boolean }) => void;
  authenticate: (
    scopes: string[],
    onIncompletePaymentFound: (payment: unknown) => void
  ) => Promise<{ accessToken: string; user: { uid: string; username?: string } }>;
  createPayment: (
    data: { amount: number; memo: string; metadata: Record<string, unknown> },
    cb: PiPaymentCallbacks
  ) => void;
}
declare global {
  interface Window { Pi?: PiSDK }
}
