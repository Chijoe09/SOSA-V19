export type Product = {
  id: string;
  name: string;
  price_pi: number;
  description?: string;
  image_url?: string;
  created_at?: string;
};

export type Order = {
  id: string;
  buyer_name?: string;
  product_name?: string;
  amount_pi?: number;
  status?: string;
  created_at?: string;
};
