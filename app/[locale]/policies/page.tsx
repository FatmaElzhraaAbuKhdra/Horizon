import { type Locale } from "@/lib/i18n";
import { getPolicies } from "@/lib/db-cache";

export const dynamic = "force-dynamic";
import SubPage from "@/components/SubPage";

const C = { dark: "#2D0864", gold: "#B300C4", bg: "#FAF7FF", muted: "#5A5A5A" };

const DOCS = [
  { file: "school-policies.pdf",   en: "School Policies Manual 2025–2026",   ar: "دليل سياسات المدرسة ٢٠٢٥–٢٠٢٦" },
  { file: "code-of-conduct.pdf",   en: "Code of Conduct",                    ar: "قواعد السلوك" },
  { file: "student-handbook.pdf",  en: "Student Handbook 2026/2027",         ar: "دليل الطالب ٢٠٢٦/٢٠٢٧" },
  { file: "parent-handbook.pdf",   en: "Parent Handbook",                    ar: "دليل أولياء الأمور" },
  { file: "emergency-policy.pdf",  en: "Emergency Policy",                   ar: "سياسة الطوارئ" },
];

export default async function PoliciesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const isRtl = locale === "ar";

  const policies = await getPolicies();

  type PolicyItem = (typeof policies)[number];
  const grouped = policies.reduce((acc: Record<string, PolicyItem[]>, p) => {
    const key = isRtl ? p.categoryAr : p.categoryEn;
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  return (
    <SubPage locale={locale} title={isRtl ? "سياسات المدرسة" : "School Policies"}>
      <section style={{ padding: "3rem 2rem 5rem", background: C.bg }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.85, marginBottom: "3rem", textAlign: "center" }}>
            {isRtl
              ? "تعكس سياساتنا التزامنا بتوفير بيئة تعليمية آمنة ومنظمة، مبنية على أسس التعليم البريطاني المستقل."
              : "Our policies reflect our commitment to providing a safe, well-organized learning environment built on British independent education standards."}
          </p>
          <div style={{ display: "grid", gap: "2rem" }}>
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8E0F5", overflow: "hidden" }}>
              <div style={{ background: C.dark, padding: "1rem 1.5rem" }}>
                <h2 style={{ color: C.gold, fontSize: 16, fontWeight: 700, margin: 0 }}>{isRtl ? "الوثائق الرسمية" : "Official Documents"}</h2>
              </div>
              <div style={{ padding: "0.5rem" }}>
                {DOCS.map((d, i) => (
                  <div key={d.file} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "0.85rem 1rem", borderBottom: i < DOCS.length - 1 ? "1px solid #F0EBE3" : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span style={{ color: C.gold, fontSize: 18 }}>📄</span>
                      <span style={{ fontSize: 14, color: "#1A1A1A" }}>{isRtl ? d.ar : d.en}</span>
                    </div>
                    <a href={`/docs/${d.file}`} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: C.dark, border: `1px solid ${C.dark}`, borderRadius: 20, padding: "3px 12px", textDecoration: "none", whiteSpace: "nowrap" }}>
                      {isRtl ? "تحميل" : "Download"}
                    </a>
                  </div>
                ))}
              </div>
            </div>
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat} style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8E0F5", overflow: "hidden" }}>
                <div style={{ background: C.dark, padding: "1rem 1.5rem" }}>
                  <h2 style={{ color: C.gold, fontSize: 16, fontWeight: 700, margin: 0 }}>{cat}</h2>
                </div>
                <div style={{ padding: "0.5rem" }}>
                  {items.map((p, i) => (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.85rem 1rem", borderBottom: i < items.length - 1 ? "1px solid #F0EBE3" : "none" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{ color: C.gold, fontSize: 18 }}>📄</span>
                        <span style={{ fontSize: 14, color: "#1A1A1A" }}>{isRtl ? p.titleAr : p.titleEn}</span>
                      </div>
                      {p.fileUrl && (
                        <a href={p.fileUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: C.dark, border: `1px solid ${C.dark}`, borderRadius: 20, padding: "3px 12px", textDecoration: "none", whiteSpace: "nowrap" }}>
                          {isRtl ? "تحميل" : "Download"}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "2.5rem", background: C.dark, borderRadius: 12, padding: "1.5rem", color: "rgba(255,255,255,.75)", fontSize: 14, textAlign: "center" }}>
            {isRtl
              ? "للحصول على نسخة من أي سياسة أو للاستفسار، تواصل معنا على info@aldenhamprepriyadh.com"
              : "To obtain a copy of any policy or for enquiries, contact us at info@aldenhamprepriyadh.com"}
          </div>
        </div>
      </section>
    </SubPage>
  );
}
