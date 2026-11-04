export interface Product {
  id: string; name: string; pricePi: number; category: string;
  image: string; stock: number; active: boolean;
}
export interface CartLine { product: Product; qty: number }
export type DeliveryType = "pickup" | "delivery";
export interface OrderRow {
  id?: string; paymentId: string; txid: string; customerName: string; phone: string;
  address: string; deliveryType: DeliveryType; productIds: { id: string; qty: number }[];
  totalPi: number; status: string; created_at?: string;
}
