"use client";
import { useState, useEffect, useRef } from "react";

// ===== SOSA SETTINGS - change links here, in one easy place =====
// CHANGE SOSA WHATSAPP HERE
const SOSA_WHATSAPP = "https://wa.me/2348087259800";
// CHANGE SOSA MAP HERE - USE MAPS API LINK ONLY - DO NOT USE kgmid OR goo.gl
const SOSA_MAP = "https://www.google.com/maps/search/?api=1&query=Sophisticated%20Samples%20Merchandise%20Limited%2C%201%20Odiche%20Street%2C%20Coker%2C%20Lagos%20101241";
// CHANGE MAP OF PI LINK HERE
const SOSA_MAP_OF_PI = "https://mapofpi.com/";
// CHANGE SOSA SOCIAL LINKS HERE (use "#" until the real link is ready)
const SOSA_SOCIAL = [
  { name: "Instagram", url: "#" },
  { name: "Facebook", url: "#" },
  { name: "X (Twitter)", url: "#" },
  { name: "TikTok", url: "#" },
  { name: "Telegram", url: "#" },
];
const SOSA_APP_URL = "https://sossa-v19.vercel.app";
const SOSA_EMAIL = "sophisticatedsamples@gmail.com";

// Inside Pi Browser, open external links in the phone's own browser/Maps app (skips Pi Browser's wrapper page).
// Outside Pi Browser (or if that fails) the normal new-tab link is used.
const openExternal = (e: any, url: string) => {
  try {
    const Pi = (window as any).Pi;
    if (/PiBrowser/i.test(navigator.userAgent) && Pi && typeof Pi.openUrlInSystemBrowser === "function") {
      e.preventDefault();
      try {
        const r = Pi.openUrlInSystemBrowser(url);
        if (r && r.catch) r.catch(() => window.open(url, "_blank"));
      } catch { window.open(url, "_blank"); }
    }
  } catch {}
};

// Wakes the Vercel API routes before a payment starts (empty request, answered immediately).
// A cold server is the likely reason the first payment attempt expired.
const warmPiServer = async () => {
  const post = (u: string) => fetch(u, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }).catch(() => null);
  await Promise.race([Promise.all([post("/api/pi/approve"), post("/api/pi/complete")]), new Promise((r) => setTimeout(r, 4000))]);
};

const PRODUCTS = [
  { id: 1, name: "Classic Heel", cat: "SOSA • HEEL", price: "0.05 Pi", color: "Black", desc: "Elegant classic heel for church, wedding & office. Comfortable sole, made in Nigeria." },
  { id: 2, name: "Royal Heel", cat: "SOSA • HEEL", price: "0.04 Pi", color: "Black", desc: "Royal look, soft inner pad. Perfect for owambe & special occasions." },
  { id: 3, name: "Lagos Heel", cat: "SOSA • HEEL", price: "0.03 Pi", color: "Black", desc: "Light Lagos everyday heel. Easy to walk in, strong & durable." },
  { id: 4, name: "Executive Heel", cat: "SOSA • HEEL", price: "0.05 Pi", color: "Black", desc: "Sharp executive heel for office & meetings. Clean, classy finish." },
  { id: 5, name: "Heritage Heel", cat: "SOSA • HEEL", price: "0.04 Pi", color: "Black", desc: "Heritage design with Nigerian style. Strong, beautiful, trusted." },
  { id: 6, name: "Classic Flat", cat: "SOSA • FLAT", price: "0.05 Pi", color: "Black", desc: "Classic flat for everyday comfort. Church, office, market, all day." },
  { id: 7, name: "Royal Flat", cat: "SOSA • FLAT", price: "0.04 Pi", color: "Black", desc: "Royal flat with soft cushion. Elegant but comfortable." },
  { id: 8, name: "Lagos Flat", cat: "SOSA • FLAT", price: "0.03 Pi", color: "Black", desc: "Light Lagos flat. Walk anywhere in Lagos with ease." },
  { id: 9, name: "Executive Flat", cat: "SOSA • FLAT", price: "0.05 Pi", color: "Black", desc: "Executive flat for work. Neat, professional, comfortable." },
  { id: 10, name: "Heritage Flat", cat: "SOSA • FLAT", price: "0.04 Pi", color: "Black", desc: "Heritage flat - Nigerian craft, modern comfort." },
  { id: 11, name: "Classic Palm Slide", cat: "SOSA • SLIDE", price: "0.04 Pi", color: "Black", desc: "Classic palm slide. Easy to wear, easy to wash, very comfortable." },
  { id: 12, name: "Royal Palm Slide", cat: "SOSA • SLIDE", price: "0.04 Pi", color: "Black", desc: "Royal palm slide - soft, classy, premium feel." },
  { id: 13, name: "Lagos Palm Slide", cat: "SOSA • SLIDE", price: "0.03 Pi", color: "Black", desc: "Lagos palm slide for home & street. Light & strong." },
  { id: 14, name: "Executive Palm Slide", cat: "SOSA • SLIDE", price: "0.05 Pi", color: "Black", desc: "Executive palm slide - clean look for smart casual." },
  { id: 15, name: "Heritage Palm Slide", cat: "SOSA • SLIDE", price: "0.04 Pi", color: "Black", desc: "Heritage palm slide - our signature Nigerian slide." },
  { id: 16, name: "SOSA Signature Heel", cat: "NEW #16 • FLAGSHIP", price: "0.06 Pi", color: "Black", desc: "NEW #16 - Our flagship. Signature SOSA heel, premium finish, limited stock. The one everyone will ask about." },
  { id: 17, name: "Gold Bag", cat: "SOSA • BAG", price: "0.06 Pi", color: "Gold", desc: "Luxury gold bag for owambe, church & outing. Strong, classy, made in Nigeria." },
  { id: 18, name: "Silver Bag", cat: "SOSA • BAG", price: "0.06 Pi", color: "Silver", desc: "Elegant silver bag for owambe, church & outing. Light, strong, premium finish." },
];

const SIZES = ["S", "M", "L", "XL", "XXL"];

// Per-Pi-user storage keys (so buyers on the same phone never see each other's data)
const SESSION_KEY = "sosa_session_user";
const ordersKey = (u: string) => "orders_@" + u;
const pointsKey = (u: string) => "points_@" + u;
const readOrders = (u: string): any[] => {
  try {
    const raw = localStorage.getItem(ordersKey(u));
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
};
// Unique barcode per order: SOSA-MMDD-HHMMSS-RRRR (date + time to the second + random 4 digits)
const newOrderCode = () => {
  const d = new Date();
  const p = (n: number, len = 2) => String(n).padStart(len, "0");
  return "SOSA-" + p(d.getMonth() + 1) + p(d.getDate()) + "-" + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds()) + "-" + p(Math.floor(Math.random() * 10000), 4);
};

// App Tour: finds the real button(s) a step is talking about (returns one box covering them)
const getAppTourRect = (step: number) => {
  const ids = step === 2 ? ["tour-search", "tour-cats"] : step === 3 ? ["tour-cart"] : step === 4 ? ["tour-orders"] : step === 5 || step === 6 ? ["tour-menu"] : step === 7 ? ["tour-share"] : [];
  const rs = ids.map((id) => document.getElementById(id)).filter(Boolean).map((el: any) => el.getBoundingClientRect());
  if (!rs.length) return null;
  const top = Math.min(...rs.map((r: any) => r.top));
  const left = Math.min(...rs.map((r: any) => r.left));
  const right = Math.max(...rs.map((r: any) => r.right));
  const bottom = Math.max(...rs.map((r: any) => r.bottom));
  return { top, left, width: right - left, height: bottom - top };
};

function SosaLogo() {
  return (
    <div style={{ width: 56, height: 62, background: "#FFF8DC", borderRadius: 10, overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="54" height="60" viewBox="0 0 54 60" style={{ display: "block" }}>
        <defs><clipPath id="egg2"><ellipse cx="27" cy="30" rx="25" ry="28" /></clipPath></defs>
        <ellipse cx="27" cy="30" rx="25" ry="28" fill="#fff" />
        <g clipPath="url(#egg2)">
          <rect x="0" y="0" width="54" height="60" fill="#fff" />
          <path d="M0 12 Q27 4 54 10 L54 20 Q27 12 0 20 Z" fill="#0096e6" />
          <path d="M0 26 Q27 18 54 24 L54 34 Q27 26 0 34 Z" fill="#ffc107" />
          <path d="M0 40 Q27 32 54 38 L54 48 Q27 40 0 48 Z" fill="#e53935" />
          <path d="M0 52 Q27 44 54 52 L54 60 L0 60 Z" fill="#00843d" />
        </g>
        <text x="27" y="52" textAnchor="middle" style={{ fontSize: 8.5, fontWeight: 900, fill: "#00843d", fontFamily: "Arial" }}>SOSA</text>
        <text x="27" y="59" textAnchor="middle" style={{ fontSize: 6.5, fontWeight: 700, fill: "#fff", fontFamily: "Arial" }}>Outfits</text>
      </svg>
    </div>
  );
}

function Barcode({ code }: { code: string }) {
  const bars = code.split("").map((ch, i) => ({ w: (ch.charCodeAt(0) % 4) + 1, black: i % 2 === 0 }));
  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: "10px 12px 8px", marginTop: 10 }}>
      <div style={{ display: "flex", alignItems: "flex-end", height: 48, gap: 2, justifyContent: "center" }}>
        {bars.map((b, i) => (<div key={i} style={{ width: b.w, height: 48, background: b.black ? "#000" : "#fff" }} />))}
        <div style={{ width: 3, height: 48, background: "#000" }} />
        <div style={{ width: 1, height: 48, background: "#000" }} />
        <div style={{ width: 2, height: 48, background: "#000" }} />
      </div>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 800, letterSpacing: 2, color: "#000", marginTop: 4 }}>{code}</div>
      <div style={{ textAlign: "center", fontSize: 10, color: "#555" }}>Show this barcode at pickup - SOSA Outfits</div>
    </div>
  );
}

