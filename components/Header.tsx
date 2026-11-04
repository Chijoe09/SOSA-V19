"use client";
import ThemeToggle from "./ThemeToggle";
import CategoryPointers from "./CategoryPointers";
export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0a] px-4 py-3 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="leading-tight">
          <div className="text-sm font-black tracking-[0.5px]" style={{ fontStretch: "125%" }}>SOPHISTICATED SAMPLES</div>
          <div className="font-bold" style={{ color: "#FFFFFF", fontStretch: "125%" }}>SOSA-outfits.</div>
        </div>
        <CategoryPointers onJump={(d) => window.dispatchEvent(new CustomEvent("sosa-jump", { detail: d }))} />
        <ThemeToggle />
      </div>
    </header>
  );
}
