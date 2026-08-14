import { type Locale, t } from "@/lib/i18n";
import SubPage from "@/components/SubPage";

const artsPrograms = [
  { icon: "🎭", titleAr: "المسرح والدراما", titleEn: "Theatre & Drama", descAr: "برامج مسرحية متكاملة تنمي الثقة بالنفس والتعبير الإبداعي لدى الطلاب من خلال العروض السنوية والورش التدريبية.", descEn: "Comprehensive drama programs that build confidence and creative expression through annual productions and workshops.", tags: ["مسرح", "أداء", "إبداع"] },
  { icon: "🎵", titleAr: "الموسيقى", titleEn: "Music", descAr: "دروس الموسيقى وعزف الآلات الموسيقية وأوركسترا المدرسة — تنمية الحس الفني والانضباط من سن مبكرة.", descEn: "Instrumental lessons, school orchestra and music theory — developing artistry and discipline from an early age.", tags: ["بيانو", "غيتار", "أوركسترا"] },
  { icon: "🎨", titleAr: "الفنون البصرية", titleEn: "Visual Arts", descAr: "استكشاف الرسم والتصوير والفنون الرقمية في بيئة إبداعية مجهزة بأحدث الأدوات والمواد الفنية.", descEn: "Exploring drawing, painting and digital arts in a creative environment equipped with the latest tools.", tags: ["رسم", "تصوير", "فن رقمي"] },
  { icon: "⚽", titleAr: "الرياضة", titleEn: "Sports", descAr: "برامج رياضية شاملة تشمل كرة القدم والسباحة والألعاب الجماعية مع تطوير روح الفريق والقيادة.", descEn: "Comprehensive sports programs including football, swimming and team games alongside leadership development.", tags: ["كرة قدم", "سباحة", "ألعاب جماعية"] },
];

export default async function ArtsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const tr = t[locale];
  const isAr = locale === "ar";
  const C = { primaryDark: "#2D0864", secondary: "#B300C4", secondaryLight: "#FDE8FF", bg: "#FAF7FF", card: "#fff", border: "#E8E0F5", muted: "#5A5A5A" };

  const cardCss = `
    .arts-card { transition: transform .3s cubic-bezier(.22,.68,0,1.2), box-shadow .3s ease; }
    .arts-card:hover { transform: translateY(-8px); box-shadow: 0 20px 56px rgba(90,23,133,.16); }
  `;

  return (
    <SubPage locale={locale} title={tr.nav.arts}>
      <style>{cardCss}</style>
      <section style={{ padding: "5rem 2rem", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Intro */}
          <div style={{ background: `linear-gradient(135deg, ${C.primaryDark}, #6B1EA5)`, borderRadius: 20, padding: "3rem", color: "#fff", marginBottom: "2.5rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(179,0,196,.12)", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2.5, color: C.secondaryLight, marginBottom: "1rem", textTransform: "uppercase" }}>
                {isAr ? "الفنون والأنشطة" : "Arts & Activities"}
              </div>
              <h2 style={{ fontFamily: "Amiri,serif", fontSize: "clamp(24px,3.5vw,40px)", color: "#fff", marginBottom: "1rem", lineHeight: 1.3 }}>
                {isAr ? "نُطوّر الفنان في كل طالب" : "Developing the artist in every student"}
              </h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,.75)", maxWidth: 600, lineHeight: 1.85 }}>
                {isAr
                  ? "في ألدنهام، نؤمن بأن الفنون والأنشطة الرياضية ليست إضافات — بل هي ركيزة أساسية في بناء شخصية الطالب المتكاملة."
                  : "At Aldenham, we believe arts and sports are not extras — they are a core pillar in developing a well-rounded student."}
              </p>
            </div>
          </div>

          {/* Programs grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.5rem" }}>
            {artsPrograms.map((p, i) => (
              <div key={i} className="arts-card" style={{ background: C.card, borderRadius: 20, padding: "2rem", border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 44, marginBottom: "1.25rem" }}>{p.icon}</div>
                <h3 style={{ fontFamily: "Amiri,serif", fontSize: 22, color: C.primaryDark, marginBottom: ".75rem" }}>
                  {isAr ? p.titleAr : p.titleEn}
                </h3>
                <p style={{ fontSize: 14.5, color: C.muted, lineHeight: 1.8, marginBottom: "1.25rem" }}>
                  {isAr ? p.descAr : p.descEn}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {p.tags.map((tag, j) => (
                    <span key={j} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 20, background: "rgba(122,36,178,.08)", color: "#7A24B2", border: "1px solid rgba(122,36,178,.14)", fontWeight: 600 }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SubPage>
  );
}
