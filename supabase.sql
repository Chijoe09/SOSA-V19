create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  paymentId text, txid text, customerName text, phone text, address text,
  deliveryType text, productIds jsonb, totalPi float, status text,
  created_at timestamp default now()
);
alter table orders enable row level security;
create policy "orders insert" on orders for insert to anon with check (true);
create policy "orders select" on orders for select to anon using (true);

create table if not exists products (
  id text primary key, name text not null, "pricePi" float not null default 0,
  category text, image text, stock int not null default 0, active boolean not null default true
);
alter table products enable row level security;
create policy "products all" on products for all to anon using (true) with check (true);

-- Storage: create a PUBLIC bucket named exactly: sosa-products
-- (this fixes "Bucket not found"), then add policies:
create policy "sosa-products read" on storage.objects for select to anon using (bucket_id = 'sosa-products');
create policy "sosa-products upload" on storage.objects for insert to anon with check (bucket_id = 'sosa-products');
