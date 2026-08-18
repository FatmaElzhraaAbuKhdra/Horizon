"use client";
import Link from "next/link";
import { useState, useRef } from "react";
import { type Locale, t } from "@/lib/i18n";

interface NavbarProps {
  locale: Locale;
  onRegister: () => void;
}

export default function Navbar({ locale, onRegister }: NavbarProps) {
  const tr = t[locale];
  const other = locale === "ar" ? "en" : "ar";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openDropdown = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDrop(key);
  };
  const closeDropdown = () => {
    closeTimer.current = setTimeout(() => setOpenDrop(null), 120);
  };

  const nav = (href: string) => `/${locale}${href}`;

  const menuGroups = [
    { key: "home", label: tr.nav.home, href: nav("") },
    {
      key: "admissions", label: tr.nav.admissionsGroup, children: [
        { label: tr.nav.admissions, href: nav("/admissions") },
        { label: tr.nav.fees, href: nav("/fees") },
      ],
    },
    {
      key: "school", label: tr.nav.schoolGroup, children: [
        { label: tr.nav.about, href: nav("/about") },
        { label: tr.nav.programs, href: nav("/programs") },
        { label: tr.nav.safeguarding, href: nav("/safeguarding") },
        { label: tr.nav.policies, href: nav("/policies") },
        { label: tr.nav.aspa, href: nav("/aspa") },
        { label: tr.nav.aldenhamUk, href: nav("/aldenham-uk") },
      ],
    },
    {
      key: "academic", label: tr.nav.academicGroup, children: [
        { label: tr.nav.termDates, href: nav("/term-dates") },
        { label: tr.nav.calendarEvents, href: nav("/calendar-events") },
      ],
    },
    {
      key: "curriculum", label: tr.nav.curriculumGroup, children: [
        { label: tr.nav.eyfs, href: nav("/curriculum/eyfs") },
        { label: tr.nav.ks1, href: nav("/curriculum/ks1") },
        { label: tr.nav.ks2, href: nav("/curriculum/ks2") },
        { label: tr.nav.ks3, href: nav("/curriculum/ks3") },
        { label: tr.nav.senior, href: nav("/curriculum/senior") },
      ],
    },
    {
      key: "arts", label: tr.nav.artsGroup, children: [
        { label: tr.nav.ccas, href: nav("/activities/ccas") },
        { label: tr.nav.sports, href: nav("/activities/sports") },
        { label: tr.nav.musicDrama, href: nav("/activities/music-drama") },
      ],
    },
    { key: "news", label: tr.nav.news, href: nav("/news") },
    { key: "announcements", label: tr.nav.announcements, href: nav("/announcements") },
    { key: "jobs", label: tr.nav.jobs, href: nav("/careers") },
    { key: "contact", label: tr.nav.contact, href: nav("/contact") },
    {
      key: "branches", label: tr.nav.branchesGroup, children: [
        { label: tr.nav.branchWoroud, href: nav("/branches") + "#woroud" },
        { label: tr.nav.branchLaban,  href: nav("/branches") + "#laban"  },
      ],
    },
  ];

  return (
    <>
      {/* TOP BAR */}
      <div className="tb-root" style={{ background: "#2D0864", color: "rgba(255,255,255,.8)", height: 40, display: "flex", alignItems: "center", padding: "0 2rem", gap: "1.5rem", fontSize: 13 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href={`/${other}`} style={{ padding: "2px 10px", borderRadius: 30, fontSize: 12, color: "rgba(255,255,255,.7)", border: "1px solid rgba(255,255,255,.25)", textDecoration: "none", transition: "all .2s" }}
            onMouseEnter={e => { (e.target as HTMLElement).style.background = "#B300C4"; (e.target as HTMLElement).style.color = "#fff"; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.background = "transparent"; (e.target as HTMLElement).style.color = "rgba(255,255,255,.7)"; }}>
            {tr.switchLang}
          </Link>
        </div>
        <span className="tb-phone">📞 +920015440</span>
        <div className="tb-actions" style={{ marginInlineStart: "auto", display: "flex", gap: "1.5rem" }}>
          <button onClick={onRegister} style={{ background: "none", border: "none", color: "rgba(255,255,255,.8)", cursor: "pointer", fontSize: 13 }}>📋 {tr.nav.register}</button>
        </div>
      </div>

      {/* NAVBAR */}
      <nav style={{ position: "sticky", top: 0, zIndex: 999, background: "#fff", borderBottom: "2px solid #B300C4", height: 72, display: "flex", alignItems: "center", padding: "0 2rem", gap: "1.5rem", boxShadow: "0 2px 16px rgba(0,0,0,.08)" }}>
        {/* Logo */}
        <Link href={nav("")} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
          <img src="/logo.png" alt={tr.school} style={{ width: 48, height: 48, objectFit: "contain", display: "block" }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#7A24B2", lineHeight: 1.3 }}>{tr.school}</div>
            <div style={{ fontSize: 11, color: "#5A5A5A" }}>{tr.schoolEn}</div>
          </div>
        </Link>

        {/* Desktop Menu */}
        <ul style={{ display: "flex", alignItems: "center", gap: 2, flex: 1, listStyle: "none", margin: 0, padding: 0, flexWrap: "wrap" }} className="nav-menu-desktop">
          {menuGroups.map(item => (
            <li key={item.key} style={{ position: "relative" }}
              onMouseEnter={() => item.children && openDropdown(item.key)}
              onMouseLeave={() => item.children && closeDropdown()}>
              {item.children ? (
                <>
                  <button style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 14px", fontSize: 14, fontWeight: 500, color: "#1A1A1A", border: "none", background: "none", cursor: "pointer", borderRadius: 8, transition: "all .2s", fontFamily: "Cairo, sans-serif" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(122,36,178,.08)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                    {item.label} <span style={{ fontSize: 10 }}>▼</span>
                  </button>
                  {openDrop === item.key && (
                    <div
                      onMouseEnter={() => openDropdown(item.key)}
                      onMouseLeave={closeDropdown}
                      style={{ position: "absolute", top: "100%", insetInlineStart: 0, paddingTop: 6, zIndex: 100 }}>
                    <div style={{ background: "#fff", border: "1px solid #E8E0F5", borderRadius: 12, minWidth: 200, padding: 8, boxShadow: "0 8px 32px rgba(0,0,0,.12)" }}>
                      {item.children.map((c, i) => (
                        <Link key={i} href={c.href} style={{ display: "block", padding: "9px 14px", fontSize: 13.5, color: "#1A1A1A", textDecoration: "none", borderRadius: 8 }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#FAF7FF")}
                          onMouseLeave={e => (e.currentTarget.style.background = "none")}>{c.label}</Link>
                      ))}
                    </div>
                    </div>
                  )}
                </>
              ) : (
                <Link href={item.href!} style={{ display: "flex", alignItems: "center", padding: "8px 14px", fontSize: 14, fontWeight: 500, color: "#1A1A1A", textDecoration: "none", borderRadius: 8 }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(122,36,178,.08)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* CTA Buttons */}
        <div className="nav-cta-desk" style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button onClick={onRegister} style={{ padding: "9px 18px", borderRadius: 10, fontSize: 13.5, fontWeight: 600, cursor: "pointer", background: "#B300C4", border: "none", color: "#fff", fontFamily: "Cairo, sans-serif", transition: "all .2s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#8800CC")}
            onMouseLeave={e => (e.currentTarget.style.background = "#B300C4")}>
            {tr.nav.register}
          </button>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setMobileOpen(true)} aria-label="فتح القائمة" style={{ display: "none", background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#7A24B2" }} className="mobile-toggle-btn">
          ☰
        </button>
      </nav>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ position: "absolute", top: 0, [locale === "ar" ? "right" : "left"]: 0, width: "min(320px, 90vw)", height: "100%", background: "#fff", padding: "1.5rem 1.25rem", overflowY: "auto" }}>
            <button onClick={() => setMobileOpen(false)} aria-label="إغلاق القائمة" style={{ position: "absolute", top: "1rem", [locale === "ar" ? "left" : "right"]: "1rem", background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#1A1A1A" }}>✕</button>
            <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {menuGroups.map(item => (
                <div key={item.key}>
                  {item.children ? (
                    <>
                      <div style={{ fontSize: 10, fontWeight: 800, color: "#B300C4", letterSpacing: 1.2, marginBottom: "0.4rem", borderBottom: "1px solid #E8E0F5", paddingBottom: "0.3rem" }}>
                        {item.label}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.35rem" }}>
                        {item.children.map((c, i) =>
                          <Link key={i} href={c.href} onClick={() => setMobileOpen(false)} style={{ display: "block", padding: "8px 10px", fontSize: 13, fontWeight: 500, color: "#1A1A1A", textDecoration: "none", background: "#FAF7FF", border: "1px solid #E8E0F5", borderRadius: 8, lineHeight: 1.4 }}>{c.label}</Link>
                        )}
                      </div>
                    </>
                  ) : (
                    <Link href={item.href!} onClick={() => setMobileOpen(false)} style={{ display: "block", padding: "10px 0", borderBottom: "1px solid #E8E0F5", fontSize: 14, fontWeight: 600, color: "#1A1A1A", textDecoration: "none" }}>{item.label}</Link>
                  )}
                </div>
              ))}
              <div style={{ marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <button onClick={() => { onRegister(); setMobileOpen(false); }} style={{ padding: "11px", borderRadius: 10, fontSize: 13.5, fontWeight: 600, cursor: "pointer", background: "#B300C4", border: "none", color: "#fff", fontFamily: "Cairo, sans-serif" }}>{tr.nav.register}</button>
                <Link href={`/${other}`} style={{ textAlign: "center", padding: "9px", borderRadius: 10, fontSize: 13.5, color: "#7A24B2", textDecoration: "none", border: "1px solid #E8E0F5" }}>{tr.switchLang}</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .tb-root { display: none !important; }
          .nav-menu-desktop { display: none !important; }
          .mobile-toggle-btn { display: flex !important; margin-inline-start: auto; }
        }
        @media (max-width: 480px) {
          .nav-cta-desk { display: none !important; }
        }
      `}</style>
    </>
  );
}