// Shared compact card sizes - used by BOTH the grid and the slideshow so they always match
const CARD_MIN_H = 166;
const cardBox: any = { background: "#fff", color: "#000", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: CARD_MIN_H };
const imgBox: any = { background: "#000", textAlign: "center", padding: "3px 2px", height: 30, display: "flex", flexDirection: "column", justifyContent: "center" };
const bodyBox: any = { padding: 4, display: "flex", flexDirection: "column", gap: 3, flex: 1 };
const nameSt: any = { fontSize: 10, fontWeight: 800, lineHeight: 1.15, minHeight: 23, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" };
const priceSt: any = { fontSize: 10, fontWeight: 800, color: "#b45309", lineHeight: 1.2 };
const descSt: any = { fontSize: 8, lineHeight: 1.25, height: 20, color: "#555", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" };
const selSt: any = { flex: 1, minWidth: 0, height: 22, fontSize: 9, padding: 1, border: "1px solid #ddd", borderRadius: 5 };
const cardBtn: any = { flex: 1, minWidth: 0, height: 36, border: 0, borderRadius: 6, fontSize: 9, fontWeight: 700, lineHeight: 1.15, padding: 0 };

// Home-page product slideshow: auto-slides every 3s, swipe, dots, pause on touch, tap = open that product
function Slideshow({ products, getChoice, onOpen }: { products: any[]; getChoice: (p: any) => any; onOpen: (p: any) => void }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const idxRef = useRef(0);
  const pausedRef = useRef(false);
  const resumeRef = useRef<any>(null);
  const [active, setActive] = useState(0);

  const slidesOf = () => (boxRef.current ? Array.from(boxRef.current.querySelectorAll("[data-slide]")) as HTMLElement[] : []);

  const goTo = (i: number, smooth = true) => {
    const box = boxRef.current;
    const slide = slidesOf()[i];
    if (!box || !slide) return;
    box.scrollTo({ left: slide.offsetLeft - (box.clientWidth - slide.clientWidth) / 2, behavior: smooth ? "smooth" : "auto" });
  };
  const goToRef = useRef(goTo);
  goToRef.current = goTo;

  const onScroll = () => {
    const box = boxRef.current;
    const slides = slidesOf();
    if (!box || slides.length < 2) return;
    const step = slides[1].offsetLeft - slides[0].offsetLeft;
    if (step <= 0) return;
    const i = Math.max(0, Math.min(products.length - 1, Math.round(box.scrollLeft / step)));
    if (i !== idxRef.current) { idxRef.current = i; setActive(i); }
  };

  // touch/hold pauses auto-slide; resumes 3 seconds after release
  const hold = () => { pausedRef.current = true; if (resumeRef.current) clearTimeout(resumeRef.current); };
  const release = () => {
    if (resumeRef.current) clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => { pausedRef.current = false; }, 3000);
  };

  useEffect(() => {
    const t = setInterval(() => {
      if (pausedRef.current) return;
      const next = (idxRef.current + 1) % products.length;
      goToRef.current(next, next !== 0);
    }, 3000);
    return () => { clearInterval(t); if (resumeRef.current) clearTimeout(resumeRef.current); };
  }, [products.length]);

  // Slide width = (container - 2 gaps) / 3 = exactly one grid column. Spacers let the first/last slide centre.
  const spacer = <div aria-hidden="true" style={{ flex: "0 0 calc(33.333% - 4px)" }} />;

  return (
    <div style={{ margin: "6px 8px 0" }}>
      <style>{".sosa-slides::-webkit-scrollbar{display:none}"}</style>
      <div
        ref={boxRef}
        className="sosa-slides"
        onScroll={onScroll}
        onTouchStart={hold}
        onTouchEnd={release}
        onTouchCancel={release}
        onMouseDown={hold}
        onMouseUp={release}
        onMouseLeave={release}
        style={{ position: "relative", display: "flex", gap: 6, overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none", overscrollBehaviorX: "contain" } as any}
      >
        {spacer}
        {products.map((p, i) => {
          const ch = getChoice(p);
          return (
            <div key={p.id} data-slide="1" onClick={() => onOpen(p)} style={{ ...cardBox, flex: "0 0 calc((100% - 12px) / 3)", scrollSnapAlign: "center", cursor: "pointer", opacity: i === active ? 1 : 0.8 }}>
              <div style={imgBox}>
                <div style={{ color: "#f5b301", fontSize: 7.5, fontWeight: 700, lineHeight: 1.2 }}>{p.cat}</div>
                <div style={{ color: "#aaa", fontSize: 7.5, lineHeight: 1.2 }}>📷 Photo Coming Soon</div>
              </div>
              <div style={bodyBox}>
                <div style={nameSt}>{p.name}</div>
                <div style={priceSt}>{p.price} • {ch.color}</div>
                <div style={descSt}>{p.desc}</div>
                <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
                  <div style={{ height: 22, border: "1px solid #ddd", borderRadius: 5, fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>{ch.color} / {ch.size}</div>
                  <div style={{ ...cardBtn, flex: "none", background: "#f5b301", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>View &amp; Add to Cart</div>
                </div>
              </div>
            </div>
          );
        })}
        {spacer}
      </div>
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", marginTop: 2 }}>
        {products.map((p, i) => (
          <button key={p.id} aria-label={"Go to " + p.name} onClick={() => { hold(); goTo(i); release(); }} style={{ padding: "3px 4px", background: "transparent", border: 0 }}>
            <span style={{ display: "block", width: 6, height: 6, borderRadius: "50%", background: i === active ? "#f5b301" : "#888" }} />
          </button>
        ))}
      </div>
    </div>
  );
}
export default function Home() {
  const [cart, setCart] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  // Leadership points: 1 Pi = 10 pts, only paid orders count
const myPoints = orders
  .filter((o) => o.status && o.status.includes("PAID"))
  .reduce((sum, o) => sum + parseFloat(o.total || "0"), 0) * 10;
  const [selected, setSelected] = useState<any>(null);
  const [dark, setDark] = useState(true);
  const [panel, setPanel] = useState<string | null>(null);
  const [payStatus, setPayStatus] = useState<string>("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryType, setDeliveryType] = useState("delivery");
  const [choices, setChoices] = useState<any>({});
  const [orderCode, setOrderCode] = useState(() => newOrderCode());
  const [user, setUser] = useState<string | null>(null); // Pi username of the logged-in buyer
  const [ready, setReady] = useState(false);
  const [loginMsg, setLoginMsg] = useState("");
  // Stuck (incomplete) Pi payment found by Pi.authenticate
  const [stuck, setStuck] = useState<{ id: string; amount: any; txid: string; done?: boolean } | null>(null);
  const [stuckMsg, setStuckMsg] = useState("");
  const [stuckBusy, setStuckBusy] = useState(false);
  const stuckRef = useRef<any>(null);
  // Side menu + popups
  const [menuOpen, setMenuOpen] = useState(false);
  const [popup, setPopup] = useState<string | null>(null);
  const [ratings, setRatings] = useState<any>({}); // saved in this browser only: { username: {stars, comment, date} }
  const [rateStars, setRateStars] = useState(0);
  const [rateComment, setRateComment] = useState("");
  const [rateMsg, setRateMsg] = useState("");
  const [trackPhone, setTrackPhone] = useState("");
  const [trackCode, setTrackCode] = useState("");
  const [trackResult, setTrackResult] = useState<any>(null);
  const [copyMsg, setCopyMsg] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  // Pay with Pi guard: blocks double taps while a payment is being prepared/paid
  const [paying, setPaying] = useState(false);
  const payingRef = useRef(false);
  const payTimerRef = useRef<any>(null);
  const piReadyRef = useRef(false);
  const endPaying = () => {
    payingRef.current = false;
    setPaying(false);
    if (payTimerRef.current) { clearTimeout(payTimerRef.current); payTimerRef.current = null; }
  };
  useEffect(() => { if (panel === "cart") warmPiServer(); }, [panel]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sosa_ratings");
      if (raw) { const r = JSON.parse(raw); if (r && typeof r === "object") setRatings(r); }
    } catch {}
  }, []);

  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://sdk.minepi.com/pi-sdk.js"; s.async = true;
    s.onload = () => { try { (window as any).Pi.init({ version: "2.0", sandbox: true }); piReadyRef.current = true; } catch {} };
    document.body.appendChild(s);
  }, []);

  // Restore saved Pi session (if any) and that user's own orders
  useEffect(() => {
    try {
      const u = localStorage.getItem(SESSION_KEY);
      if (u) { setUser(u); setOrders(readOrders(u)); }
    } catch {}
    setReady(true);
  }, []);

  const startSession = (u: string) => {
    try { localStorage.setItem(SESSION_KEY, u); } catch {}
    setOrders(readOrders(u));
    setUser(u);
    setLoginMsg("");
  };

  // Full logout: clears session + everything in memory so the next buyer starts clean
  const logout = (msg?: string) => {
    try { localStorage.removeItem(SESSION_KEY); } catch {}
    setUser(null);
    setOrders([]);
    setCart([]);
    setFullName("");
    setPhone("");
    setAddress("");
    setChoices({});
    setSelected(null);
    setPanel(null);
    setPayStatus("");
    setDeliveryType("delivery");
    setOrderCode(newOrderCode());
    setStuck(null);
    setStuckMsg("");
    stuckRef.current = null;
    endPaying();
    setMenuOpen(false);
    setPopup(null);
    setTrackPhone("");
    setTrackCode("");
    setTrackResult(null);
    setLoginMsg(msg || "");
  };

  // ===== Side menu + popups =====
  const closeMenu = () => setMenuOpen(false);
  const menuOpenBoard = () => { setMenuOpen(false); setPanel("board"); };
  const menuOpenPopup = (name: string) => {
    setMenuOpen(false);
    if (name === "rate") { setRateStars(0); setRateComment(""); setRateMsg(""); }
    if (name === "track") { setTrackPhone(""); setTrackCode(""); setTrackResult(null); }
    if (name === "share") setCopyMsg("");
    setPopup(name);
  };
  const shareApp = async () => {
    setMenuOpen(false);
    // SOSA referral link - uses logged-in Pi username
    const refName = (user || "chijoe09").replace("@", "").trim();
    const referralLink = `https://sossa-v19.vercel.app/?ref=${refName}`;
    const navi: any = navigator;
    if (navi.share) {
      try {
        await navi.share({
          title: "SOSA Outfits",
          text: `Join SOSA Outfits - Luxury street wears! Use my link: ${referralLink}`,
          url: referralLink,
        });
        return;
      } catch {}
    }
    setCopyMsg("");
    setPopup("share");
  };
  const copyLink = async () => {
    const refName = (user || "chijoe09").replace("@", "").trim();
    const referralLink = `https://sossa-v19.vercel.app/?ref=${refName}`;
    try { await navigator.clipboard.writeText(referralLink); setCopyMsg("Link copied!"); }
    catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = referralLink; document.body.appendChild(ta); ta.select();
        document.execCommand("copy"); document.body.removeChild(ta);
        setCopyMsg("Link copied!");
      } catch { setCopyMsg("Copy failed, long-press to copy"); }
    }
  };
  // SOSA Tour - read ?ref= from link + SAVE it + load shared board
const [tourRef, setTourRef] = useState("");
const [sharedBoard, setSharedBoard] = useState<any[]>([]);
const loadSharedBoard = async () => {
  try {
    const r = await fetch("/api/leaderboard");
    const j = await r.json();
    if (j.board) setSharedBoard(j.board);
  } catch {}
};
useEffect(() => {
  loadSharedBoard();
  try {
    const r = new URLSearchParams(window.location.search).get("ref");
    if (r) {
      const clean = r.replace("@", "").trim().toLowerCase();
      setTourRef(clean);
      localStorage.setItem("sosa_referred_by", clean);
      setPopup("tour");
    }
  } catch {}
}, []);

  // ===== App Tour (replayable from the side menu) =====
  const [appTourOpen, setAppTourOpen] = useState(false);
  const [appTourStep, setAppTourStep] = useState(1);
  const [appTourRect, setAppTourRect] = useState<any>(null);
  const startAppTour = () => { setMenuOpen(false); setAppTourStep(1); setAppTourOpen(true); };
  const skipAppTour = () => { setAppTourOpen(false); };
  const finishAppTour = () => { try { localStorage.setItem("sosa-tour-done", "true"); } catch {} setAppTourOpen(false); };
  useEffect(() => {
    if (!appTourOpen) { setAppTourRect(null); return; }
    window.scrollTo({ top: 0 });
    const measure = () => setAppTourRect(getAppTourRect(appTourStep));
    const t = setTimeout(measure, 60);
    window.addEventListener("resize", measure);
    return () => { clearTimeout(t); window.removeEventListener("resize", measure); };
  }, [appTourOpen, appTourStep]);
  useEffect(() => {
    document.body.style.overflow = appTourOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [appTourOpen]);

  const ratingList = Object.values(ratings) as any[];
  const ratingAvg = ratingList.length ? (ratingList.reduce((a: number, r: any) => a + (Number(r.stars) || 0), 0) / ratingList.length).toFixed(1) : "";
  const myRating = user ? ratings[user] : null;
  const submitRating = () => {
    if (!user) return;
    if (!rateStars) { setRateMsg("Please tap a star (1 to 5)."); return; }
    const next = { ...ratings, [user]: { stars: rateStars, comment: rateComment.trim(), date: new Date().toLocaleString() } };
    setRatings(next);
    try { localStorage.setItem("sosa_ratings", JSON.stringify(next)); } catch {}
    setRateMsg("");
  };
  // Track Order: searches the SAME order list that My Orders shows. Formatting of code/phone is ignored.
  const normCode = (v: string) => String(v || "").toUpperCase().replace(/[^A-Z0-9]/g, "").replace(/^SOSA/, "");
  const normPhone = (v: string) => {
    let d = String(v || "").replace(/\D/g, "");
    if (d.startsWith("234")) d = d.slice(3);
    if (d.startsWith("0")) d = d.slice(1);
    return d;
  };
  const doTrack = () => {
    const ph = normPhone(trackPhone);
    const code = normCode(trackCode);
    if (ph.length < 7 || !code) { setTrackResult("need"); return; }
    const sameCode = orders.filter((o) => normCode(o.code) === code);
    const found = sameCode.find((o) => normPhone(o.phone) === ph);
    if (found) { setTrackResult(found); return; }
    const hint = sameCode.length ? "That order code exists, but the phone number on it is different. The phone on that order ends with " + String(sameCode[0].phone || "").replace(/\D/g, "").slice(-4) + "." : "";
    setTrackResult({ error: "none", phone: trackPhone, code: trackCode, hint }); // form is NOT cleared
  };
  const shareOrderWA = (o: any) => {
    const text = "SOSA Outfits Order " + o.code + " - Total " + o.total + " Pi. Show this barcode at pickup - SOSA Outfits. " + SOSA_APP_URL;
    window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
  };

  // Pi calls this during authenticate() when an old payment was never completed/cancelled
  const onIncompletePaymentFound = (payment: any) => {
    const info = { id: payment?.identifier || "", amount: payment?.amount, txid: payment?.transaction?.txid || "" };
    stuckRef.current = info;
    setStuck(info);
    setStuckMsg("");
  };

  const stuckAction = async (action: "complete" | "cancel") => {
    if (!stuck || stuckBusy) return;
    if (action === "complete" && !stuck.txid) {
      setStuckMsg("❌ This payment has no blockchain transaction (txid), so it cannot be completed. Tap Cancel Stuck Payment instead.");
      return;
    }
    setStuckBusy(true);
    setStuckMsg(action === "complete" ? "⏳ Completing stuck payment..." : "⏳ Cancelling stuck payment...");
    try {
      const res = await fetch("/api/pi/" + action, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(action === "complete" ? { paymentId: stuck.id, txid: stuck.txid } : { paymentId: stuck.id }) });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        setStuckMsg("❌ " + action + " failed (" + res.status + "). " + t.slice(0, 200));
      } else {
        stuckRef.current = null;
        setStuck({ ...stuck, done: true });
        setStuckMsg(action === "complete" ? "✅ Stuck payment completed. You can pay again now." : "✅ Stuck payment cancelled. You can pay again now.");
        setPayStatus("");
      }
    } catch (e: any) {
      setStuckMsg("❌ " + (e?.message || "Network error. Try again."));
    }
    setStuckBusy(false);
  };

  const login = async () => {
    const Pi = (window as any).Pi;
    if (!Pi) { setLoginMsg("❌ Open this site in Pi Browser to login with Pi (or wait a second and tap again)."); return; }
    setLoginMsg("⏳ Logging in with Pi...");
    try {
      const auth = await Pi.authenticate(["username", "payments"], onIncompletePaymentFound);
      const u = auth?.user?.username;
      if (!u) { setLoginMsg("❌ Could not read your Pi username. Try again."); return; }
      startSession(u);
    } catch (e: any) { setLoginMsg("❌ " + (e?.message || "Pi login failed. Try again in Pi Browser.")); }
  };

  const bg = dark ? "#000" : "#f2f2f2";
  const mainText = dark ? "#fff" : "#000";
  const subText2 = dark ? "#aaa" : "#777";
  const getChoice = (p: any) => choices[p.id] || { size: "M", color: p.color };
  const addToCart = (p: any) => {
    const ch = getChoice(p);
    const key = p.id + "-" + ch.color + "-" + ch.size;
    const f = cart.find((c) => c.key === key);
    if (f) setCart(cart.map((c) => c.key === key ? { ...c, qty: c.qty + 1 } : c));
    else setCart([...cart, { ...p, key, size: ch.size, color: ch.color, qty: 1 }]);
  };
  const inc = (key: string) => setCart(cart.map((c) => c.key === key ? { ...c, qty: c.qty + 1 } : c));
  const dec = (key: string) => setCart(cart.map((c) => c.key === key ? { ...c, qty: Math.max(1, c.qty - 1) } : c));
  const removeItem = (key: string) => setCart(cart.filter((c) => c.key !== key));
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const subtotal = cart.reduce((s, c) => s + parseFloat(c.price) * c.qty, 0);
  const deliveryFee = deliveryType === "delivery" ? 0.0001 : 0;
  const grandTotal = (subtotal + deliveryFee).toFixed(4);

  // Every time a new order is started (cart goes from empty to filled) it gets a brand new barcode
  const prevCartCount = useRef(0);
  useEffect(() => {
    if (cartCount > 0 && prevCartCount.current === 0) setOrderCode(newOrderCode());
    prevCartCount.current = cartCount;
  }, [cartCount]);

  const saveOrder = (status: string, txid?: string, code?: string) => {
  if (!user) return;
  const newOrder = { id: Date.now(), code: code || orderCode, items: [...cart], total: grandTotal, subtotal: subtotal.toFixed(4), deliveryFee, deliveryType, fullName, phone, address, date: new Date().toLocaleString(), txid: txid || "", status, piUser: user };
  const nextOrders = [newOrder, ...orders];
  setOrders(nextOrders);
  try {
    localStorage.setItem(ordersKey(user), JSON.stringify(nextOrders));
    const pts = nextOrders.filter((o) => o.status && o.status.includes("PAID")).reduce((sum, o) => sum + parseFloat(o.total || "0"), 0) * 10;
    localStorage.setItem(pointsKey(user), pts.toFixed(1));
    if (status.includes("PAID")) {
      const refBy = (localStorage.getItem("sosa_referred_by") || "").toLowerCase();
      fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyer: user, buyerPts: pts, referrer: refBy, orderId: String(newOrder.id), orderTotal: parseFloat(grandTotal) }),
      }).then(() => loadSharedBoard()).catch(() => {});
    }
  } catch {}
  setCart([]);
  setPanel("orders");
  setPayStatus("");
};

  // Waits (max ~10s) until the Pi SDK is loaded AND initialised, so the payment is created only once, when ready
  const waitForPi = async () => {
    for (let i = 0; i < 40; i++) {
      if ((window as any).Pi && piReadyRef.current) return true;
      await new Promise((r) => setTimeout(r, 250));
    }
    return false;
  };
  const EXPIRED_MSG = "⚠️ Payment expired, tap Pay Pi again to retry. Your cart, name and phone are still saved.";

  // TEST PI - NOW WITH REAL APPROVAL VIA BACKEND
  const checkout = async () => {
    if (payingRef.current) return; // a payment is already being prepared - ignore extra taps
    if (cart.length === 0) return;
    if (!fullName.trim() || !phone.trim()) { setPayStatus("❌ Please enter Full Name and Phone Number / WhatsApp first."); return; }
    if (deliveryType === "delivery" && !address.trim()) { setPayStatus("❌ Please enter Delivery Address."); return; }
    payingRef.current = true;
    setPaying(true);
    payTimerRef.current = setTimeout(endPaying, 120000); // safety: never leave the button locked forever
    setPayStatus("⏳ Preparing payment... please wait, do not tap again");
    try {
      const ready = await waitForPi();
      const Pi = (window as any).Pi;
      if (!ready || !Pi) { setPayStatus("❌ Open this site in Pi Browser to pay with Test Pi (or wait a few seconds for Pi to load, then tap again)."); endPaying(); return; }
      setPayStatus("⏳ Opening Pi Test Wallet... Approve in Pi Browser.");
      const auth = await Pi.authenticate(["username", "payments"], onIncompletePaymentFound);
      // IDENTITY CHECK: the Pi account paying must be the logged-in shop user
      const piUser = auth?.user?.username;
      if (!piUser || piUser !== user) {
        endPaying();
        logout("❌ Pi account " + (piUser ? "@" + piUser : "(unknown)") + " does not match the logged-in shop user @" + user + ". No payment was made. Please login again as yourself.");
        return;
      }
      if (stuckRef.current) { setPayStatus("⚠️ A stuck payment was found. Tap Complete or Cancel in the box first, then tap Pay again."); endPaying(); return; }
      await warmPiServer();
      // Handle any unfinished payment from last expired try
      try { await Pi.getIncompletePayments?.((p: any) => {}); } catch {}
      await Pi.createPayment({ amount: parseFloat(grandTotal), memo: "SOSA Outfits - " + fullName + " - " + deliveryType, metadata: { fullName, phone, address, deliveryType, items: cart, orderCode } }, {
        onReadyForServerApproval: async (paymentId: string) => {
          setPayStatus("⏳ Wallet opened - Approving payment now (this is what failed before)...");
          // THIS IS THE FIX: actually call backend to approve, don't just wait
          const res = await fetch("/api/pi/approve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paymentId }) });
          if (!res.ok) { setPayStatus("❌ Approval failed - Check Vercel PI_API_KEY. See steps below. Order NOT lost."); endPaying(); throw new Error("approve failed"); }
          setPayStatus("✅ Approved! Now confirm in your Wallet...");
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          // Tell backend to complete it
          const done = await fetch("/api/pi/complete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paymentId, txid }) }).catch(() => null);
          if (!done || !done.ok) { setPayStatus("⚠️ Payment sent but server completion failed (check PI_API_KEY in Vercel). Do NOT pay again - logout and login to Complete it."); endPaying(); return; }
          saveOrder("✅ TEST PAID - Pi Test Payment Confirmed", txid, orderCode); // cart is cleared ONLY here, after success
          endPaying();
        },
        onCancel: () => { setPayStatus("❌ Payment cancelled. No Test Pi taken. Your cart is still saved."); endPaying(); },
        onError: (e: any) => {
          const m = String(e?.message || e || "");
          setPayStatus(/expire/i.test(m) ? EXPIRED_MSG : "❌ " + (m || "Test Pi error. If it says approval failed, do Step 2 below."));
          endPaying();
        },
      });
    } catch (e: any) {
      const m = String(e?.message || "");
      setPayStatus(/expire/i.test(m) ? EXPIRED_MSG : "❌ " + (m || "Test Pi error. Try again in Pi Browser."));
      endPaying();
    }
  };
    const btnStyle: any = { background: dark ? "#fff" : "#000", color: dark ? "#000" : "#fff", border: 0, borderRadius: 20, padding: "7px 12px", fontSize: 12, fontWeight: 700 };
  const inputStyle: any = { width: "100%", padding: "12px", borderRadius: 10, border: "none", fontSize: 14, boxSizing: "border-box" as any, marginTop: 8, background: "#fff", color: "#000" };

  const stuckBox = stuck ? (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", color: "#000", width: "100%", maxWidth: 380, borderRadius: 16, padding: 20 }}>
        <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>⚠️ Pending Payment Found</h2>
        <p style={{ fontSize: 13, margin: "6px 0", wordBreak: "break-all" }}><b>Stuck Payment ID:</b> {stuck.id}</p>
        <p style={{ fontSize: 13, margin: "6px 0" }}><b>Stuck Amount:</b> {String(stuck.amount)} Pi</p>
        {stuckMsg && <div style={{ background: "#fff3cd", color: "#000", borderRadius: 8, padding: 10, fontSize: 12, fontWeight: 700, margin: "10px 0" }}>{stuckMsg}</div>}
        {!stuck.done && <button disabled={stuckBusy} onClick={() => stuckAction("complete")} style={{ width: "100%", background: "#00843d", color: "#fff", border: 0, borderRadius: 20, padding: "11px 0", fontWeight: 800, marginTop: 8 }}>Complete Stuck Payment</button>}
        {!stuck.done && <button disabled={stuckBusy} onClick={() => stuckAction("cancel")} style={{ width: "100%", background: "#e53935", color: "#fff", border: 0, borderRadius: 20, padding: "11px 0", fontWeight: 800, marginTop: 8 }}>Cancel Stuck Payment</button>}
        {stuck.done && <button onClick={() => { setStuck(null); setStuckMsg(""); }} style={{ width: "100%", background: "#000", color: "#fff", border: 0, borderRadius: 20, padding: "11px 0", fontWeight: 800, marginTop: 8 }}>Close</button>}
      </div>
    </div>
  ) : null;

  if (!ready) return <div style={{ background: bg, minHeight: "100vh" }} />;

  if (!user) {
    return (
      <div style={{ background: bg, color: mainText, minHeight: "100vh", fontFamily: "Arial, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
        {stuckBox}
        <div style={{ width: "100%", maxWidth: 360, textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center" }}><SosaLogo /></div>
          <h1 style={{ fontSize: 22, lineHeight: 1.1, margin: "12px 0 0", fontWeight: 900 }}>SOPHISTICATED<br />SAMPLES</h1>
          <p style={{ fontSize: 14, margin: "4px 0 16px", fontWeight: 900 }}>SOSA Outfits</p>
          <p style={{ fontSize: 13, color: subText2, margin: "0 0 14px" }}>Login with your own Pi account to shop. Orders and points are saved per Pi username.</p>
          {loginMsg && <div style={{ background: "#fff3cd", color: "#000", borderRadius: 8, padding: 10, fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{loginMsg}</div>}
          <button onClick={login} style={{ width: "100%", background: "#f5b301", color: "#000", border: 0, borderRadius: 20, padding: "12px 0", fontWeight: 800, fontSize: 14 }}>Login with Pi</button>
        </div>
      </div>
    );
  }

  // Search + category filter (used by slideshow AND grid)
  const catWords: any = { Heel: "heel", Flat: "flat", "Palm Slide": "slide", Bag: "bag" };
  const q = search.trim().toLowerCase();
  const visibleProducts = PRODUCTS.filter((p) => {
    const catOk = category === "All" || (p.name + " " + p.cat).toLowerCase().includes(catWords[category]);
    const hay = (p.name + " " + p.cat + " " + p.color + " " + p.desc).toLowerCase();
    return catOk && (!q || hay.includes(q));
  });

// Leadership Board: REAL shared board from backend, sort HIGH to LOW
const boardAll: any[] = (() => {
  const map: any = {};
  sharedBoard.forEach((u: any) => { map[String(u.name).replace("@","").toLowerCase()] = Number(u.pts) || 0; });
  if (user) map[user.toLowerCase()] = myPoints;
  return Object.keys(map)
    .map((k) => ({ name: "@" + k, pts: map[k], you: k === (user || "").toLowerCase() }))
    .sort((a, b) => b.pts - a.pts);
})();
const boardTop = boardAll.slice(0, 10);
const myBoardIdx = boardAll.findIndex((u) => u.you);

  const mItem: any = { display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", textAlign: "left", background: "#111", color: "#fff", border: 0, borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700, marginTop: 8, textDecoration: "none", boxSizing: "border-box" };
  const mSub: any = { display: "block", fontSize: 11, fontWeight: 400, color: "#aaa", marginTop: 2 };

  const menuUI = (
    <div style={{ position: "fixed", inset: 0, zIndex: 70, pointerEvents: menuOpen ? "auto" : "none", visibility: menuOpen ? "visible" : "hidden", transition: menuOpen ? "none" : "visibility 0s linear 0.25s" }}>
      <div onClick={closeMenu} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", opacity: menuOpen ? 1 : 0, transition: "opacity 0.25s" }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "85%", maxWidth: 380, background: "#000", color: "#fff", overflowY: "auto", padding: 16, boxSizing: "border-box", borderRight: "2px solid #f5b301", transform: menuOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.25s ease" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 14, flexShrink: 0, marginBottom: 6 }}>
          <button onClick={closeMenu} style={{ alignSelf: "flex-start", background: "#f5b301", color: "#000", border: 0, borderRadius: 20, padding: "8px 14px", fontSize: 13, fontWeight: 800 }}>&lt; Back to Shop</button>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#f5b301", lineHeight: 1.4, wordBreak: "break-word", padding: "2px 0" }}>Logged in as @{user}</div>
          <button onClick={closeMenu} style={{ ...mItem, marginTop: 0, justifyContent: "center", background: "#fff", color: "#000" }}>View Profile</button>
        </div>

        <button onClick={menuOpenBoard} style={mItem}><span>🏆 Leadership Board</span></button>
        <button onClick={() => menuOpenPopup("track")} style={mItem}><span>📦 Track Order</span></button>
        <button onClick={() => menuOpenPopup("rate")} style={mItem}><span>⭐ Rate Us{ratingAvg ? <span style={mSub}>Average ★ {ratingAvg}</span> : null}</span></button>
        <a href={SOSA_WHATSAPP} target="_blank" rel="noopener noreferrer" onClick={closeMenu} style={mItem}><span>💬 WhatsApp Us</span></a>
        <a href={"mailto:" + SOSA_EMAIL} onClick={closeMenu} style={mItem}><span>✉️ Email Us<span style={mSub}>{SOSA_EMAIL}</span></span></a>
        <a href={SOSA_MAP} target="_blank" rel="noopener noreferrer" onClick={(e) => { closeMenu(); openExternal(e, SOSA_MAP); }} style={mItem}><span>📍 Sosa Map<span style={mSub}>No. 1, ODICHE STREET, COKER Aguda, ORILE, LAGOS. - Get Directions</span></span></a>
        <a href={SOSA_MAP_OF_PI} target="_blank" rel="noopener noreferrer" onClick={(e) => { closeMenu(); openExternal(e, SOSA_MAP_OF_PI); }} style={mItem}><span>🌍 Map Of Pi<span style={mSub}>sosa.pi/outfits</span></span></a>

        <h3 style={{ fontSize: 15, margin: "18px 0 0", color: "#f5b301" }}>Follow Us</h3>
        {SOSA_SOCIAL.map((sc) => (
          <a key={sc.name} href={sc.url} target="_blank" rel="noopener noreferrer" onClick={(e) => { if (sc.url === "#") e.preventDefault(); else closeMenu(); }} style={mItem}>
            <span>{sc.name}</span><span style={{ fontSize: 11, fontWeight: 400, color: "#aaa" }}>{sc.url === "#" ? "Coming Soon" : "Open"}</span>
          </a>
        ))}

        <button onClick={startAppTour} style={{ ...mItem, marginTop: 18 }}><span>✨ App Tour</span></button>
        <button onClick={() => menuOpenPopup("about")} style={{ ...mItem, marginTop: 18 }}><span>About SOSA</span></button>
        <button onClick={() => menuOpenPopup("terms")} style={mItem}><span>Terms</span></button>
        <button onClick={() => menuOpenPopup("privacy")} style={mItem}><span>Privacy</span></button>

        <div style={{ marginTop: 18, fontSize: 10, color: "#aaa", lineHeight: 1.7, textAlign: "center", paddingBottom: 16 }}>
          SOPHISTICATED SAMPLES MERCHANDISE · BN 2229053 · CRBN 177764 · sosa.pi v19<br />
          <a href="https://sosa.pi/outfits" target="_blank" rel="noopener noreferrer" style={{ color: "#f5b301" }}>sosa.pi/outfits</a><br />
          <a href={SOSA_APP_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#f5b301", wordBreak: "break-all" }}>{SOSA_APP_URL}</a>
        </div>
      </div>
    </div>
  );

  const popupBox = (title: string, body: any) => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 75, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", color: "#000", width: "100%", maxWidth: 380, maxHeight: "88vh", overflowY: "auto", borderRadius: 16, padding: 18, boxSizing: "border-box" }}>
        <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>{title}</h2>
        {body}
        <button onClick={() => setPopup(null)} style={{ width: "100%", background: "#000", color: "#fff", border: 0, borderRadius: 20, padding: "10px 0", fontWeight: 800, marginTop: 12 }}>Close</button>
      </div>
    </div>
  );
  const linkBtn: any = { display: "block", textAlign: "center", textDecoration: "none", background: "#000", color: "#fff", borderRadius: 20, padding: "10px 0", fontWeight: 800, fontSize: 13, marginTop: 8 };

  // ===== App Tour overlay =====
  const appTourSteps: { title: string; text: string }[] = [
    { title: "Welcome to SOSA", text: "Luxury wears, shoes, bags." },
    { title: "Search + Categories", text: "Find your size fast." },
    { title: "Cart", text: "Tap to see your items." },
    { title: "My Orders", text: "Track Paid / Pending." },
    { title: "Track Order", text: "Menu → Track Order. Enter Phone + Order Code to track delivery." },
    { title: "Leadership Board", text: "Menu → Leadership Board. Earn 10 pts per 1 Pi." },
    { title: "Share App", text: "Invite a friend, earn on their first order." },
  ];
  const tourCur = appTourSteps[appTourStep - 1];
  const TR = appTourRect;
  const tourPane: any = { position: "fixed", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)" };
  const appTourUI = appTourOpen && tourCur ? (
    <div onClick={(e) => e.stopPropagation()} style={{ position: "fixed", inset: 0, zIndex: 90, display: "flex", justifyContent: "center", alignItems: TR ? "flex-end" : "center", padding: 12, boxSizing: "border-box" }}>
      {TR ? (
        <>
          <div style={{ ...tourPane, top: 0, left: 0, right: 0, height: Math.max(0, TR.top - 6) }} />
          <div style={{ ...tourPane, top: TR.top + TR.height + 6, left: 0, right: 0, bottom: 0 }} />
          <div style={{ ...tourPane, top: Math.max(0, TR.top - 6), left: 0, width: Math.max(0, TR.left - 6), height: TR.height + 12 }} />
          <div style={{ ...tourPane, top: Math.max(0, TR.top - 6), left: TR.left + TR.width + 6, right: 0, height: TR.height + 12 }} />
          <div style={{ position: "fixed", top: TR.top - 6, left: TR.left - 6, width: TR.width + 12, height: TR.height + 12, border: "3px dotted #f5b301", borderRadius: 14, pointerEvents: "none", boxSizing: "border-box" }} />
        </>
      ) : (
        <div style={{ ...tourPane, inset: 0 }} />
      )}
      <div style={{ position: "relative", zIndex: 2, background: "#fff", color: "#000", width: "100%", maxWidth: 340, maxHeight: "80vh", overflowY: "auto", borderRadius: 16, padding: 14, boxSizing: "border-box" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#777" }}>{"Step " + appTourStep + " / 7"}</div>
        <h2 style={{ margin: "4px 0 4px", fontSize: 16, lineHeight: 1.25 }}>{tourCur.title}</h2>
        <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: "#333" }}>{tourCur.text}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
          <button onClick={skipAppTour} style={{ background: "#e0e0e0", color: "#555", border: 0, borderRadius: 20, padding: "8px 14px", fontSize: 12, fontWeight: 700 }}>Skip Tour</button>
          <div style={{ display: "flex", gap: 6 }}>
            {appTourStep > 1 && <button onClick={() => setAppTourStep(appTourStep - 1)} style={{ background: "#fff", color: "#000", border: "1px solid #000", borderRadius: 20, padding: "8px 14px", fontSize: 12, fontWeight: 700 }}>Back</button>}
            {appTourStep < 7
              ? <button onClick={() => setAppTourStep(appTourStep + 1)} style={{ background: "#f5b301", color: "#000", border: 0, borderRadius: 20, padding: "8px 18px", fontSize: 12, fontWeight: 800 }}>Next</button>
              : <button onClick={finishAppTour} style={{ background: "#f5b301", color: "#000", border: 0, borderRadius: 20, padding: "8px 18px", fontSize: 12, fontWeight: 800 }}>Finish</button>}
          </div>
        </div>
      </div>
    </div>
  ) : null;

  let popupUI: any = null;
  if (popup === "about") {
    popupUI = popupBox("About SOSA", (
      <div style={{ fontSize: 13, lineHeight: 1.6 }}>
        <p style={{ margin: "0 0 8px" }}>Welcome To SOPHISTICATED SAMPLES, SOSA-outfits - Luxury street general wears, shoes, hand bags, jeans, shirts, natives wears, shopping.</p>
        <p style={{ margin: "0 0 8px" }}>Self Pickup (Free): No. 1, ODICHE STREET, COKER Aguda, ORILE, LAGOS.</p>
        <p style={{ margin: 0 }}>Delivery: 0.0001 Pi (1-2 days Lagos, 4-7 days outside Lagos)</p>
        <p style={{ margin: "10px 0 0" }}><a href={SOSA_MAP} target="_blank" rel="noopener noreferrer" onClick={(e) => openExternal(e, SOSA_MAP)} style={{ color: "#b45309", fontWeight: 800 }}>📍 Sosa Map - Get Directions</a></p>
      </div>
    ));
  } else if (popup === "terms") {
    popupUI = popupBox("Terms", <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}>SOSA Outfits Terms - Payment is in Pi. Goods are reserved only after Pi Payment is confirmed. Saved List orders are NOT reserved.</p>);
  } else if (popup === "privacy") {
    popupUI = popupBox("Privacy", <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}>SOSA Outfits Privacy - We only use your name, phone, and order to deliver your goods. We do not share your data.</p>);
  } else if (popup === "share") {
  const refName = (user || "chijoe09").replace("@", "").trim();
  const referralLink = `https://sossa-v19.vercel.app/?ref=${refName}`;
  const enc = encodeURIComponent(referralLink);
  popupUI = popupBox("Share App", (
    <div>
      <p style={{ fontSize: 12, color: "#555", margin: "0 0 4px", wordBreak: "break-all" }}>Your referral link:</p>
      <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 8px", wordBreak: "break-all" }}>{referralLink}</p>
      <a href={"https://wa.me/?text=" + encodeURIComponent("SOSA Outfits - Sophisticated Samples " + referralLink)} target="_blank" rel="noopener noreferrer" style={linkBtn}>WhatsApp</a>
      <a href={"https://www.facebook.com/sharer/sharer.php?u=" + enc} target="_blank" rel="noopener noreferrer" style={linkBtn}>Facebook</a>
      <a href={"https://twitter.com/intent/tweet?url=" + enc + "&text=" + encodeURIComponent("SOSA Outfits - Sophisticated Samples")} target="_blank" rel="noopener noreferrer" style={linkBtn}>X (Twitter)</a>
      <button onClick={copyLink} style={{ ...linkBtn, width: "100%", border: 0, background: "#f5b301", color: "#000" }}>{copyMsg || "Copy Link"}</button>
      {copyMsg && <p style={{ fontSize: 12, fontWeight: 700, margin: "8px 0 0", wordBreak: "break-all" }}>{copyMsg}</p>}
    </div>
  ));
}
 else if (popup === "tour") {
  popupUI = popupBox("Welcome to SOSA!", (
    <div>
      <p>You were invited by a friend</p>
      <p>1. Shop luxury wears</p>
      <p>2. Add to Cart - Pay with Pi</p>
      <p>3. Earn points on Leadership Board</p>
      <button onClick={() => setPopup("")}>Start Shopping</button>
    </div>
  ));
}else if (popup === "rate") {
    popupUI = popupBox("⭐ Rate Us", myRating ? (
      <div style={{ fontSize: 14, lineHeight: 1.6 }}>
        <p style={{ margin: 0, fontWeight: 800 }}>Thanks, you rated {myRating.stars} stars</p>
        {myRating.comment ? <p style={{ margin: "6px 0 0", fontSize: 12, color: "#555" }}>{myRating.comment}</p> : null}
      </div>
    ) : (
      <div>
        <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} aria-label={n + " star"} onClick={() => setRateStars(n)} style={{ background: "transparent", border: 0, fontSize: 30, padding: 2, color: n <= rateStars ? "#f5b301" : "#ccc" }}>★</button>
          ))}
        </div>
        <textarea value={rateComment} onChange={(e) => setRateComment(e.target.value)} placeholder="Write a comment (optional)" rows={3} style={{ width: "100%", boxSizing: "border-box", padding: 10, borderRadius: 10, border: "1px solid #ccc", fontSize: 14, marginTop: 8 }} />
        {rateMsg && <p style={{ fontSize: 12, color: "#b00020", fontWeight: 700, margin: "6px 0 0" }}>{rateMsg}</p>}
        <button onClick={submitRating} style={{ width: "100%", background: "#f5b301", color: "#000", border: 0, borderRadius: 20, padding: "10px 0", fontWeight: 800, marginTop: 8 }}>Submit</button>
      </div>
    ));
  } else if (popup === "track") {
    const t = trackResult;
    popupUI = popupBox("📦 Track Order", (
      <div>
        <p style={{ fontSize: 12, color: "#555", margin: "0 0 4px" }}>Enter Phone + Order Code / Barcode (e.g. SOSA-...)</p>
        <input type="tel" inputMode="tel" autoComplete="tel" pattern="[0-9+ ]*" value={trackPhone} onChange={(e) => setTrackPhone(e.target.value)} placeholder="Phone Number used at checkout" style={{ ...inputStyle, border: "1px solid #ccc" }} />
        <input value={trackCode} onChange={(e) => setTrackCode(e.target.value)} placeholder="Order Code / Barcode e.g. SOSA-1120-203015-7391" style={{ ...inputStyle, border: "1px solid #ccc" }} />
        <button onClick={doTrack} style={{ width: "100%", background: "#f5b301", color: "#000", border: 0, borderRadius: 20, padding: "10px 0", fontWeight: 800, marginTop: 8 }}>Track</button>
        {t === "need" && <p style={{ fontSize: 12, color: "#b00020", fontWeight: 700 }}>Please enter your phone number and the order code.</p>}
        {t && t.error === "none" && <div style={{ fontSize: 12, color: "#b00020", fontWeight: 700, marginTop: 8 }}><p style={{ margin: 0 }}>{"No order found for Phone " + t.phone + " + Code " + t.code + ". Check My Orders for the exact code."}</p>{t.hint ? <p style={{ margin: "4px 0 0" }}>{t.hint}</p> : null}</div>}
        {t && typeof t === "object" && !t.error && (
          <div style={{ border: "1px solid #eee", borderRadius: 10, padding: 10, marginTop: 10 }}>
            <div style={{ fontSize: 11, color: "#777" }}>{t.date}</div>
            <div style={{ fontSize: 13, fontWeight: 800 }}>Order {t.code}</div>
            <div style={{ fontSize: 12 }}><b>Name:</b> {t.fullName} • <b>Phone:</b> {t.phone}</div>
            {(t.items || []).map((it: any, j: number) => <div key={j} style={{ fontSize: 12 }}>• {it.name} - {it.color} / {it.size} x {it.qty} - {it.price}</div>)}
            <div style={{ fontSize: 13, fontWeight: 800, marginTop: 4 }}>Total: {t.total} Pi</div>
            <div style={{ fontSize: 12 }}><b>Delivery Type:</b> {t.deliveryType === "pickup" ? "Self Pickup (Free)" : "Delivery"}</div>
            <div style={{ fontSize: 12 }}><b>Address:</b> {t.deliveryType === "delivery" ? t.address : "No. 1, ODICHE STREET, COKER Aguda, ORILE, LAGOS."}</div>
            <div style={{ fontSize: 12, color: "green", fontWeight: 700 }}><b style={{ color: "#000" }}>Current Status:</b> {t.status}</div>
            <div style={{ fontSize: 12 }}><b>Estimated:</b> {t.deliveryType === "delivery" ? "1-2 days Lagos, 4-7 days outside Lagos" : "Ready for pickup after payment is confirmed"}</div>
            <div style={{ fontSize: 10, color: "#777", marginTop: 2 }}>Order stages: Pending, Preparing, Shipped, Delivered, Picked Up, Pay on Pickup</div>
            <Barcode code={t.code} />
            <button onClick={() => shareOrderWA(t)} style={{ width: "100%", background: "#25D366", color: "#000", border: 0, borderRadius: 20, padding: "10px 0", fontWeight: 800, marginTop: 8 }}>Share Order to WhatsApp</button>
          </div>
        )}
      </div>
    ));
  }
    return (
    <div style={{ background: bg, color: mainText, minHeight: "100vh", fontFamily: "Arial, sans-serif", paddingBottom: 20 }}>
      {stuckBox}
      {menuUI}
      {popupUI}
      {appTourUI}
      <div style={{ padding: "12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start" }}>
            <button id="tour-menu" onClick={() => setMenuOpen(true)} style={{ background: "#f5b301", color: "#000", border: 0, borderRadius: 20, padding: "5px 10px", fontSize: 11, fontWeight: 800 }}>☰ Menu</button>
            <SosaLogo />
          </div>
          <div>
            <h1 style={{ fontSize: 22, lineHeight: 1.1, margin: 0, fontWeight: 900 }}>SOPHISTICATED<br />SAMPLES</h1>
            <p style={{ fontSize: 14, margin: "4px 0 0", fontWeight: 900, color: mainText }}>SOSA Outfits</p>
            <p style={{ fontSize: 12, margin: "2px 0 0", fontWeight: 800, color: "#f5b301" }}>Logged in as @{user}{ratingAvg ? <span style={{ marginLeft: 8 }}>★ {ratingAvg}</span> : null}</p>
            <p style={{ fontSize: 11, margin: "2px 0 0", color: subText2 }}>Test Pi | {myPoints.toFixed(1)} pts | 18 Products</p>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 6, flexShrink: 0 }}>
          <button onClick={() => setDark(!dark)} style={{ background: dark ? "#f5b301" : "#000", color: dark ? "#000" : "#fff", border: 0, borderRadius: 20, padding: "6px 10px", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{dark ? "☀️ Light" : "🌙 Dark"}</button>
          <button id="tour-share" onClick={shareApp} style={{ background: "#f5b301", color: "#000", border: 0, borderRadius: 20, padding: "6px 10px", fontSize: 11, fontWeight: 700 }}>Share App</button>
        </div>
      </div>
      <div style={{ padding: "0 12px", display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button onClick={() => setPanel("logout")} style={btnStyle}>Logout</button>
        <button id="tour-cart" onClick={() => setPanel("cart")} style={{ ...btnStyle, display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ position: "relative", display: "inline-block", fontSize: 16, lineHeight: 1, marginRight: 6 }}>🛒<span style={{ position: "absolute", top: -7, right: -9, minWidth: 15, height: 15, borderRadius: 8, background: "#e53935", color: "#fff", fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px", boxSizing: "border-box", lineHeight: 1 }}>{cartCount}</span></span>Cart - {subtotal.toFixed(2)} Pi</button>
        <button id="tour-orders" onClick={() => setPanel("orders")} style={btnStyle}>My Orders</button>
      </div>
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." id="tour-search" style={{ display: "block", width: "calc(100% - 16px)", boxSizing: "border-box", margin: "8px 8px 0", height: 34, padding: "0 12px", borderRadius: 20, border: "none", fontSize: 13, background: "#fff", color: "#000" }} />
      <div id="tour-cats" style={{ display: "flex", gap: 6, padding: "6px 8px 0", overflowX: "auto" }}>
        {["All", "Heel", "Flat", "Palm Slide", "Bag"].map((c) => (
          <button key={c} onClick={() => setCategory(c)} style={{ flexShrink: 0, border: 0, borderRadius: 20, padding: "4px 11px", fontSize: 11, fontWeight: 700, background: category === c ? "#f5b301" : (dark ? "#222" : "#ddd"), color: category === c ? "#000" : mainText }}>{c}</button>
        ))}
      </div>
      {visibleProducts.length === 0 && <p style={{ padding: "12px 12px 0", fontSize: 13, fontWeight: 700 }}>{'No products found for "' + search.trim() + '"'}</p>}
      {visibleProducts.length > 0 && <div key={visibleProducts.map((p) => p.id).join(",")}><Slideshow products={visibleProducts} getChoice={getChoice} onOpen={(p: any) => { const ch = getChoice(p); setSelected({ ...p, size: ch.size, color: ch.color }); }} /></div>}
      <p style={{ padding: "0 12px", fontSize: 12 }}>👇 Tap any product TO SEE details before you buy. 18 Products - Grid View</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 6, padding: 8 }}>
        {visibleProducts.map((p) => {
          const ch = getChoice(p);
          return (
          <div key={p.id} style={cardBox}>
            <div style={imgBox}>
              <div style={{ color: "#f5b301", fontSize: 7.5, fontWeight: 700, lineHeight: 1.2 }}>{p.cat}</div>
              <div style={{ color: "#aaa", fontSize: 7.5, lineHeight: 1.2 }}>📷 Photo Coming Soon</div>
            </div>
            <div style={bodyBox}>
              <div style={nameSt}>{p.name}</div>
              <div style={priceSt}>{p.price} • {ch.color}</div>
              <div style={descSt}>{p.desc}</div>
              <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
                <div style={{ display: "flex", gap: 3 }}>
                  <select value={ch.size} onChange={(e) => setChoices({ ...choices, [p.id]: { ...ch, size: e.target.value } })} style={selSt}>{SIZES.map((s) => <option key={s} value={s}>{s}</option>)}</select>
                  <select value={ch.color} onChange={(e) => setChoices({ ...choices, [p.id]: { ...ch, color: e.target.value } })} style={selSt}><option>Black</option><option>Red</option><option>Gold</option><option>Silver</option></select>
                </div>
                <div style={{ display: "flex", gap: 3 }}>
                  <button onClick={() => setSelected({ ...p, size: ch.size, color: ch.color })} style={{ ...cardBtn, background: "#000", color: "#fff" }}>👁 View</button>
                  <button onClick={() => addToCart(p)} style={{ ...cardBtn, background: "#f5b301", color: "#000" }}>Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
          );
        })}
      </div>
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: "#fff", color: "#000", width: "100%", maxWidth: 480, borderRadius: "16px 16px 0 0", padding: 16 }}>
            <button onClick={() => setSelected(null)} style={{ background: "#000", color: "#fff", border: 0, borderRadius: 20, padding: "6px 12px", fontSize: 12 }}>← Back to Shop</button>
            <div style={{ background: "#000", textAlign: "center", padding: 14, borderRadius: 10, marginTop: 10 }}>
              <div style={{ color: "#f5b301", fontSize: 10, fontWeight: 700 }}>{selected.cat}</div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>{selected.name}</div>
              <div style={{ color: "#aaa", fontSize: 10 }}>📷 Photo Coming Soon</div>
            </div>
            <p style={{ fontWeight: 800, margin: "10px 0 0" }}>{selected.name}</p>
            <p style={{ color: "#b45309", fontWeight: 800, margin: "4px 0" }}>{selected.price} • Colour: {selected.color} • Size: {selected.size}</p>
            <p style={{ fontSize: 13, color: "#444" }}>{selected.desc}</p>
            <button onClick={() => { addToCart(selected); setSelected(null); }} style={{ width: "100%", background: "#f5b301", border: 0, borderRadius: 20, padding: "10px 0", fontWeight: 800, marginTop: 10 }}>Add to Cart - {selected.price}</button>
          </div>
        </div>
      )}
      {panel === "cart" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 60, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: "#000", color: "#fff", width: "100%", maxWidth: 480, maxHeight: "92vh", overflowY: "auto", borderRadius: "16px 16px 0 0", padding: 16 }}>
            <button onClick={() => { setPanel(null); setPayStatus(""); }} style={{ background: "#fff", color: "#000", border: 0, borderRadius: 20, padding: "6px 12px", fontSize: 12, fontWeight: 700 }}>← Back to Shop</button>
            <h2 style={{ margin: "14px 0", fontSize: 26 }}>Your Cart</h2>
            {payStatus && <div style={{ background: "#fff3cd", color: "#000", borderRadius: 8, padding: 10, fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{payStatus}</div>}
            {cart.length === 0 && <p style={{ fontSize: 13, color: "#ccc" }}>Your cart is empty. Tap Add to Cart on any product.</p>}
            {cart.map((item) => (
              <div key={item.key} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, background: "#111", borderRadius: 10, padding: "12px 12px" }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{item.name} - {item.color} / {item.size} - {item.price} x {item.qty}</span>
                  <button onClick={() => removeItem(item.key)} style={{ width: 30, height: 30, minWidth: 30, borderRadius: "50%", background: "#ff0000", color: "#fff", border: 0, fontWeight: 900, fontSize: 14 }}>X</button>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, paddingLeft: 4 }}>
                  <button onClick={() => dec(item.key)} style={{ width: 30, height: 30, borderRadius: "50%", border: "1px solid #555", background: "#222", color: "#fff", fontSize: 18, fontWeight: 900 }}>−</button>
                  <span style={{ fontWeight: 800, fontSize: 14 }}>{item.qty}</span>
                  <button onClick={() => inc(item.key)} style={{ width: 30, height: 30, borderRadius: "50%", border: 0, background: "#f5b301", color: "#000", fontSize: 18, fontWeight: 900 }}>+</button>
                </div>
              </div>
            ))}
            <p style={{ fontSize: 16, fontWeight: 800, margin: "10px 0" }}>Total: {subtotal.toFixed(2)} Pi</p>
            <h3 style={{ fontSize: 18, margin: "16px 0 6px" }}>--- CHECKOUT DETAILS ---</h3>
            <div style={{ background: "#111", borderRadius: 10, padding: 10, marginBottom: 4 }}>
              <div style={{ fontSize: 13, fontWeight: 800 }}>Buying as @{user}</div>
              <button onClick={() => logout()} style={{ marginTop: 6, background: "#fff", color: "#000", border: 0, borderRadius: 20, padding: "6px 12px", fontSize: 12, fontWeight: 700 }}>Not you? Logout and Login as yourself</button>
            </div>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name *" style={inputStyle} />
            <input type="tel" inputMode="tel" autoComplete="tel" pattern="[0-9+ ]*" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number / WhatsApp *" style={inputStyle} />
            <p style={{ fontSize: 13, lineHeight: 1.6, margin: "14px 0 0" }}>🏪 Self Pickup (Free): No. 1, ODICHE STREET, COKER Aguda, ORILE, LAGOS.</p>
            <p style={{ fontSize: 13, lineHeight: 1.6, margin: "6px 0 10px" }}>🚚 Delivery: 0.0001 Pi (1-2 days Lagos, 4-7 days outside Lagos)</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setDeliveryType("delivery")} style={{ flex: 1, padding: "12px 6px", borderRadius: 10, border: 0, background: deliveryType === "delivery" ? "#f5a301" : "#333", color: deliveryType === "delivery" ? "#000" : "#fff", fontWeight: 800, fontSize: 12 }}>🚚 Delivery (+0.0001 Pi)</button>
              <button onClick={() => setDeliveryType("pickup")} style={{ flex: 1, padding: "12px 6px", borderRadius: 10, border: 0, background: deliveryType === "pickup" ? "#f5a301" : "#333", color: deliveryType === "pickup" ? "#000" : "#fff", fontWeight: 800, fontSize: 12 }}>🏪 Self Pickup (Free)</button>
            </div>
            {deliveryType === "delivery" && <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Delivery Address - House No, Street, Area, City, State *" rows={2} style={{ ...inputStyle, resize: "vertical" as any }} />}
            {deliveryType === "pickup" && <p style={{ fontSize: 12, color: "#ccc", marginTop: 10 }}>Pickup at No.1 ODICHE STREET, COKER Aguda, ORILE, LAGOS. No address needed.</p>}
            <p style={{ fontSize: 15, fontWeight: 800, margin: "14px 0" }}>Grand Total: {grandTotal} Pi {deliveryType === "delivery" ? "(incl. delivery - 1-2 days Lagos, 4-7 days outside Lagos)" : "(pickup - free)"}</p>
            {cart.length > 0 && <Barcode code={orderCode} />}
            {cart.length > 0 && <p style={{ fontSize: 13, fontWeight: 800, margin: "12px 0 0", lineHeight: 1.4 }}>Pay Now = Your goods are secured. Pay Later = Your list is only saved, goods are NOT reserved.</p>}
            {cart.length > 0 && <button onClick={checkout} disabled={paying} style={{ opacity: paying ? 0.6 : 1, width: "100%", background: "#f5b301", color: "#000", border: 0, borderRadius: 20, padding: "12px 0", fontWeight: 800, marginTop: 12 }}>{paying ? "⏳ Preparing payment... please wait, do not tap again" : "Pay with Pi - " + grandTotal + " Pi"}</button>}
            {cart.length > 0 && <button onClick={() => { if (!fullName.trim() || !phone.trim()) { setPayStatus("❌ Enter Full Name + Phone first."); return; } saveOrder("⏳ PENDING - Saved List Only, NOT Reserved - Pay on Pickup / WhatsApp", "", orderCode); }} style={{ width: "100%", background: "#fff", color: "#000", border: 0, borderRadius: 20, padding: "11px 0", fontWeight: 800, marginTop: 8 }}>Save List for Pickup - Pay When You Come (Not Reserved)</button>}
            {cart.length > 0 && <div style={{ background: "#111", color: "#ccc", borderRadius: 8, padding: 8, fontSize: 11, lineHeight: 1.5, marginTop: 6 }}>What does this mean? This only saves your list. We have NOT booked or reserved your shoes. No payment has been taken. Your goods are NOT kept aside. First person to pay gets the goods. When you come to the shop, show your barcode SOSA-XXXXXX, then pay with Pi, transfer or cash, then collect your goods. If you don&apos;t come within 24 hours, this saved list will expire.</div>}
            <button onClick={() => { setPanel(null); setPayStatus(""); }} style={{ width: "100%", background: "transparent", color: "#fff", border: 0, padding: "10px 0", fontWeight: 700 }}>← Back to Shop</button>
          </div>
        </div>
      )}
      {panel === "orders" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 60, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: "#fff", color: "#000", width: "100%", maxWidth: 480, maxHeight: "85vh", overflowY: "auto", borderRadius: "16px 16px 0 0", padding: 16 }}>
            <button onClick={() => setPanel(null)} style={{ background: "#000", color: "#fff", border: 0, borderRadius: 20, padding: "6px 12px", fontSize: 12 }}>← Back to Shop</button>
            <h2 style={{ margin: "10px 0" }}>📦 My Orders ({orders.length})</h2>
            {orders.length === 0 && <p style={{ fontSize: 13, color: "#555" }}>No orders yet.</p>}
            {orders.map((o) => (
              <div key={o.id} style={{ border: "1px solid #eee", borderRadius: 10, padding: 10, marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: "#777" }}>{o.date}</div>
                <div style={{ fontSize: 12 }}><b>Name:</b> {o.fullName} • <b>Phone:</b> {o.phone}</div>
                <div style={{ fontSize: 12 }}><b>{o.deliveryType === "pickup" ? "🏪 Self Pickup (Free)" : "🚚 Delivery"}</b> {o.deliveryType === "delivery" ? "- " + o.address : "- ODICHE STREET, COKER"}</div>
                <div style={{ fontWeight: 800, fontSize: 13 }}>Grand Total: {o.total} Pi (Subtotal {o.subtotal} + Fee {o.deliveryFee})</div>
                {o.items.map((it: any, j: number) => <div key={j} style={{ fontSize: 12 }}>• {it.name} - {it.color} / {it.size} x {it.qty} - {it.price}</div>)}
                <div style={{ fontSize: 12, color: "green", fontWeight: 700, marginTop: 4 }}>{o.status}</div>
                {o.status && o.status.includes("PENDING") && <div style={{ fontSize: 11, color: "#555", background: "#fff3cd", borderRadius: 6, padding: 6, marginTop: 4, lineHeight: 1.4 }}>This order is NOT reserved. Your shoes are still available for other customers to buy. To secure your goods, pay now. To pay later, come to the shop with this barcode within 24 hours.</div>}
                {o.txid && <div style={{ fontSize: 11, color: "#555", wordBreak: "break-all" }}>Tx: {o.txid}</div>}
                <Barcode code={o.code} />
              </div>
            ))}
          </div>
        </div>
      )}
      {panel === "board" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 60, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: "#fff", color: "#000", width: "100%", maxWidth: 480, maxHeight: "85vh", overflowY: "auto", borderRadius: "16px 16px 0 0", padding: 16 }}>
            <button onClick={() => setPanel(null)} style={{ background: "#000", color: "#fff", border: 0, borderRadius: 20, padding: "6px 12px", fontSize: 12 }}>← Back to Shop</button>
            <h2 style={{ margin: "10px 0 4px" }}>🏆 Leadership Board</h2>
            {boardTop.map((u, i) => (
              <div key={u.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", padding: "10px 6px", background: u.you ? "#ffe066" : "transparent", borderRadius: u.you ? 8 : 0 }}>
                <span style={{ fontWeight: 800, fontSize: 13 }}>#{i + 1} {u.name}{u.you ? <span style={{ marginLeft: 6, background: "#000", color: "#f5b301", borderRadius: 10, padding: "1px 7px", fontSize: 10 }}>(You)</span> : null}</span>
                <span style={{ color: "#b45309", fontWeight: 800 }}>{u.pts.toFixed(1)} pts</span>
              </div>
            ))}
            {myBoardIdx >= 4 && <div style={{ marginTop: 10, background: "#ffe066", borderRadius: 8, padding: "10px 6px", fontWeight: 800, fontSize: 13 }}>Your Rank: #{myBoardIdx + 1} - {myPoints.toFixed(1)} pts</div>}
          </div>
        </div>
      )}
      {panel === "logout" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", color: "#000", width: "100%", maxWidth: 360, borderRadius: 16, padding: 20, textAlign: "center" }}>
            <h2 style={{ margin: "0 0 8px" }}>Logout?</h2>
            <p style={{ fontSize: 13, color: "#555" }}>You are logged in as @{user}.</p>
            <button onClick={() => setPanel(null)} style={{ width: "100%", background: "#000", color: "#fff", border: 0, borderRadius: 20, padding: "10px 0", fontWeight: 800, marginTop: 10 }}>Stay Logged In</button>
            <button onClick={() => logout()} style={{ width: "100%", background: "#eee", border: 0, borderRadius: 20, padding: "10px 0", fontWeight: 800, marginTop: 8 }}>Yes, Logout</button>
          </div>
        </div>
      )}
      <div style={{ textAlign: "center", fontSize: 10, color: subText2, padding: "10px 10px 0" }}>SOSA © 2026 • Made in Nigeria • Pickup No.1 ODICHE STREET, COKER Aguda, ORILE, LAGOS<br />• Owner •</div>
      <div style={{ textAlign: "center", marginTop: 12 }}>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ background: dark ? "#fff" : "#000", color: dark ? "#000" : "#fff", border: 0, borderRadius: 20, padding: "8px 18px", fontSize: 12, fontWeight: 800 }}>^<br />Back Up</button>
      </div>
    </div>
  );
}
