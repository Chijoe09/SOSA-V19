# Apply
1. npm i @supabase/supabase-js
2. tailwind.config: darkMode: "class"
3. Run supabase.sql in Supabase SQL editor; create PUBLIC bucket `sosa-products`
4. Set env in Vercel (see .env.example), then: npm run build  (must pass, no ignoreBuildErrors)
5. Wire your existing cart state into <ProductGrid onAdd/> and <DevCheckout lines/>
