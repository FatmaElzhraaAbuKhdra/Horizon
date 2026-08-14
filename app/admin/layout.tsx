"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminPageTransition } from "@/components/AdminPageTransition";

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: "/admin",               label: "لوحة التحكم",      icon: "🏠" },
  { href: "/admin/registrations", label: "طلبات التسجيل",    icon: "📋" },
  { href: "/admin/tours",         label: "الجولات المدرسية",  icon: "🏫" },
  { href: "/admin/events",        label: "الفعاليات",         icon: "📅" },
  { href: "/admin/messages",      label: "رسائل التواصل",    icon: "✉️" },
];

const CMS_ITEMS = [
  { href: "/admin/about",            label: "عن المدرسة",            icon: "📝" },
  { href: "/admin/academic",         label: "البرنامج الأكاديمي",    icon: "🎓" },
  { href: "/admin/images",          label: "مكتبة الصور",          icon: "🖼️" },
  { href: "/admin/fees",            label: "الرسوم الدراسية",      icon: "💰" },
  { href: "/admin/admissions",      label: "مسار القبول",          icon: "🗺️" },
  { href: "/admin/school-events",   label: "فعاليات المدرسة",      icon: "📅" },
  { href: "/admin/testimonials",    label: "شهادات أولياء الأمور", icon: "💬" },
  { href: "/admin/policies",        label: "السياسات",             icon: "📄" },
  { href: "/admin/term-dates",      label: "الفصول الدراسية",      icon: "🗓️" },
  { href: "/admin/academic-events", label: "الأحداث الأكاديمية",   icon: "📆" },
  { href: "/admin/jobs",            label: "فرص التوظيف",          icon: "💼" },
  { href: "/admin/aspa",            label: "أعضاء ASPA",           icon: "👥" },
  { href: "/admin/news",             label: "الأخبار والمستجدات",   icon: "📰" },
  { href: "/admin/settings",        label: "إعدادات الموقع",       icon: "⚙️" },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Amiri:wght@400;700&display=swap');

  .admin-root {
    display: flex; height: 100vh; overflow: hidden;
    font-family: 'Cairo', sans-serif;
    background: #F0EBF8;
    direction: rtl;
  }

  /* ── Sidebar ── */
  .admin-sidebar {
    width: 256px;
    background: linear-gradient(175deg, #3C0E6E 0%, #2D0864 55%, #6B1EA5 100%);
    display: flex; flex-direction: column; flex-shrink: 0;
    position: sticky; top: 0; height: 100vh;
    overflow: hidden;
    transition: transform .28s cubic-bezier(.4,0,.2,1);
  }

  .sidebar-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }

  /* Logo area */
  .sidebar-logo {
    padding: 1.5rem 1.25rem;
    border-bottom: 1px solid rgba(255,255,255,.07);
    display: flex; align-items: center; gap: 12px;
    position: relative;
  }

  .sidebar-logo-badge {
    width: 42px; height: 42px; border-radius: 10px; flex-shrink: 0;
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,.20);
  }
  .sidebar-logo-badge img { width: 38px; height: 38px; object-fit: contain; }

  .sidebar-logo-text h2 {
    font-size: 14px; font-weight: 700; color: #fff; line-height: 1.25;
  }
  .sidebar-logo-text p {
    font-size: 11px; color: rgba(255,255,255,.55); margin-top: 2px;
  }

  /* Navigation */
  .sidebar-nav {
    padding: 1rem .75rem; flex: 1;
    display: flex; flex-direction: column; gap: 2px;
    position: relative; overflow-y: auto;
    scrollbar-width: none;
  }
  .sidebar-nav::-webkit-scrollbar { display: none; }

  .nav-section-label {
    font-size: 9.5px; font-weight: 700; letter-spacing: 1.2px;
    color: rgba(255,255,255,.45); padding: 4px 14px 8px;
    text-transform: uppercase;
  }

  .nav-link {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: 10px;
    text-decoration: none; font-size: 13.5px; font-weight: 500;
    color: rgba(255,255,255,.82);
    transition: color .18s, background .18s;
    position: relative;
  }
  .nav-link:hover {
    color: #fff;
    background: rgba(255,255,255,.10);
  }
  .nav-link.active {
    color: #FDE8FF;
    background: rgba(179,0,196,.14);
    font-weight: 700;
  }
  .nav-link.active::before {
    content: '';
    position: absolute; right: 0; top: 18%; bottom: 18%;
    width: 3px; border-radius: 3px 0 0 3px;
    background: #B300C4;
  }
  .nav-icon {
    font-size: 16px; width: 20px; text-align: center; flex-shrink: 0;
  }

  /* Sidebar footer */
  .sidebar-footer {
    padding: .875rem .75rem;
    border-top: 1px solid rgba(255,255,255,.06);
    position: relative;
    display: flex; flex-direction: column; gap: 4px;
  }

  .back-link, .logout-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 14px; border-radius: 10px;
    font-size: 13px; font-family: 'Cairo', sans-serif;
    text-decoration: none; cursor: pointer;
    transition: color .18s, background .18s;
    border: none; width: 100%; text-align: right;
    background: none;
  }
  .back-link { color: rgba(255,255,255,.70); }
  .back-link:hover { color: rgba(255,255,255,.92); background: rgba(255,255,255,.07); }

  .logout-btn { color: rgba(255,120,100,.80); }
  .logout-btn:hover { color: rgba(255,100,80,1); background: rgba(255,60,60,.10); }

  /* ── Main content ── */
  .admin-main { flex: 1; overflow: auto; min-width: 0; scrollbar-width: none; }
  .admin-main::-webkit-scrollbar { display: none; }

  /* ── Mobile header ── */
  .mob-header {
    display: none;
    position: sticky; top: 0; z-index: 300;
    background: linear-gradient(90deg,#3C0E6E,#2D0864);
    height: 52px; padding: 0 1rem;
    align-items: center; justify-content: space-between;
    border-bottom: 2px solid #B300C4;
    flex-shrink: 0;
  }
  .mob-hamburger {
    background: none; border: none; color: #B300C4;
    font-size: 22px; cursor: pointer; line-height: 1;
    padding: 4px 8px; border-radius: 6px;
  }
  .mob-hamburger:hover { background: rgba(179,0,196,.15); }

  /* ── Mobile overlay ── */
  .mob-overlay {
    display: none;
    position: fixed; inset: 0;
    background: rgba(0,0,0,.55);
    z-index: 400;
  }

  /* ── Responsive ── */
  @media (max-width: 800px) {
    .admin-root { height: auto; min-height: 100vh; overflow: visible; flex-direction: column; }
    .admin-main { overflow: visible; }
    .mob-header  { display: flex; }
    .mob-overlay.open { display: block; }
    .admin-sidebar {
      position: fixed !important;
      top: 0; bottom: 0; right: 0;
      height: 100vh !important;
      z-index: 500;
      transform: translateX(110%);
    }
    .admin-sidebar.mob-open { transform: translateX(0); }
  }
`;

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobOpen, setMobOpen] = useState(false);

  const isLogin = pathname === "/admin/login";

  const logout = async () => {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const closeSidebar = () => setMobOpen(false);

  if (isLogin) return <>{children}</>;

  return (
    <>
      <style>{CSS}</style>

      {/* Mobile overlay */}
      <div className={`mob-overlay${mobOpen ? " open" : ""}`} onClick={closeSidebar} />

      <div className="admin-root">

        {/* Mobile top header */}
        <header className="mob-header">
          <button className="mob-hamburger" aria-label="فتح القائمة" onClick={() => setMobOpen(true)}>☰</button>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>لوحة الإدارة</span>
          <div style={{ width: 40 }} />
        </header>

        {/* ── Sidebar ── */}
        <aside className={`admin-sidebar${mobOpen ? " mob-open" : ""}`}>
          <div className="sidebar-grid" />

          {/* Logo */}
          <div className="sidebar-logo">
            <div className="sidebar-logo-badge"><img src="/logo.png" alt="logo" /></div>
            <div className="sidebar-logo-text">
              <h2>لوحة الإدارة</h2>
              <p>مدارس الأفق العالمية</p>
            </div>
            <button onClick={closeSidebar} aria-label="إغلاق القائمة" style={{ marginInlineStart: "auto", background: "none", border: "none", color: "rgba(255,255,255,.6)", fontSize: 18, cursor: "pointer", display: "flex" }}>✕</button>
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav">
            <div className="nav-section-label">القائمة الرئيسية</div>

            {NAV_ITEMS.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`nav-link${pathname === item.href ? " active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}

            <div className="nav-section-label" style={{ marginTop: "1rem" }}>إدارة المحتوى</div>

            {CMS_ITEMS.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`nav-link${pathname === item.href ? " active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="sidebar-footer">
            <Link href="/ar" className="back-link">
              <span>🌐</span> العودة للموقع
            </Link>
            <button className="logout-btn" onClick={logout} disabled={loggingOut}>
              <span>🚪</span> {loggingOut ? "جاري الخروج..." : "تسجيل الخروج"}
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="admin-main">
          <AdminPageTransition>
            {children}
          </AdminPageTransition>
        </main>

      </div>
    </>
  );
}
