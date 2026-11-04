export type Product = {
  id: string;
  name: string;
  price_pi: number;
  pricePi?: number;
  price?: number;
  stock?: number;
  description?: string;
  image_url?: string;
  image?: string;
  created_at?: string;
};

export type Order = {
  id?: string;
  buyer_name?: string;
  product_name?: string;
  amount_pi?: number;
  status?: string;
  created_at?: string;
};

export type OrderRow = {
  id?: string;
  created_at?: string;
  phone?: string;
  customer?: string;
  buyer_name?: string;
  productName?: string;
  product_name?: string;
  amount_pi?: number;
  amount?: number;
  deliveryType?: string;
  delivery_type?: string;
  payment?: string;
  txid?: string;
  status?: string;
  [key: string]: any;
};

export type DeliveryType = "delivery" | "pickup" | string;

export type CartLine = {
  product: Product;
  qty: number;
  quantity?: number;
  deliveryType?: DeliveryType;
};

export type CartItem = CartLine;
