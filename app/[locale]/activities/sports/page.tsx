import { type Locale } from "@/lib/i18n";
import SubPage from "@/components/SubPage";
import { slotImages } from "@/lib/slots";

const C = { dark: "#2D0864", gold: "#B300C4", bg: "#FAF7FF", muted: "#5A5A5A" };

export default async function SportsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const isRtl = locale === "ar";
  const photos = await slotImages("activities-sports");

  const sports = isRtl
    ? ["⚽ كرة القدم", "🏀 كرة السلة", "🏃 ألعاب القوى", "🏸 الريشة الطائرة", "🏓 تنس الطاولة", "💪 اللياقة البدنية"]
    : ["⚽ Football", "🏀 Basketball", "🏃 Athletics", "🏸 Badminton", "🏓 Table Tennis", "💪 Physical Conditioning"];

  return (
    <SubPage locale={locale} title={isRtl ? "الرياضة في الأفق العالمية" : "Sports at Horizon International Schools"}>
      <section style={{ padding: "3rem 2rem 5rem", background: C.bg }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "2rem", marginBottom: "2.5rem" }}>
            <div>
              <h2 style={{ fontFamily: "Amiri,serif", fontSize: 24, color: C.dark, marginBottom: "1rem" }}>
                {isRtl ? "الرياضة في صميم تنمية الشخصية" : "Sport at the Heart of Character Development"}
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.9, color: C.muted, marginBottom: "1rem" }}>
                {isRtl
                  ? "التزام مدارس الأفق بالرياضة متجذر في قيمها التعليمية. نؤمن بأن التربية البدنية تنمّي الثقة والمثابرة والعمل الجماعي والقيادة جنباً إلى جنب مع التميز الأكاديمي."
                  : "Horizon's commitment to sport is rooted in our educational values. We believe physical education develops confidence, perseverance, teamwork, and leadership alongside academic excellence."}
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.9, color: C.muted }}>
                {isRtl
                  ? "تُقدم مدارس الأفق العالمية برامج رياضية متكاملة تجمع بين التدريب الاحترافي والمشاركة في البطولات المحلية، لبناء جيل رياضي واعٍ ومتوازن."
                  : "Horizon International Schools offers comprehensive sports programmes combining professional training and local tournament participation, building a well-rounded and sports-aware generation."}
              </p>
            </div>
            <div style={{ background: C.dark, borderRadius: 16, padding: "2rem", color: "#fff" }}>
              <h3 style={{ color: C.gold, marginBottom: "1rem", fontSize: 17 }}>{isRtl ? "التقويم الرياضي" : "Sports Calendar"}</h3>
              {(isRtl ? [
                "مباريات فرق المدرسة",
                "يوم الرياضة السنوي",
                "المباريات والبطولات الودية",
                "الفعاليات الرياضية الجماعية على مدار العام",
              ] : [
                "School team competitions",
                "Annual Sports Day",
                "Friendly matches and tournaments",
                "Year-round group sporting events",
              ]).map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "center", padding: "0.6rem 0", borderBottom: "1px solid rgba(255,255,255,.1)", fontSize: 14, color: "rgba(255,255,255,.8)" }}>
                  <span style={{ color: C.gold }}>🏆</span>{item}
                </div>
              ))}
            </div>
          </div>
          <h2 style={{ fontFamily: "Amiri,serif", fontSize: 22, color: C.dark, marginBottom: "1.25rem" }}>
            {isRtl ? "الرياضات المتاحة" : "Sports Offered"}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.85rem" }}>
            {sports.map((s, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 10, padding: "1rem 1.25rem", border: "1px solid #E8E0F5", fontSize: 15, fontWeight: 500, color: "#1A1A1A", textAlign: "center" }}>
                {s}
              </div>
            ))}
          </div>
          {photos.length > 0 && (
            <div style={{ marginTop: "2.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "1rem" }}>
              {photos.map((src, i) => (
                <div key={i} style={{ borderRadius: 14, overflow: "hidden", aspectRatio: "4/3" }}>
                  <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </SubPage>
  );
}
