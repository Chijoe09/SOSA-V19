"use client";
// Compact "<< -10  +14 >>" pointers: green arrows, white numbers, lives in the dark top bar.
export default function CategoryPointers({ onJump }: { onJump?: (delta: number) => void }) {
  const arrow = "font-black text-[#22c55e]";
  return (
    <div className="flex items-center gap-3 text-sm text-white">
      <button className="flex items-center gap-1" onClick={() => onJump?.(-10)} aria-label="Back 10">
        <span className={arrow}>&laquo;</span><span>-10</span>
      </button>
      <button className="flex items-center gap-1" onClick={() => onJump?.(14)} aria-label="Forward 14">
        <span>+14</span><span className={arrow}>&raquo;</span>
      </button>
    </div>
  );
}
