import { type Locale } from "@/lib/i18n";
import { prisma } from "@/lib/db";
import { TERM_DATES_SEED } from "@/lib/seed-data";

export const dynamic = "force-dynamic";
import SubPage from "@/components/SubPage";

const C = { dark: "#2D0864", gold: "#B300C4", bg: "#FAF7FF", muted: "#5A5A5A" };

export default async function TermDatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const isRtl = locale === "ar";

  let terms = await prisma.termDate.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []);
  if (terms.length === 0) {
    await prisma.termDate.createMany({ data: TERM_DATES_SEED }).catch(() => {});
    terms = await prisma.termDate.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []);
  }

  const termColors = ["#7A24B2", "#B300C4", "#2D0864"];

  return (
    <SubPage locale={locale} title={isRtl ? "تواريخ الفصول الدراسية" : "Term Dates"}>
      <section style={{ padding: "3rem 2rem 5rem", background: C.bg }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ background: C.dark, borderRadius: 16, padding: "1.5rem 2rem", color: "rgba(255,255,255,.8)", fontSize: 14, lineHeight: 1.8, marginBottom: "2.5rem", textAlign: "center" }}>
            {isRtl
              ? "تتبع مدارس الأفق العالمية الهيكل الأكاديمي الدولي المكوّن من ثلاثة فصول دراسية، مع أخذ التقويم الوطني للمملكة العربية السعودية بعين الاعتبار."
              : "Horizon International Schools follows a three-term international academic structure, adapted to the Kingdom's national calendar."}
          </div>
          <div style={{ display: "grid", gap: "1.5rem" }}>
            {terms.map((term, i) => (
              <div key={term.id} style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8E0F5", overflow: "hidden" }}>
                <div style={{ background: termColors[i % 3], padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>{term.termNumber}</div>
                  <h2 style={{ color: "#fff", fontSize: 18, margin: 0 }}>{isRtl ? term.labelAr : term.labelEn}</h2>
                  <span style={{ marginInlineStart: "auto", color: "rgba(255,255,255,.7)", fontSize: 12 }}>{term.year}</span>
                </div>
                <div style={{ padding: "1.5rem", display: "grid", gridTemplateColumns: term.halfTermStartEn ? "1fr 1fr" : "1fr", gap: "1rem" }}>
                  <div>
                    <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: "0.4rem" }}>{isRtl ? "تاريخ البداية" : "Start Date"}</div>
                    <div style={{ fontSize: 15, color: "#1A1A1A", fontWeight: 500 }}>{isRtl ? term.startAr : term.startEn}</div>
                    <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginTop: "0.85rem", marginBottom: "0.4rem" }}>{isRtl ? "تاريخ النهاية" : "End Date"}</div>
                    <div style={{ fontSize: 15, color: "#1A1A1A", fontWeight: 500 }}>{isRtl ? term.endAr : term.endEn}</div>
                  </div>
                  {term.halfTermStartEn && (
                    <div style={{ background: C.bg, borderRadius: 10, padding: "1rem" }}>
                      <div style={{ fontSize: 12, color: C.gold, fontWeight: 700, marginBottom: "0.5rem" }}>{isRtl ? "🏖️ إجازة منتصف الفصل" : "🏖️ Half-Term Break"}</div>
                      <div style={{ fontSize: 14, color: "#1A1A1A" }}>{isRtl ? term.halfTermStartAr : term.halfTermStartEn}</div>
                      <div style={{ fontSize: 13, color: C.muted, margin: "0.25rem 0" }}>—</div>
                      <div style={{ fontSize: 14, color: "#1A1A1A" }}>{isRtl ? term.halfTermEndAr : term.halfTermEndEn}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "2rem", padding: "1.25rem", background: "#fff", borderRadius: 12, border: "1px solid #E8E0F5", fontSize: 13, color: C.muted, lineHeight: 1.8 }}>
            <strong style={{ color: C.dark }}>⚠️ {isRtl ? "ملاحظة:" : "Note:"}</strong>{" "}
            {isRtl
              ? "الغياب خلال فترات التقييم غير مقبول للحفاظ على استمرارية المنهج الدراسي. يُنصح بعدم حجز الإجازات خلال أوقات الدراسة."
              : "Absence during assessment periods is not permitted to maintain curriculum continuity. Holiday bookings during term time are strongly discouraged."}
          </div>
        </div>
      </section>
    </SubPage>
  );
}
