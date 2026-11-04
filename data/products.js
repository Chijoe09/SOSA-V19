// Static fallback. Shop reads this FIRST; Supabase "products" rows override/extend it.
// pricePi is always a NUMBER.
export const products = [
  { id: "sosa-001", name: "Lagos Custom Loafer", pricePi: 0.05, category: "Customized Shoes", image: "/products/loafer.jpg", stock: 20, active: true },
  { id: "sosa-002", name: "Native Senator Wear", pricePi: 0.04, category: "Male Native Wears", image: "/products/senator.jpg", stock: 15, active: true },
  { id: "sosa-003", name: "Leather Belt", pricePi: 0.03, category: "Belts", image: "/products/belt.jpg", stock: 30, active: true },
];
