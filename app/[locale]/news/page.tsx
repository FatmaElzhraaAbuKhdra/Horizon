import { type Locale, t } from "@/lib/i18n";
import { getNews } from "@/lib/db-cache";
import SubPage from "@/components/SubPage";

export const dynamic = "force-dynamic";

const FALLBACK = [
  { id: "1", icon: "🏆", date: "2026-05-10", titleAr: "طلابنا يفوزون في بطولة الرياضيات الإقليمية", titleEn: "Our Students Win Regional Maths Championship", descAr: "أحرز طلاب مدارس الأفق العالمية المركز الأول في بطولة الرياضيات الإقليمية المقامة بالرياض.", descEn: "Horizon International Schools students secured first place in the Regional Mathematics Championship held in Riyadh." },
  { id: "2", icon: "🎭", date: "2026-04-20", titleAr: "العرض المسرحي السنوي ٢٠٢٦", titleEn: "Annual Drama Production 2026", descAr: "عرض مسرحي مذهل قدمه طلاب المرحلة الإعدادية أمام حشد من أولياء الأمور والضيوف.", descEn: "A stunning theatrical performance presented by Prep students to an audience of parents and guests." },
  { id: "3", icon: "📚", date: "2026-03-15", titleAr: "إطلاق نادي القراءة المدرسي", titleEn: "School Reading Club Launch", descAr: "إطلاق نادي القراءة الجديد بمشاركة واسعة من الطلاب وتحت إشراف مكتبة المدرسة الحديثة.", descEn: "Launch of the new Reading Club with wide student participation under the supervision of the school's modern library." },
];

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const tr = t[locale];
  const C = { primaryDark: "#2D0864", secondary: "#B300C4", bg: "#FAF7FF", card: "#fff", border: "#E8E0F5", muted: "#5A5A5A", light: "#8A8A8A" };
  const isAr = locale === "ar";

  let dbItems: typeof FALLBACK = [];
  try {
    const rows = await getNews();
    if (rows.length > 0) dbItems = rows.map(r => ({ id: r.id, icon: r.icon, date: r.date, titleAr: r.titleAr, titleEn: r.titleEn, descAr: r.descAr, descEn: r.descEn }));
  } catch {}

  const items = dbItems.length > 0 ? dbItems : FALLBACK;

  return (
    <SubPage locale={locale} title={tr.nav.news}>
      <section style={{ padding: "5rem 2rem", background: C.bg }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gap: "1.5rem" }}>
          {items.map((item) => (
            <div key={item.id} style={{ background: C.card, borderRadius: 20, padding: "2rem", border: `1px solid ${C.border}`, display: "flex", gap: "1.5rem" }}>
              <div style={{ fontSize: 40, flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: 12, color: C.light, marginBottom: "0.5rem" }}>{item.date}</div>
                <h3 style={{ fontFamily: "Amiri,serif", fontSize: 22, color: C.primaryDark, marginBottom: "0.75rem" }}>
                  {isAr ? item.titleAr : item.titleEn}
                </h3>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8 }}>
                  {isAr ? item.descAr : item.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SubPage>
  );
}
