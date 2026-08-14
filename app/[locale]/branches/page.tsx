"use client";
import { useParams } from "next/navigation";
import { t, type Locale } from "@/lib/i18n";
import SubPage from "@/components/SubPage";

export default function BranchesPage() {
  const params  = useParams();
  const locale  = (params.locale as string) ?? "ar";
  const tr      = t[locale as Locale] ?? t.ar;
  const bp      = tr.branchesPage;
  const isRtl   = tr.dir === "rtl";

  const branches = [
    { info: bp.woroud, portal: bp.woroud.portal, grad: "linear-gradient(135deg,#B300C4 0%,#7A24B2 100%)" },
    { info: bp.laban,  portal: bp.laban.portal,  grad: "linear-gradient(135deg,#2D0864 0%,#7A24B2 100%)" },
  ];

  const portals = [
    { key: "student", label: bp.studentPortal, utype: 3, icon: "🎒", bg: "rgba(122,36,178,.06)", border: "rgba(122,36,178,.18)", hover: "#7A24B2" },
    { key: "parent",  label: bp.parentPortal,  utype: 2, icon: "👨‍👩‍👧", bg: "rgba(179,0,196,.06)", border: "rgba(179,0,196,.18)", hover: "#B300C4" },
    { key: "staff",   label: bp.staffPortal,   utype: 1, icon: "👩‍🏫", bg: "rgba(45,8,100,.06)",  border: "rgba(45,8,100,.18)",  hover: "#2D0864" },
  ];

  return (
    <SubPage locale={locale as Locale} title={bp.title} subtitle={bp.subtitle}>
      <style>{`
        .branch-portal-btn { transition: background .2s, color .2s, border-color .2s; }
        .branch-portal-btn:hover { color: #fff !important; }
        .branch-portal-btn.student:hover { background: #7A24B2 !important; border-color: #7A24B2 !important; }
        .branch-portal-btn.parent:hover  { background: #B300C4 !important; border-color: #B300C4 !important; }
        .branch-portal-btn.staff:hover   { background: #2D0864 !important; border-color: #2D0864 !important; }
        .branch-card { transition: transform .28s ease, box-shadow .28s ease; }
        .branch-card:hover { transform: translateY(-6px); box-shadow: 0 24px 60px rgba(0,0,0,.14) !important; }
      `}</style>

      <section style={{ background: "#F5F5F5", padding: "5rem 2rem", minHeight: "60vh" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>

          {/* Tag */}
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(122,36,178,.08)", color: "#7A24B2", padding: "5px 16px", borderRadius: 40, fontSize: 13, fontWeight: 700, border: "1px solid rgba(122,36,178,.14)" }}>
              <span style={{ width: 6, height: 6, background: "#7A24B2", borderRadius: "50%", display: "inline-block" }} />
              {bp.tag}
            </span>
          </div>

          {/* Branch cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "2rem" }}>
            {branches.map(({ info, portal, grad }, idx) => (
              <div key={idx} className="branch-card" style={{ background: "#fff", borderRadius: 24, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,.10)", border: "1px solid #E8E0F5" }}>

                {/* Header */}
                <div style={{ background: grad, padding: "2rem 2rem 1.5rem", color: "#fff" }}>
                  <div style={{ fontSize: 40, marginBottom: "0.75rem" }}>🏫</div>
                  <h2 style={{ fontFamily: "Amiri,serif", fontSize: 26, margin: "0 0 0.4rem", fontWeight: 700 }}>{info.name}</h2>
                  <p style={{ fontSize: 14, opacity: 0.8, margin: 0 }}>📍 {info.desc}</p>
                </div>

                {/* Portal links */}
                <div style={{ padding: "1.5rem 2rem 2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {portals.map(p => (
                    <a key={p.key}
                      href={`${portal}?Utype=${p.utype}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`branch-portal-btn ${p.key}`}
                      style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 12, background: p.bg, border: `1.5px solid ${p.border}`, textDecoration: "none", color: "#1A1A1A", fontFamily: "Cairo,sans-serif", fontWeight: 600, fontSize: 15 }}>
                      <span style={{ fontSize: 22 }}>{p.icon}</span>
                      <span>{p.label}</span>
                      <span style={{ marginInlineStart: "auto", fontSize: 18, opacity: 0.5 }}>{isRtl ? "←" : "→"}</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <p style={{ textAlign: "center", fontSize: 13, color: "#808080", marginTop: "2.5rem", lineHeight: 1.8 }}>
            {isRtl
              ? "يتم التوجيه إلى بوابة Horizon الإلكترونية عند النقر. يمكن التواصل مع إدارة المدرسة لأي استفسار."
              : "Clicking will redirect to the Horizon e-portal. Contact school administration for any enquiries."}
          </p>
        </div>
      </section>
    </SubPage>
  );
}
