export const dynamic = "force-dynamic";
import { prisma } from "@/lib/db";
import Link from "next/link";

const CSS = `
  .stat-card {
    background: #fff; border-radius: 16px;
    border: 1px solid #E4E0EC;
    padding: 1.5rem; text-decoration: none; color: inherit;
    display: block; transition: transform .2s, box-shadow .2s;
  }
  .stat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(0,0,0,.09);
  }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: none; }
  }
  .stat-card:nth-child(1) { animation: cardIn .4s ease .05s both; }
  .stat-card:nth-child(2) { animation: cardIn .4s ease .1s both; }
  .stat-card:nth-child(3) { animation: cardIn .4s ease .15s both; }
  .stat-card:nth-child(4) { animation: cardIn .4s ease .2s both; }
  .quick-link {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 16px; border-radius: 10px;
    background: #F9FAFB; border: 1.5px solid #E4E0EC;
    text-decoration: none; color: #374151;
    font-size: 13.5px; font-weight: 600;
    transition: all .18s;
  }
  .quick-link:hover {
    background: #F0FDF8; border-color: rgba(122,36,178,.4);
    color: #7A24B2;
  }
`;

const QUICK_LINKS = [
  { label: "التسجيلات المعلقة", icon: "📋", href: "/admin/registrations" },
  { label: "الرسائل الجديدة",   icon: "✉️", href: "/admin/messages"      },
  { label: "الجولات المحجوزة",  icon: "🏫", href: "/admin/tours"         },
  { label: "فتح الموقع",        icon: "🌐", href: "/ar"                  },
];

export default async function AdminDashboard() {
  const [registrations, tours, events, messages, unread, pending] = await Promise.all([
    prisma.registration.count(),
    prisma.tourBooking.count(),
    prisma.eventRegistration.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { status: "unread" } }),
    prisma.registration.count({ where: { status: "pending" } }),
  ]);

  const cards = [
    { label: "طلبات التسجيل",     value: registrations, sub: `${pending} معلق`,       icon: "📋", accent: "#7A24B2", href: "/admin/registrations" },
    { label: "حجوزات الجولات",    value: tours,         sub: "إجمالي الحجوزات",        icon: "🏫", accent: "#7C3AED", href: "/admin/tours"         },
    { label: "تسجيلات الفعاليات", value: events,        sub: "يوم الاستكشاف ٢٠٢٦",   icon: "📅", accent: "#DC2626", href: "/admin/events"        },
    { label: "رسائل التواصل",     value: messages,      sub: `${unread} غير مقروءة`,  icon: "✉️", accent: "#D97706", href: "/admin/messages"      },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div style={{ padding: "2rem 2.5rem" }}>

        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#101828" }}>لوحة التحكم</h1>
          <p style={{ fontSize: 13.5, color: "#667085", marginTop: 4 }}>
            مرحباً بك في نظام إدارة مدارس الأفق العالمية
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2rem",
        }}>
          {cards.map((c, i) => (
            <Link key={i} href={c.href} className="stat-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: ".875rem" }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 12,
                  background: `${c.accent}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20,
                }}>
                  {c.icon}
                </div>
                <div style={{ fontSize: 30, fontWeight: 800, color: c.accent }}>
                  {c.value}
                </div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#101828", marginBottom: 2 }}>{c.label}</div>
              <div style={{ fontSize: 12, color: "#667085" }}>{c.sub}</div>
              <div style={{ height: 3, borderRadius: 2, marginTop: "1.25rem", background: `${c.accent}18` }}>
                <div style={{ height: "100%", width: "55%", borderRadius: 2, background: c.accent }} />
              </div>
            </Link>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E4E0EC", padding: "1.5rem" }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#101828", marginBottom: "1rem" }}>وصول سريع</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: ".75rem",
          }}>
            {QUICK_LINKS.map((l, i) => (
              <Link key={i} href={l.href} className="quick-link">
                <span style={{ fontSize: 16 }}>{l.icon}</span>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
