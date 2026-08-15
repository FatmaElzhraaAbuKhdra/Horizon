"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { type Locale, t } from "@/lib/i18n";
import Navbar from "./Navbar";
import { RegisterModal, TourModal, EventModal } from "./Modals";
import { Toast, inputStyle, btnPrimary } from "./Modal";

type ToastMsg = { title: string; desc: string; type: "success" | "error" } | null;

// ─── Brand ─────────────────────────────────────────────────────────────────────
const C = {
  primary:   "#7A24B2",
  dark:      "#2D0864",
  gold:      "#B300C4",
  goldLight: "#FDE8FF",
  bg:        "#F5F5F5",
  border:    "#E8E0F5",
  muted:     "#5A5A5A",
  light:     "#8A8A8A",
};

// ─── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
  html, body { overflow-x: hidden; }

  /* Programme cards */
  .prog-card {
    position: relative; overflow: hidden;
    transition: transform .32s cubic-bezier(.22,.68,0,1.2), box-shadow .32s ease;
  }
  .prog-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, #7A24B2, #B300C4, #7A24B2);
    transform: scaleX(0); transform-origin: left; transition: transform .4s ease;
  }
  .prog-card:hover::before { transform: scaleX(1); }
  .prog-card:hover { transform: translateY(-10px); box-shadow: 0 24px 60px rgba(90,23,133,.18); }
  .prog-card .prog-icon { transition: transform .3s ease; }
  .prog-card:hover .prog-icon { transform: scale(1.15) rotate(-6deg); }

  .tm-card { transition: transform .28s ease, box-shadow .28s ease; }
  .tm-card:hover { transform: translateY(-5px); box-shadow: 0 18px 50px rgba(90,23,133,.11); }

  /* Testimonials slider */
  .tm-slider-wrap { position: relative; overflow: hidden; }
  .tm-slider-track { display: flex; transition: transform .55s cubic-bezier(.22,1,.36,1); will-change: transform; }
  .tm-slide { flex: 0 0 100%; padding: 0 1rem; }
  .tm-dots { display: flex; gap: 8px; justify-content: center; margin-top: 2rem; }
  .tm-dot { width: 8px; height: 8px; border-radius: 50%; background: #D5C8E8; border: none; cursor: pointer; padding: 0; transition: all .25s; }
  .tm-dot.active { width: 24px; border-radius: 4px; background: #B300C4; }
  .tm-arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%; background: #fff; border: 1.5px solid #E8E0F5; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; color: #2D0864; box-shadow: 0 4px 16px rgba(90,23,133,.10); transition: all .2s; z-index: 2; }
  .tm-arrow:hover { background: #2D0864; color: #fff; border-color: #2D0864; transform: translateY(-50%) scale(1.08); }
  .tm-arrow-prev { left: -22px; }
  .tm-arrow-next { right: -22px; }

  .info-card { transition: transform .25s ease, border-color .25s, box-shadow .25s; }
  .info-card:hover {
    border-color: #B300C4 !important;
    box-shadow: 0 6px 24px rgba(179,0,196,.15) !important;
    transform: translateX(4px);
  }

  /* Buttons */
  .btn-glow { transition: all .28s ease; }
  .btn-glow:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(179,0,196,.4) !important; }
  .btn-ghost-w { transition: all .28s ease; }
  .btn-ghost-w:hover { background: rgba(255,255,255,.14) !important; transform: translateY(-2px); }

  /* Steps */
  .step-num { transition: transform .25s ease, box-shadow .25s; }
  .step-num:hover { transform: scale(1.12) rotate(6deg); box-shadow: 0 8px 28px rgba(179,0,196,.4); }

  /* Footer */
  .social-icon { transition: all .22s ease; }
  .social-icon:hover { background: #B300C4 !important; border-color: #B300C4 !important; color: #fff !important; transform: translateY(-3px); }
  .footer-lnk { transition: color .2s; }
  .footer-lnk:hover { color: #FDE8FF !important; }

  /* Inputs */
  .input-anim:focus {
    outline: none;
    border-color: #7A24B2 !important;
    box-shadow: 0 0 0 4px rgba(122,36,178,.12) !important;
  }

  /* Keyframes */
  @keyframes dotPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: .45; transform: scale(1.7); }
  }
  @keyframes goldPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(179,0,196,.5); }
    50%       { box-shadow: 0 0 0 12px rgba(179,0,196,0); }
  }
  @keyframes shimmerLine {
    0%   { background-position: -300% center; }
    100% { background-position: 300% center; }
  }
  @keyframes flipDown {
    from { opacity: 0; transform: perspective(400px) rotateX(-70deg) translateY(-8px); }
    to   { opacity: 1; transform: perspective(400px) rotateX(0deg) translateY(0); }
  }
  @keyframes floatA {
    0%, 100% { transform: translate(0,0); }
    33%       { transform: translate(28px,-36px); }
    66%       { transform: translate(-18px,22px); }
  }
  @keyframes floatB {
    0%, 100% { transform: translate(0,0); }
    40%       { transform: translate(-24px,28px); }
    70%       { transform: translate(30px,-14px); }
  }
  @keyframes orbPulse {
    0%, 100% { transform: scale(1); opacity: .12; }
    50%       { transform: scale(1.35); opacity: .06; }
  }

  /* Responsive */
  @media (max-width: 900px) {
    .about-grid   { grid-template-columns: 1fr !important; }
    .contact-grid { grid-template-columns: 1fr !important; }
    .footer-grid  { grid-template-columns: 1fr 1fr !important; }
    .hero-stats   { grid-template-columns: repeat(2,1fr) !important; }
    .cd-wrap      { display: none !important; }
    .event-grid   { grid-template-columns: 1fr !important; }
    .steps-grid   { grid-template-columns: repeat(2,1fr) !important; }
    .sec-pad      { padding-top: 3.5rem !important; padding-bottom: 3.5rem !important; }
    .feat-pad     { padding-top: 2.5rem !important; padding-bottom: 2.5rem !important; }
    .about-img img { height: 280px !important; }
    .gallery-img-wrap { aspect-ratio: 16/7 !important; }
    .tm-slider-wrap { padding: 0 28px !important; }
    .tm-arrow-prev  { left: -14px !important; }
    .tm-arrow-next  { right: -14px !important; }
  }

  @media (max-width: 600px) {
    .footer-grid  { grid-template-columns: 1fr !important; }
    .steps-grid   { grid-template-columns: 1fr !important; }
    .hero-stats   { grid-template-columns: 1fr 1fr !important; }
    .sec-pad      { padding-top: 2.5rem !important; padding-bottom: 2.5rem !important; }
    .feat-pad     { padding-top: 2rem !important; padding-bottom: 2rem !important; }
    .tm-arrow     { width: 36px !important; height: 36px !important; font-size: 15px !important; }
    .tm-card      { padding: 2rem 1.5rem !important; }
    .gallery-img-wrap { aspect-ratio: 4/3 !important; }
    .gallery-arrow { width: 36px !important; height: 48px !important; font-size: 18px !important; }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* ── Hero entry animations (CSS, no JS needed) ── */
  @keyframes heroIn {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: none; }
  }
  .hero-badge    { animation: heroIn .6s cubic-bezier(.22,1,.36,1) .05s both; }
  .hero-line:nth-child(1) { animation: heroIn .65s cubic-bezier(.22,1,.36,1) .15s both; }
  .hero-line:nth-child(2) { animation: heroIn .65s cubic-bezier(.22,1,.36,1) .27s both; }
  .hero-line:nth-child(3) { animation: heroIn .65s cubic-bezier(.22,1,.36,1) .39s both; }
  .hero-sub      { animation: heroIn .55s cubic-bezier(.22,1,.36,1) .48s both; }
  .hero-ctas     { animation: heroIn .5s  cubic-bezier(.22,1,.36,1) .58s both; }
  .hero-stats    { animation: heroIn .5s  cubic-bezier(.22,1,.36,1) .68s both; }

  /* ── Scroll reveal base states (revealed via IntersectionObserver + .in class) ── */
  .feat-item {
    opacity: 0; transform: translateY(32px);
    transition: opacity .6s ease, transform .6s ease;
  }
  .feat-item.in { opacity: 1; transform: none; }
  .feat-item:nth-child(2) { transition-delay: .12s; }
  .feat-item:nth-child(3) { transition-delay: .24s; }
  .feat-item:nth-child(4) { transition-delay: .36s; }

  .prog-header, .adm-header {
    opacity: 0; transform: translateY(28px);
    transition: opacity .6s ease, transform .6s ease;
  }
  .prog-header.in, .adm-header.in { opacity: 1; transform: none; }

  .prog-card {
    opacity: 0; transform: translateY(40px) scale(.95);
    transition: opacity .65s ease, transform .65s ease, box-shadow .32s ease;
  }
  .prog-card.in { opacity: 1; transform: none; }
  .prog-card.in:hover { transform: translateY(-10px); box-shadow: 0 24px 60px rgba(90,23,133,.18); }
  .prog-card.in .prog-icon { transition: transform .3s ease; }
  .prog-card.in:hover .prog-icon { transform: scale(1.15) rotate(-6deg); }
  .prog-card:nth-child(2) { transition-delay: .10s; }
  .prog-card:nth-child(3) { transition-delay: .20s; }
  .prog-card:nth-child(4) { transition-delay: .30s; }

  .step-item {
    opacity: 0; transform: translateY(35px);
    transition: opacity .6s ease, transform .6s ease;
  }
  .step-item.in { opacity: 1; transform: none; }
  .step-item:nth-child(2) { transition-delay: .14s; }
  .step-item:nth-child(3) { transition-delay: .28s; }
  .step-item:nth-child(4) { transition-delay: .42s; }
  .step-item:nth-child(5) { transition-delay: .56s; }

  .about-img {
    opacity: 0; transform: translateX(-60px);
    transition: opacity .8s ease, transform .8s ease;
  }
  [dir="rtl"] .about-img { transform: translateX(60px); }
  .about-img.in { opacity: 1; transform: none; }

  .about-text {
    opacity: 0; transform: translateY(28px);
    transition: opacity .65s ease, transform .65s ease;
  }
  .about-text.in { opacity: 1; transform: none; }

  .event-info {
    opacity: 0; transform: translateX(40px);
    transition: opacity .65s ease, transform .65s ease;
  }
  [dir="rtl"] .event-info { transform: translateX(-40px); }
  .event-info.in { opacity: 1; transform: none; }

  .event-countdown {
    opacity: 0; transform: scale(.88);
    transition: opacity .7s .2s ease, transform .7s .2s ease;
  }
  .event-countdown.in { opacity: 1; transform: none; }

  .contact-info {
    opacity: 0; transform: translateX(-40px);
    transition: opacity .7s ease, transform .7s ease;
  }
  [dir="rtl"] .contact-info { transform: translateX(40px); }
  .contact-info.in { opacity: 1; transform: none; }

  .contact-form {
    opacity: 0; transform: translateX(40px);
    transition: opacity .7s .12s ease, transform .7s .12s ease;
  }
  [dir="rtl"] .contact-form { transform: translateX(-40px); }
  .contact-form.in { opacity: 1; transform: none; }
