"use client";
import { useState } from "react";
// Plain <img> with onError fallback: never shows the broken/checkbox icon.
const PLACEHOLDER = "data:image/svg+xml;utf8," + encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='500'><rect width='100%' height='100%' fill='#222'/><text x='50%' y='50%' fill='#888' font-size='24' text-anchor='middle'>SOSA</text></svg>`);
export default function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [bad, setBad] = useState(false);
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={bad || !src ? PLACEHOLDER : src} alt={alt} loading="lazy" onError={() => setBad(true)} className="h-full w-full object-cover" />;
}
