"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { type Locale, t, REGISTRATION_URL } from "@/lib/i18n";
import Navbar from "./Navbar";
import { EventModal } from "./Modals";

const PAGE_TRANSITION = `
  @keyframes pageIn {
    from { transform: translateY(10px); }
    to   { transform: translateY(0); }
  }
  .page-enter { animation: pageIn .2s ease-out forwards; }
`;

export default function SubPage({
  locale, title, subtitle, heroImage, children,
}: {
  locale: Locale;
  title: string;
  subtitle?: string;
  heroImage?: string | null;
  children: React.ReactNode;
}) {
  const [showEvent,    setShowEvent]    = useState(false);
  const [entered, setEntered] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const tr = t[locale];

  useEffect(() => { setEntered(true); }, []);

  useEffect(() => {
    if (!mainRef.current) return;
    const targets = Array.from(
      mainRef.current.querySelectorAll<HTMLElement>("section > div > *")
    );
    if (targets.length === 0) return;

    targets.forEach(el => {
      el.style.opacity = "0";
      el.style.transform = "translateY(22px)";
      el.style.transition = "opacity .4s ease, transform .4s ease";
    });

    const io = new IntersectionObserver(entries => {
      entries.forEach((entry, idx) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        setTimeout(() => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }, idx * 60);
        io.unobserve(el);
      });
    }, { threshold: 0.07 });

    targets.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <style>{PAGE_TRANSITION}</style>
      <Navbar locale={locale} onRegister={() => window.open(REGISTRATION_URL, "_blank", "noopener,noreferrer")} />

      {/* PAGE HERO */}
      <div style={{ background: "linear-gradient(135deg, #2D0864 0%, #7A24B2 60%, #B300C4 100%)", padding: "3.5rem 2rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {heroImage && (
          <img src={heroImage} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.35 }} />
        )}
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(179,0,196,.08)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,.04)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          {/* Breadcrumb */}
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.55)", marginBottom: "0.75rem" }}>
            <Link href={`/${locale}`} style={{ color: "rgba(255,255,255,.55)", textDecoration: "none", transition: "color .2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#FDE8FF")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,.55)")}>
              {tr.nav.home}
            </Link>
            {" › "}<span style={{ color: "rgba(255,255,255,.80)" }}>{title}</span>
          </div>
          <h1 style={{ fontFamily: "Amiri,serif", fontSize: "clamp(30px,4.5vw,52px)", color: "#fff", margin: "0 0 .5rem", lineHeight: 1.25 }}>{title}</h1>
          {subtitle && <p style={{ fontSize: 16, color: "rgba(255,255,255,.65)", marginTop: ".5rem" }}>{subtitle}</p>}
        </div>
      </div>

      {/* CONTENT with entrance animation */}
      <main ref={mainRef} className={entered ? "page-enter" : ""} style={{ minHeight: "60vh" }}>
        {children}
      </main>

      {/* FOOTER */}
      <footer style={{ background: "#2D0864", color: "rgba(255,255,255,.55)", textAlign: "center", padding: "2rem", fontSize: 13 }}>
        <span>{tr.footer.copy}</span>
        {" · "}
        <Link href={`/${locale}`} style={{ color: "rgba(255,255,255,.55)", textDecoration: "none" }}>
          {tr.nav.home}
        </Link>
      </footer>

      <EventModal    open={showEvent}    onClose={() => setShowEvent(false)}    locale={locale} />
    </>
  );
}