`;

// ─── Canvas Particles ──────────────────────────────────────────────────────────

// ─── Helpers ──────────────────────────────────────────────────────────────────
function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(122,36,178,.08)", color: "#7A24B2", padding: "5px 16px", borderRadius: 40, fontSize: 13, fontWeight: 700, border: "1px solid rgba(122,36,178,.14)", letterSpacing: .4 }}>
      <span style={{ width: 6, height: 6, background: "#7A24B2", borderRadius: "50%", display: "inline-block" }} />
      {children}
    </span>
  );
}

function GoldLine({ center }: { center?: boolean }) {
  return (
    <div style={{ width: 56, height: 3, background: "linear-gradient(90deg,#B300C4,#FDE8FF)", borderRadius: 4, margin: center ? "0 auto" : "0", boxShadow: "0 2px 8px rgba(179,0,196,.35)" }} />
  );
}

function ScrollTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const h = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="btn-glow"
      style={{ position: "fixed", bottom: "2rem", insetInlineStart: "2rem", width: 46, height: 46, background: "#B300C4", color: "#fff", border: "none", borderRadius: 13, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 888, boxShadow: "0 4px 16px rgba(179,0,196,.40)" }}
    >
      ↑
    </button>
  );
}

// ─── DB types ──────────────────────────────────────────────────────────────────
interface DbEvent {
  titleAr: string; titleEn: string; dateAr: string; dateEn: string;
  timeAr: string; timeEn: string; locationAr: string; locationEn: string;
  descAr: string; descEn: string; dateISO: string;
}
interface DbTestimonial {
  textAr: string; textEn: string; name: string;
  roleAr: string; roleEn: string; initials: string;
}

// ─── Gallery Slider ───────────────────────────────────────────────────────────
function GallerySlider({ images, isRtl, dark, gold, bg, speed }: { images: string[]; isRtl: boolean; dark: string; gold: string; bg: string; speed: number }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = images.length;

  useEffect(() => {
    if (paused || total < 2) return;
    const id = setInterval(() => setActive(a => (a + 1) % total), speed * 1000);
    return () => clearInterval(id);
  }, [paused, total, speed]);

  const prev = () => setActive(a => (a - 1 + total) % total);
  const next = () => setActive(a => (a + 1) % total);

  const arrowBtn = (onClick: () => void, side: "left" | "right", label: string) => (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        position: "absolute", top: "50%", [side]: 0,
        transform: "translateY(-50%)",
        width: 48, height: 64,
        background: "rgba(255,255,255,.92)",
        border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, color: "#1A1A1A", zIndex: 2,
        transition: "background .15s",
        borderRadius: side === "left" ? "0 6px 6px 0" : "6px 0 0 6px",
        boxShadow: "0 2px 12px rgba(0,0,0,.15)",
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "#fff")}
      onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,.92)")}
    >
      {side === "left" ? "‹" : "›"}
    </button>
  );

  return (
    <section style={{ background: bg, padding: "4rem 0" }}>
      {/* Header */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem", marginBottom: "2rem" }}>
        <SectionTag>{isRtl ? "معرض الصور" : "Photo Gallery"}</SectionTag>
        <h2 style={{ fontFamily: "Amiri,serif", fontSize: "clamp(26px,3.5vw,42px)", color: dark, margin: "1rem 0 0", lineHeight: 1.3 }}>
          {isRtl ? "لقطات من مدرستنا" : "Glimpses of Our School"}
        </h2>
      </div>

      {/* Full-width slider */}
      <div
        style={{ position: "relative", width: "100%", overflow: "hidden" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Images — only render active + neighbours to avoid loading all at once */}
        <div className="gallery-img-wrap" style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden" }}>
          {images.map((src, i) => {
            const nextI = (active + 1) % total;
            const prevI = (active - 1 + total) % total;
            if (i !== active && i !== nextI && i !== prevI) return null;
            return (
              <div
                key={src}
                style={{
                  position: "absolute", inset: 0,
                  opacity: i === active ? 1 : 0,
                  transform: i === active ? "scale(1)" : "scale(1.03)",
                  transition: "opacity .35s ease, transform .35s ease",
                }}
              >
                <img
                  src={src}
                  alt=""
                  aria-hidden="true"
                  loading={i === active ? "eager" : "lazy"}
                  decoding="async"
                  style={{
                    position: "absolute", inset: 0,
                    width: "100%", height: "100%",
                    objectFit: "cover",
                    filter: "blur(18px) brightness(0.55)",
                    transform: "scale(1.08)",
                    display: "block",
                  }}
                />
                <img
                  src={src}
                  alt=""
                  loading={i === active ? "eager" : "lazy"}
                  decoding="async"
                  style={{
                    position: "absolute", inset: 0,
                    width: "100%", height: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Arrows */}
        {total > 1 && (<>
          {arrowBtn(prev, "left",  isRtl ? "التالي"   : "Previous")}
          {arrowBtn(next, "right", isRtl ? "السابق" : "Next")}
        </>)}

        {/* Dots — show max 12, hidden on very large galleries */}
        {total > 1 && total <= 12 && (
          <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 7, zIndex: 2 }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  width: i === active ? 28 : 8, height: 8,
                  borderRadius: 99, border: "none", cursor: "pointer",
                  background: i === active ? gold : "rgba(255,255,255,.6)",
                  transition: "width .3s ease, background .3s ease",
                  padding: 0, boxShadow: "0 1px 4px rgba(0,0,0,.2)",
                }}
              />
            ))}
          </div>
        )}
        {/* Counter for large galleries */}
        {total > 12 && (
          <div style={{ position: "absolute", bottom: 14, right: 16, background: "rgba(0,0,0,.55)", color: "#fff", fontSize: 13, padding: "3px 10px", borderRadius: 20, zIndex: 2, fontVariantNumeric: "tabular-nums" }}>
            {active + 1} / {total}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function HomePage({ locale, dbEvent, dbTestimonials, aboutImage, galleryImages, heroImage, gallerySpeed }: {
  locale: Locale;
  dbEvent?: DbEvent | null;
  dbTestimonials?: DbTestimonial[] | null;
  aboutImage?: string | null;
  galleryImages?: string[];
  heroImage?: string | null;
  gallerySpeed?: number;
}) {
  const tr    = t[locale];
  const isRtl = locale === "ar";

  // Resolve event from DB or i18n fallback
  const ev = dbEvent ? {
    label:         isRtl ? "فعالية قادمة" : "Upcoming Event",
    title:         isRtl ? dbEvent.titleAr    : dbEvent.titleEn,
    date:          isRtl ? dbEvent.dateAr     : dbEvent.dateEn,
    time:          isRtl ? dbEvent.timeAr     : dbEvent.timeEn,
    location:      isRtl ? dbEvent.locationAr : dbEvent.locationEn,
    desc:          isRtl ? dbEvent.descAr     : dbEvent.descEn,
    btnRegister:   tr.event.btnRegister,
    btnMore:       tr.event.btnMore,
    countdownLabel:tr.event.countdownLabel,
    days: tr.event.days, hours: tr.event.hours, mins: tr.event.mins,
  } : tr.event;

  // Resolve testimonials from DB or i18n fallback
  const testimonialsList = dbTestimonials
    ? dbTestimonials.map(tm => ({
        text:     isRtl ? tm.textAr : tm.textEn,
        name:     tm.name,
        role:     isRtl ? tm.roleAr : tm.roleEn,
        initials: tm.initials,
      }))
    : tr.testimonials.list;

  // ── Modals & Toast ──
  const [showRegister, setShowRegister] = useState(false);
  const [showTour,     setShowTour]     = useState(false);
  const [showEvent,    setShowEvent]    = useState(false);
  const [toast,        setToast]        = useState<ToastMsg>(null);

  // ── Testimonials slider ──
  const [tmIndex, setTmIndex] = useState(0);
  const [tmPaused, setTmPaused] = useState(false);

  // ── Contact form ──
  const [contactForm,    setContactForm]    = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [contactDone,    setContactDone]    = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  // ── Event countdown ──
  const [countdown, setCountdown] = useState({ d: "00", h: "00", m: "00", s: "00" });

  // ── GSAP refs ──
  const counterRef = useRef<HTMLSpanElement>(null);
  const heroRef    = useRef<HTMLElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);
  const featRef    = useRef<HTMLDivElement>(null);
  const aboutRef   = useRef<HTMLElement>(null);
  const progRef    = useRef<HTMLElement>(null);
  const eventRef   = useRef<HTMLElement>(null);
  const admRef     = useRef<HTMLElement>(null);
  const testRef    = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  // ── Countdown timer ──
  useEffect(() => {
    const target = dbEvent?.dateISO ? new Date(dbEvent.dateISO).getTime() : 0;
    if (!target) return;
    const tick = () => {
      const diff = target - Date.now();
      if (diff > 0) setCountdown({
        d: String(Math.floor(diff / 86400000)).padStart(2, "0"),
        h: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0"),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2, "0"),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [dbEvent?.dateISO]);

  // ── Testimonials auto-play ──
  const tmNext = useCallback((len: number) => setTmIndex(i => (i + 1) % len), []);
  const tmPrev = useCallback((len: number) => setTmIndex(i => (i - 1 + len) % len), []);
  useEffect(() => {
    if (tmPaused) return;
    const id = setInterval(() => tmNext(testimonialsList.length), 5000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tmPaused, tmNext]);

  // ── Counter animation (hero watermark number) ──
  useEffect(() => {
    const el = counterRef.current;
    if (!el) return;
    let raf: number;
    let start: number | null = null;
    const duration = 2400;
    const target = 428;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = Math.floor(ease * target);
      el.textContent = isRtl
        ? val.toString().replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[+d])
        : val.toString();
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isRtl]);

  // ── Scroll reveals via IntersectionObserver (replaces GSAP ScrollTrigger) ──
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.08 }
    );
    const targets = document.querySelectorAll(
      ".feat-item, .prog-header, .prog-card, .adm-header, .step-item, .about-img, .about-text, .event-info, .event-countdown, .contact-info, .contact-form"
    );
    targets.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  // ── Contact submit ──
  const submitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email)
      return setToast({ title: "⚠️", desc: tr.validation.required, type: "error" });
    setContactLoading(true);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactForm),
    });
    setContactLoading(false);
    if (res.ok) {
      setContactDone(true);
      setToast({ title: tr.validation.sent, desc: tr.validation.sentDesc, type: "success" });
    }
  };

  const nav = (h: string) => `/${locale}${h}`;

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{CSS}</style>
      <Navbar locale={locale} onRegister={() => setShowRegister(true)} onTour={() => setShowTour(true)} />

      {/* ════════════ HERO ════════════ */}
      <section ref={heroRef} style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "flex-end", background: C.dark, overflow: "hidden" }}>

        {/* ── Hero background ── */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {heroImage
            ? <img src={heroImage} alt={isRtl ? "مدارس الأفق العالمية في الرياض" : "Horizon International Schools Riyadh"} decoding="async" fetchPriority="high" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#3C0E6E 0%,#2D0864 60%,#6B1EA5 100%)" }} />
          }
        </div>

        {/* Dark overlay — bottom-heavy for text readability */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,25,18,.90) 0%, rgba(5,25,18,.55) 45%, rgba(5,25,18,.20) 100%)" }} />

        {/* Subtle gold grain overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(179,0,196,.10) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* ── 428 watermark ── */}
        <div style={{ position: "absolute", top: "50%", ...(isRtl ? { left: "2%" } : { right: "2%" }), transform: "translateY(-50%)", fontSize: "clamp(110px,17vw,260px)", fontWeight: 800, color: "rgba(179,0,196,.06)", lineHeight: 1, fontFamily: "Amiri,serif", userSelect: "none", pointerEvents: "none", letterSpacing: -4, zIndex: 0 }}>
          <span ref={counterRef}>{isRtl ? "٠" : "0"}</span>
        </div>

        {/* Hero content */}
        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "7rem 2rem 5rem", width: "100%", zIndex: 1 }}>

          {/* Badge */}
          <div className="hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(179,0,196,.16)", border: "1px solid rgba(179,0,196,.32)", color: C.goldLight, padding: "7px 18px", borderRadius: 40, fontSize: 13, fontWeight: 600, marginBottom: "1.75rem", backdropFilter: "blur(8px)" }}>
            <span style={{ width: 7, height: 7, background: C.goldLight, borderRadius: "50%", display: "inline-block", animation: "dotPulse 2.2s ease infinite" }} />
            {tr.hero.badge}
          </div>

          {/* Headline — each line animated separately */}
          <h1 style={{ fontFamily: "Amiri,serif", fontSize: "clamp(38px,5.5vw,70px)", color: "#fff", lineHeight: 1.22, marginBottom: "1.25rem", maxWidth: 760 }}>
            <div className="hero-line">{tr.hero.title1}</div>
            <div className="hero-line">
              {tr.hero.title2}{" "}
              <span style={{ color: C.goldLight, textShadow: "0 0 40px rgba(253,232,255,.45)" }}>
                {tr.hero.titleHighlight}
              </span>
            </div>
            <div className="hero-line">{tr.hero.title3}</div>
          </h1>

          {/* Sub */}
          <p className="hero-sub" style={{ fontSize: "clamp(16px,2vw,19px)", color: "rgba(255,255,255,.76)", maxWidth: 580, marginBottom: "2.5rem", lineHeight: 1.88 }}>
            {tr.hero.sub}
          </p>

          {/* CTAs */}
          <div className="hero-ctas" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "4rem" }}>
            <button onClick={() => setShowRegister(true)} className="btn-glow"
              style={{ ...btnPrimary, padding: "14px 32px", fontSize: 16, borderRadius: 12, boxShadow: "0 4px 20px rgba(179,0,196,.30)" }}>
              {tr.hero.btnRegister}
            </button>
            <button onClick={() => setShowTour(true)} className="btn-ghost-w"
              style={{ padding: "14px 32px", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer", background: "rgba(255,255,255,.08)", border: "1.5px solid rgba(255,255,255,.40)", color: "#fff", fontFamily: "Cairo,sans-serif", backdropFilter: "blur(6px)" }}>
              {tr.hero.btnTour}
            </button>
          </div>

          {/* Stats bar */}
          <div className="hero-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.10)", borderRadius: 20, overflow: "hidden", backdropFilter: "blur(8px)", maxWidth: 700 }}>
            {[
              { num: tr.hero.stat1Num, label: tr.hero.stat1Label },
              { num: tr.hero.stat2Num, label: tr.hero.stat2Label },
              { num: tr.hero.stat3Num, label: tr.hero.stat3Label },
              { num: tr.hero.stat4Num, label: tr.hero.stat4Label },
            ].map((s, i) => (
              <div key={i} style={{ padding: "1.4rem 1.5rem", borderInlineStart: i > 0 ? "1px solid rgba(255,255,255,.10)" : "none" }}>
                <div style={{ fontSize: 30, fontWeight: 800, color: C.goldLight, lineHeight: 1, marginBottom: 5 }}>{s.num}</div>
                <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.65)", lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ FEATURES STRIP ════════════ */}
      <div ref={featRef} className="feat-pad" style={{ background: `linear-gradient(135deg, ${C.gold} 0%, ${C.primary} 100%)`, padding: "4.5rem 2rem", borderBottom: "2px solid rgba(179,0,196,.20)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "2.5rem" }}>
          {tr.features.map((f, i) => (
            <div key={i} className="feat-item" style={{ display: "flex", alignItems: "flex-start", gap: "1.1rem" }}>
              <div style={{ width: 52, height: 52, borderRadius: 15, background: "rgba(255,255,255,.09)", border: "1px solid rgba(255,255,255,.14)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                {f.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 5 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.60)", lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════ ACCREDITATIONS ════════════ */}
      <div style={{ background: "#fff", padding: "2.5rem 2rem", borderBottom: "1px solid #E8E0F5" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "#808080", textTransform: "uppercase" as const }}>
              {tr.accreditations.tag}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(2rem,5vw,5rem)", flexWrap: "wrap" }}>
            {/* Cognia badge */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <img src="/img/accreditations/cognia.png" alt="Cognia Accreditation" loading="lazy"
                style={{ height: 90, width: 90, objectFit: "contain" }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#808080", letterSpacing: .5 }}>Cognia (AdvancED)</span>
            </div>
            {/* AIAA badge */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <img src="/img/accreditations/aiaa.png" alt="AIAA Accreditation" loading="lazy"
                style={{ height: 70, width: 160, objectFit: "contain" }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#808080", letterSpacing: .5 }}>AIAA</span>
            </div>
            {/* WASC text badge */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ height: 70, width: 90, display: "flex", alignItems: "center", justifyContent: "center", background: "#f0e8f8", borderRadius: 16, border: "2px solid #7A24B2" }}>
                <span style={{ fontSize: 26, fontWeight: 900, color: "#7A24B2", letterSpacing: -1 }}>WASC</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#808080", letterSpacing: .5 }}>WASC</span>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════ ABOUT ════════════ */}
      <section id="about" ref={aboutRef} className="sec-pad" style={{ background: "#fff", padding: "7rem 2rem" }}>
        <div className="about-grid" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5.5rem", alignItems: "center" }}>

          {/* Image */}
          <div className="about-img" style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: -20, ...(isRtl ? { right: -20 } : { left: -20 }), width: 100, height: 100, borderRadius: 20, border: "3px solid rgba(179,0,196,.25)", zIndex: 0 }} />
            <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", boxShadow: "0 32px 80px rgba(90,23,133,.22)", zIndex: 1 }}>
              <img src={aboutImage ?? "/img/home-hero/school-hero.jpg"} alt={isRtl ? "مدارس الأفق العالمية - مبنى المدرسة" : "Horizon International Schools building"} loading="lazy" decoding="async" style={{ width: "100%", height: 500, objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(90,23,133,.28) 0%, transparent 55%)" }} />
            </div>
            {/* Year badge */}
            <div style={{ position: "absolute", bottom: -32, ...(isRtl ? { left: -32 } : { right: -32 }), background: `linear-gradient(135deg, ${C.gold} 0%, #8800CC 100%)`, color: "#fff", borderRadius: 22, padding: "1.6rem 1.9rem", textAlign: "center", boxShadow: "0 16px 48px rgba(179,0,196,.45)", animation: "goldPulse 3.5s ease infinite", zIndex: 2 }}>
              <div style={{ fontSize: 42, fontWeight: 800, lineHeight: 1 }}>{tr.about.badge}</div>
              <div style={{ fontSize: 11, opacity: .9, marginTop: 6, letterSpacing: .8 }}>{tr.about.badgeLabel}</div>
            </div>
          </div>

          {/* Text */}
          <div className="about-text">
            <SectionTag>{tr.about.tag}</SectionTag>
            <h2 style={{ fontFamily: "Amiri,serif", fontSize: "clamp(28px,4vw,48px)", color: C.dark, lineHeight: 1.28, margin: "1.25rem 0 .75rem" }}>{tr.about.title}</h2>
            <GoldLine />
            <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.95, marginTop: "1.5rem", marginBottom: "1.25rem" }}>{tr.about.p1}</p>
            <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.95, marginBottom: "1.75rem" }}>{tr.about.p2}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.75rem" }}>
              {tr.about.features.map((f, i) => (
                <div key={i} className="info-card" style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "1rem 1.1rem", background: C.bg, borderRadius: 14, border: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 20 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.dark, marginBottom: 2 }}>{f.title}</div>
                    <div style={{ fontSize: 12.5, color: C.light }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link href={nav("/about")} className="btn-glow"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 26px", borderRadius: 12, background: C.primary, color: "#fff", fontWeight: 600, textDecoration: "none", fontSize: 14.5, boxShadow: "0 4px 16px rgba(122,36,178,.25)" }}>
              {tr.about.readMore} {isRtl ? "←" : "→"}
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════ PHOTO GALLERY SLIDER ════════════ */}
      {galleryImages && galleryImages.length > 0 && (
        <GallerySlider images={galleryImages} isRtl={isRtl} dark={C.dark} gold={C.gold} bg={C.bg} speed={gallerySpeed ?? 5} />
      )}

      {/* ════════════ PROGRAMS ════════════ */}
      <section id="programs" ref={progRef} className="sec-pad" style={{ background: C.bg, padding: "7rem 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          <div className="prog-header" style={{ textAlign: "center", marginBottom: "4.5rem" }}>
            <SectionTag>{tr.programs.tag}</SectionTag>
            <h2 style={{ fontFamily: "Amiri,serif", fontSize: "clamp(28px,4vw,48px)", color: C.dark, margin: "1.25rem 0 .75rem" }}>{tr.programs.title}</h2>
            <GoldLine center />
            <p style={{ fontSize: 17, color: C.muted, maxWidth: 600, margin: "1.25rem auto 0", lineHeight: 1.9 }}>{tr.programs.desc}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: "1.75rem" }}>
            {tr.programs.list.map((p, i) => (
              <div key={i} className="prog-card" style={{ background: "#fff", borderRadius: 22, border: `1px solid ${C.border}` }}>
                <div style={{ padding: "2.25rem 2rem 1.5rem" }}>
                  <div className="prog-icon" style={{ width: 62, height: 62, borderRadius: 18, background: "linear-gradient(135deg,rgba(122,36,178,.10),rgba(179,0,196,.08))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: "1.5rem" }}>
                    {p.icon}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: C.gold, letterSpacing: 1.8, marginBottom: 8, textTransform: "uppercase" }}>{p.age}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: C.dark, marginBottom: ".6rem" }}>{p.title}</div>
                  <div style={{ fontSize: 14.5, color: C.muted, lineHeight: 1.78 }}>{p.desc}</div>
                </div>
                <div style={{ padding: "1rem 2rem 1.75rem", borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {p.tags.map((tag, j) => (
                    <span key={j} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 20, background: C.bg, color: C.muted, border: `1px solid ${C.border}` }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
            <Link href={nav("/programs")} className="btn-glow"
              style={{ display: "inline-block", padding: "13px 38px", borderRadius: 12, background: C.primary, color: "#fff", fontWeight: 600, textDecoration: "none", fontSize: 15, boxShadow: "0 4px 16px rgba(122,36,178,.25)" }}>
              {tr.programs.learnMore}
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════ EVENT BANNER — only shown when a DB event exists ════════════ */}
      {dbEvent && <section id="events" ref={eventRef} className="sec-pad" style={{ background: C.dark, padding: "7rem 2rem", position: "relative", overflow: "hidden" }}>
        {/* Background orbs */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", width: 650, height: 650, borderRadius: "50%", background: "radial-gradient(circle, rgba(179,0,196,.10) 0%, transparent 68%)", top: "-22%", ...(isRtl ? { left: "-16%" } : { right: "-16%" }), animation: "orbPulse 9s ease-in-out infinite" }} />
          <div style={{ position: "absolute", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(122,36,178,.28) 0%, transparent 70%)", bottom: "-12%", ...(isRtl ? { right: "8%" } : { left: "8%" }), animation: "orbPulse 13s ease-in-out infinite reverse" }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px)", backgroundSize: "56px 56px" }} />
        </div>

        <div className="event-grid" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr auto", gap: "5rem", alignItems: "center", position: "relative" }}>

          {/* Info */}
          <div className="event-info">
            <div style={{ display: "inline-block", fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: C.goldLight, marginBottom: "1.25rem", padding: "5px 14px", border: "1px solid rgba(253,232,255,.28)", borderRadius: 20 }}>
              {ev.label}
            </div>
            <h2 style={{ fontFamily: "Amiri,serif", fontSize: "clamp(28px,4vw,54px)", color: "#fff", lineHeight: 1.22, marginBottom: "1.5rem" }}>{ev.title}</h2>
            <div style={{ display: "flex", gap: "1.75rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
              {[{ icon: "📅", text: ev.date }, { icon: "🕙", text: ev.time }, { icon: "📍", text: ev.location }].map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,.78)", fontSize: 15 }}>{m.icon} {m.text}</div>
              ))}
            </div>
            <p style={{ color: "rgba(255,255,255,.62)", fontSize: 15, maxWidth: 520, lineHeight: 1.88, marginBottom: "2.25rem" }}>{ev.desc}</p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button onClick={() => setShowEvent(true)} className="btn-glow"
                style={{ ...btnPrimary, boxShadow: "0 4px 20px rgba(179,0,196,.30)" }}>
                {ev.btnRegister}
              </button>
              <Link href={nav("/events")} className="btn-ghost-w"
                style={{ padding: "10px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600, background: "rgba(255,255,255,.07)", border: "1.5px solid rgba(255,255,255,.32)", color: "#fff", textDecoration: "none" }}>
                {ev.btnMore}
              </Link>
            </div>
          </div>

          {/* Countdown */}
          <div className="cd-wrap event-countdown" style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ display: "flex", gap: ".85rem", alignItems: "flex-end", marginBottom: "1.1rem" }}>
              {[
                { val: countdown.d, lbl: ev.days },
                { val: countdown.h, lbl: ev.hours },
                { val: countdown.m, lbl: ev.mins },
                { val: countdown.s, lbl: isRtl ? "ث" : "sec" },
              ].map((item, i, arr) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: ".85rem" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 18, padding: "1.1rem 1.4rem", minWidth: 80, backdropFilter: "blur(10px)", position: "relative", overflow: "hidden" }}>
                      <div key={item.val} style={{ fontSize: 44, fontWeight: 800, color: C.goldLight, lineHeight: 1, animation: "flipDown .38s cubic-bezier(.22,.68,0,1.2)" }}>
                        {item.val}
                      </div>
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${C.goldLight},transparent)`, backgroundSize: "200% 100%", animation: "shimmerLine 2.5s linear infinite", opacity: .4 }} />
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.50)", marginTop: 9, fontWeight: 700, letterSpacing: 1.2 }}>{item.lbl}</div>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ fontSize: 30, color: "rgba(255,255,255,.22)", marginBottom: 32, flexShrink: 0 }}>:</div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.38)", letterSpacing: 1.2 }}>{ev.countdownLabel}</div>
          </div>
        </div>
      </section>}

      {/* ════════════ ADMISSIONS STEPS ════════════ */}
      <section id="admissions" ref={admRef} className="sec-pad" style={{ background: C.bg, padding: "7rem 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          <div className="adm-header" style={{ textAlign: "center", marginBottom: "5rem" }}>
            <SectionTag>{tr.admissionsSteps.tag}</SectionTag>
            <h2 style={{ fontFamily: "Amiri,serif", fontSize: "clamp(28px,4vw,48px)", color: C.dark, margin: "1.25rem 0 .75rem" }}>{tr.admissionsSteps.title}</h2>
            <GoldLine center />
            <p style={{ fontSize: 17, color: C.muted, maxWidth: 600, margin: "1.25rem auto 0", lineHeight: 1.9 }}>{tr.admissionsSteps.desc}</p>
          </div>

          <div style={{ position: "relative" }}>
            {/* Connecting line */}
            <div style={{ position: "absolute", top: 36, insetInlineStart: `calc(100% / ${tr.admissionsSteps.steps.length} / 2)`, insetInlineEnd: `calc(100% / ${tr.admissionsSteps.steps.length} / 2)`, height: 2, background: `linear-gradient(90deg,transparent,${C.border} 8%,${C.border} 92%,transparent)` }} />
            <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: `repeat(${tr.admissionsSteps.steps.length},1fr)`, position: "relative", zIndex: 1 }}>
              {tr.admissionsSteps.steps.map((s, i) => (
                <div key={i} className="step-item" style={{ textAlign: "center", padding: "0 1rem 2rem" }}>
                  <div className="step-num" style={{ width: 74, height: 74, borderRadius: "50%", background: "#fff", border: `3px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.6rem", fontSize: 24, fontWeight: 800, color: C.gold, boxShadow: `0 6px 22px rgba(179,0,196,.28)` }}>
                    {s.num}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: ".6rem" }}>{s.title}</div>
                  <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.78 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
            <button onClick={() => setShowRegister(true)} className="btn-glow"
              style={{ ...btnPrimary, padding: "14px 40px", fontSize: 16, boxShadow: "0 4px 20px rgba(179,0,196,.30)" }}>
              {tr.admissionsSteps.btnStart}
            </button>
          </div>
        </div>
      </section>

      {/* ════════════ TESTIMONIALS SLIDER ════════════ */}
      <section ref={testRef} className="sec-pad" style={{ background: "#fff", padding: "7rem 2rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <SectionTag>{tr.testimonials.tag}</SectionTag>
            <h2 style={{ fontFamily: "Amiri,serif", fontSize: "clamp(28px,4vw,48px)", color: C.dark, margin: "1.25rem 0 .5rem" }}>{tr.testimonials.title}</h2>
            <GoldLine center />
          </div>

          {/* Slider */}
          <div
            className="tm-slider-wrap"
            style={{ padding: "0 40px" }}
            onMouseEnter={() => setTmPaused(true)}
            onMouseLeave={() => setTmPaused(false)}
          >
            {/* Prev arrow */}
            <button
              className="tm-arrow tm-arrow-prev"
              onClick={() => tmPrev(testimonialsList.length)}
              aria-label="السابق"
            >
              {isRtl ? "›" : "‹"}
            </button>

            {/* Track */}
            <div
              className="tm-slider-track"
              style={{ transform: `translateX(${isRtl ? tmIndex * 100 : -tmIndex * 100}%)` }}
            >
              {testimonialsList.map((tm, i) => (
                <div key={i} className="tm-slide">
                  <div className="tm-card" style={{ background: C.bg, borderRadius: 28, padding: "2.75rem 3rem", border: `1px solid ${C.border}`, position: "relative", overflow: "hidden", textAlign: "center" }}>
                    <div style={{ position: "absolute", top: -8, ...(isRtl ? { left: 20 } : { right: 20 }), fontFamily: "Georgia,serif", fontSize: 150, color: C.gold, opacity: .06, lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>"</div>

                    {/* Stars */}
                    <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: "1.5rem" }}>
                      {[1,2,3,4,5].map(s => <span key={s} style={{ color: C.gold, fontSize: 20 }}>★</span>)}
                    </div>

                    {/* Text */}
                    <p style={{ fontSize: 17, color: C.muted, lineHeight: 2, marginBottom: "2rem", position: "relative", fontStyle: "italic" }}>
                      "{tm.text}"
                    </p>

                    {/* Author */}
                    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "center" }}>
                      <div style={{ width: 54, height: 54, borderRadius: "50%", background: `linear-gradient(135deg,${C.primary},#6B1EA5)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 17, flexShrink: 0, boxShadow: "0 6px 20px rgba(122,36,178,.25)" }}>
                        {tm.initials}
                      </div>
                      <div style={{ textAlign: isRtl ? "right" : "left" }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: C.dark }}>{tm.name}</div>
                        <div style={{ fontSize: 13, color: C.light }}>{tm.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Next arrow */}
            <button
              className="tm-arrow tm-arrow-next"
              onClick={() => tmNext(testimonialsList.length)}
              aria-label="التالي"
            >
              {isRtl ? "‹" : "›"}
            </button>
          </div>

          {/* Dots */}
          <div className="tm-dots">
            {testimonialsList.map((_, i) => (
              <button
                key={i}
                className={`tm-dot${i === tmIndex ? " active" : ""}`}
                onClick={() => setTmIndex(i)}
                aria-label={`تعليق ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ CONTACT ════════════ */}
      <section id="contact" ref={contactRef} className="sec-pad" style={{ background: C.bg, padding: "7rem 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div>
            <SectionTag>{tr.contact.tag}</SectionTag>
            <h2 style={{ fontFamily: "Amiri,serif", fontSize: "clamp(28px,4vw,48px)", color: C.dark, margin: "1.25rem 0 .75rem" }}>{tr.contact.title}</h2>
            <GoldLine />
          </div>

          <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", marginTop: "3.5rem" }}>

            {/* Info cards */}
            <div className="contact-info" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { icon: "📍", label: isRtl ? "العنوان"       : "Address", value: tr.contact.address },
                { icon: "📞", label: isRtl ? "الهاتف"        : "Phone",   value: tr.contact.phone },
                { icon: "✉️", label: isRtl ? "البريد"        : "Email",   value: tr.contact.email },
                { icon: "🕐", label: isRtl ? "ساعات العمل"   : "Hours",   value: tr.contact.hours },
              ].map((row, i) => (
                <div key={i} className="info-card" style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1.1rem 1.3rem", background: "#fff", borderRadius: 16, border: `1px solid ${C.border}` }}>
                  <div style={{ width: 46, height: 46, borderRadius: 13, background: "linear-gradient(135deg,rgba(122,36,178,.12),rgba(122,36,178,.05))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                    {row.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 11.5, color: C.light, marginBottom: 3, fontWeight: 600, letterSpacing: .5 }}>{row.label}</div>
                    <div style={{ fontSize: 14.5, fontWeight: 600, color: C.dark }}>{row.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="contact-form" style={{ background: "#fff", borderRadius: 24, padding: "2.5rem", border: `1px solid ${C.border}`, boxShadow: "0 12px 48px rgba(90,23,133,.07)" }}>
              {contactDone ? (
                <div style={{ textAlign: "center", padding: "3rem 0" }}>
                  <div style={{ fontSize: 68, marginBottom: "1.25rem" }}>💌</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: C.dark, marginBottom: ".75rem" }}>{tr.validation.sent}</div>
                  <div style={{ fontSize: 15, color: C.muted, lineHeight: 1.75 }}>{tr.validation.sentDesc}</div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 21, fontWeight: 700, color: C.dark, marginBottom: "1.75rem" }}>{tr.contact.formTitle}</div>
                  <form onSubmit={submitContact}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "1rem" }}>
                      {[
                        { label: tr.contact.fields.name,  ph: tr.contact.fields.namePh,  key: "name",  type: "text" },
                        { label: tr.contact.fields.phone, ph: tr.contact.fields.phonePh, key: "phone", type: "tel" },
                      ].map(f => (
                        <div key={f.key} style={{ marginBottom: "1rem" }}>
                          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 6 }}>{f.label}</label>
                          <input type={f.type} className="input-anim" style={inputStyle} placeholder={f.ph} value={(contactForm as any)[f.key]} onChange={e => setContactForm(p => ({ ...p, [f.key]: e.target.value }))} required={f.key === "name"} />
                        </div>
                      ))}
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 6 }}>{tr.contact.fields.email}</label>
                      <input type="email" className="input-anim" style={inputStyle} placeholder={tr.contact.fields.emailPh} value={contactForm.email} onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))} required />
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 6 }}>{tr.contact.fields.subject}</label>
                      <select className="input-anim" style={inputStyle} value={contactForm.subject} onChange={e => setContactForm(p => ({ ...p, subject: e.target.value }))}>
                        <option value=""></option>
                        {tr.contact.fields.subjectOpts.map((o, i) => <option key={i}>{o}</option>)}
                      </select>
                    </div>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 6 }}>{tr.contact.fields.message}</label>
                      <textarea className="input-anim" style={{ ...inputStyle, minHeight: 110, resize: "vertical" }} placeholder={tr.contact.fields.messagePh} value={contactForm.message} onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))} />
                    </div>
                    <button type="submit" className="btn-glow" style={{ ...btnPrimary, width: "100%", padding: "13px", fontSize: 15, justifyContent: "center", display: "flex", opacity: contactLoading ? .7 : 1, boxShadow: "0 4px 16px rgba(122,36,178,.22)" }} disabled={contactLoading}>
                      {contactLoading ? "..." : tr.contact.fields.send}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ BRANCHES STRIP ════════════ */}
      <div style={{ background: C.dark, padding: "3rem 2rem", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2.5, color: C.goldLight, textTransform: "uppercase" as const }}>{tr.branchesPage.tag}</span>
            <h3 style={{ fontFamily: "Amiri,serif", fontSize: "clamp(22px,3vw,32px)", color: "#fff", margin: "0.75rem 0 0" }}>{tr.branchesPage.subtitle}</h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.5rem" }}>
            {[
              { label: tr.branchesPage.woroud.name, desc: tr.branchesPage.woroud.desc, portal: tr.branchesPage.woroud.portal, grad: "linear-gradient(135deg,#B300C4 0%,#7A24B2 100%)" },
              { label: tr.branchesPage.laban.name,  desc: tr.branchesPage.laban.desc,  portal: tr.branchesPage.laban.portal,  grad: "linear-gradient(135deg,#3D1373 0%,#2D0864 100%)" },
            ].map((b, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.10)", borderRadius: 18, padding: "1.75rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>🏫 {b.label}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.50)" }}>📍 {b.desc}</div>
                </div>
                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" as const }}>
                  {[
                    { label: tr.branchesPage.studentPortal, utype: 3, icon: "🎒" },
                    { label: tr.branchesPage.parentPortal,  utype: 2, icon: "👨‍👩‍👧" },
                    { label: tr.branchesPage.staffPortal,   utype: 1, icon: "👩‍🏫" },
                  ].map((p) => (
                    <a key={p.utype} href={`${b.portal}?Utype=${p.utype}`} target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, background: "rgba(255,255,255,.09)", border: "1px solid rgba(255,255,255,.14)", color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 600, fontFamily: "Cairo,sans-serif", transition: "background .2s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(179,0,196,.35)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,.09)")}>
                      {p.icon} {p.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════ FOOTER ════════════ */}
      <footer style={{ background: C.dark }}>
        <div className="footer-grid" style={{ maxWidth: 1200, margin: "0 auto", padding: "5.5rem 2rem 4rem", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: "3rem", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
          <div>
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ background: "#fff", borderRadius: 14, padding: "14px 18px", display: "inline-block", boxShadow: "0 4px 20px rgba(0,0,0,.25)", marginBottom: "0.75rem" }}>
                <img src="/img/horizon-logo-purple.png" alt={tr.school} style={{ width: 90, objectFit: "contain", display: "block" }} />
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "rgba(255,255,255,.85)" }}>{tr.school}</div>
            </div>
            <p style={{ fontSize: 13.5, color: "rgba(255,255,255,.50)", lineHeight: 1.88, marginBottom: "1.75rem" }}>{tr.footer.desc}</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { href: tr.footer.social.fbWoroud,    label: tr.footer.social.fbWoroudLabel,    icon: "📘" },
                { href: tr.footer.social.fbLaban,     label: tr.footer.social.fbLabanLabel,     icon: "📘" },
                { href: tr.footer.social.snapchat,    label: tr.footer.social.snapchatLabel,    icon: "👻" },
                { href: tr.footer.social.instaWoroud, label: tr.footer.social.instaWoroudLabel, icon: "📸" },
                { href: tr.footer.social.instaLaban,  label: tr.footer.social.instaLabanLabel,  icon: "📸" },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}
                  className="social-icon"
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,.14)", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.70)", textDecoration: "none", whiteSpace: "nowrap" }}>
                  {s.icon} {s.label}
                </a>
              ))}
            </div>
          </div>

          {[
            { title: tr.footer.quickLinks, links: tr.footer.links.quick,     hrefs: [nav(""), nav("/about"), nav("/news"), nav("/events"), nav("/about#jobs")] },
            { title: tr.footer.admissions, links: tr.footer.links.admission,  hrefs: [nav("/admissions"), nav("/admissions#fees"), "#tour", nav("/admissions"), nav("/admissions#faq")] },
            { title: tr.footer.policies,   links: tr.footer.links.policy,     hrefs: [nav("/about#privacy"), nav("/about#safeguarding"), nav("/about#attendance"), nav("/about#conduct"), nav("/contact")] },
          ].map((col, ci) => (
            <div key={ci}>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.goldLight, textTransform: "uppercase", letterSpacing: 2.2, marginBottom: "1.5rem" }}>{col.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: ".8rem" }}>
                {col.links.map((link, li) => (
                  <a key={li} className="footer-lnk"
                    href={col.hrefs[li] === "#tour" ? "#" : col.hrefs[li]}
                    onClick={col.hrefs[li] === "#tour" ? e => { e.preventDefault(); setShowTour(true); } : undefined}
                    style={{ fontSize: 13.5, color: "rgba(255,255,255,.52)", textDecoration: "none" }}>
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1.75rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: "rgba(255,255,255,.36)", flexWrap: "wrap", gap: "1rem" }}>
          <span>{tr.footer.copy}</span>
          <div style={{ display: "flex", gap: "1.75rem" }}>
            <Link href={nav("/about#privacy")} style={{ color: "rgba(255,255,255,.46)", textDecoration: "none" }}>{tr.footer.privacy}</Link>
            <Link href={nav("/about#terms")}   style={{ color: "rgba(255,255,255,.46)", textDecoration: "none" }}>{tr.footer.terms}</Link>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <RegisterModal open={showRegister} onClose={() => setShowRegister(false)} locale={locale} />
      <TourModal     open={showTour}     onClose={() => setShowTour(false)}     locale={locale} />
      <EventModal    open={showEvent}    onClose={() => setShowEvent(false)}    locale={locale} />
      <Toast message={toast} onDone={() => setToast(null)} />
      <ScrollTop />
    </>
  );
}
