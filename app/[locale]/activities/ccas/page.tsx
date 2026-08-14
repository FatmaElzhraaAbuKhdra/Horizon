import { type Locale } from "@/lib/i18n";
import SubPage from "@/components/SubPage";
import { slotImages } from "@/lib/slots";

const C = { dark: "#2D0864", gold: "#B300C4", bg: "#FAF7FF", muted: "#5A5A5A" };

export default async function CCAsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const isRtl = locale === "ar";
  const photos = await slotImages("activities-ccas");

  const categories = isRtl ? [
    { icon: "⚽", title: "الرياضة والتربية البدنية", color: "#1A6BC8", items: ["كرة القدم (أكاديمية يوفنتوس)", "كرة السلة وكرة الطائرة", "الكريكيت والريشة الطائرة", "تنس الطاولة", "اللياقة البدنية"] },
    { icon: "🎭", title: "الفنون الأدائية والإبداع", color: "#7B3FA0", items: ["دروس موسيقية وتدريب على الآلات", "الغناء وفرقة الجوقة", "الرقص والباليه", "المسرح والعروض الفنية", "أندية الفن والتصميم"] },
    { icon: "🧠", title: "الإثراء الأكاديمي واللغات", color: "#7A24B2", items: ["الشطرنج وأندية الرياضيات", "الأنشطة العلمية وحل المشكلات", "أندية اللغة (العربية والألمانية)", "النقاش والمنافسات الأكاديمية"] },
    { icon: "🌱", title: "القيادة والتنمية الشخصية", color: "#C8320A", items: ["المطبوعات الطلابية", "أندية الصحة النفسية واليقظة الذهنية", "مبادرات خدمة المجتمع", "البرامج البيئية والتوعوية"] },
  ] : [
    { icon: "⚽", title: "Sports & Physical Education", color: "#1A6BC8", items: ["Football (Juventus Academy)", "Basketball & Volleyball", "Cricket, Badminton & Table Tennis", "Physical Fitness & Conditioning"] },
    { icon: "🎭", title: "Performing Arts & Creative", color: "#7B3FA0", items: ["Instrumental Music Lessons", "Singing & Choir Groups", "Dance & Ballet", "Theatre & Performances", "Art & Design Clubs"] },
    { icon: "🧠", title: "Academic Enrichment & Languages", color: "#7A24B2", items: ["Chess & Maths Clubs", "Science Activities & Problem-Solving", "Language Clubs (Arabic, German)", "Debate & Academic Competitions"] },
    { icon: "🌱", title: "Leadership & Personal Development", color: "#C8320A", items: ["Student Publications", "Mindfulness & Wellbeing Clubs", "Community Service Initiatives", "Environmental Awareness Programmes"] },
  ];

  return (
    <SubPage locale={locale} title={isRtl ? "الأنشطة اللامنهجية (CCA)" : "Co-Curricular Activities (CCA)"}>
      <section style={{ padding: "3rem 2rem 5rem", background: C.bg }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ background: C.dark, borderRadius: 16, padding: "2rem", color: "#fff", textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{ fontSize: 48, marginBottom: "0.75rem" }}>🌟</div>
            <div style={{ color: C.gold, fontSize: 28, fontWeight: 700, marginBottom: "0.5rem" }}>120+</div>
            <p style={{ color: "rgba(255,255,255,.8)", fontSize: 15 }}>
              {isRtl ? "أكثر من ١٢٠ جلسة أسبوعية من الأنشطة اللامنهجية المتنوعة" : "Over 120 weekly co-curricular sessions across diverse disciplines"}
            </p>
          </div>
          <div style={{ display: "grid", gap: "1.5rem" }}>
            {categories.map((cat, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8E0F5", overflow: "hidden" }}>
                <div style={{ background: cat.color, padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: 24 }}>{cat.icon}</span>
                  <h2 style={{ color: "#fff", fontSize: 17, margin: 0 }}>{cat.title}</h2>
                </div>
                <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {cat.items.map((item, j) => (
                    <span key={j} style={{ background: cat.color + "14", color: cat.color, fontSize: 13, padding: "5px 14px", borderRadius: 20 }}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: "2rem", fontSize: 13, color: C.muted, textAlign: "center" }}>
            {isRtl ? "* معظم الأنشطة مجانية. قد تُطبّق رسوم إضافية على البرامج الخارجية المتخصصة." : "* Most activities are free of charge. Specialized external programmes may carry additional fees."}
          </p>
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
