import { type Locale } from "@/lib/i18n";
import SubPage from "@/components/SubPage";
import { slotImages } from "@/lib/slots";

const C = { dark: "#2D0864", gold: "#B300C4", bg: "#FAF7FF", muted: "#5A5A5A" };

export default async function AldenhamUKPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const isRtl = locale === "ar";
  const galleryImgs = await slotImages("uk-gallery");

  const alumni = [
    { nameAr: "البارونة كارين برادي", nameEn: "Baroness Karen Brady", roleAr: "رائدة أعمال", roleEn: "Entrepreneur" },
    { nameAr: "مات والاس", nameEn: "Matt Wallace", roleAr: "لاعب جولف محترف", roleEn: "Professional Golfer" },
    { nameAr: "البروفيسور السير مارتن سويتنج", nameEn: "Prof. Sir Martin Sweeting", roleAr: "عالم فضاء", roleEn: "Space Scientist" },
  ];

  return (
    <SubPage locale={locale} title={isRtl ? "مدرسة ألدنهام — المملكة المتحدة" : "Aldenham School — United Kingdom"}>
      <section style={{ padding: "3rem 2rem 5rem", background: C.bg }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ background: C.dark, borderRadius: 20, padding: "3rem", color: "#fff", marginBottom: "2.5rem", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: "0.75rem" }}>🏛️</div>
            <div style={{ color: C.gold, fontSize: 13, fontWeight: 700, letterSpacing: 2, marginBottom: "0.5rem" }}>EST. 1597</div>
            <h2 style={{ fontFamily: "Amiri,serif", fontSize: 32, color: "#fff", marginBottom: "1rem" }}>
              {isRtl ? "إرث يمتد لأكثر من ٤٢٨ عاماً" : "A Legacy Spanning 428+ Years"}
            </h2>
            <p style={{ color: "rgba(255,255,255,.8)", lineHeight: 1.85, maxWidth: 600, margin: "0 auto", fontSize: 15 }}>
              {isRtl
                ? "تأسست مدرسة ألدنهام عام ١٥٩٧ بموجب مرسوم ملكي من الملكة إليزابيث الأولى، وتُعدّ من أقدم المدارس البريطانية التي لا تزال تعمل حتى اليوم في حرمها الجامعي التاريخي شمال لندن."
                : "Established in 1597 by royal charter from Queen Elizabeth I, Aldenham is one of the world's oldest continuously operating schools, located on its historic campus north of London."}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
            {[
              { icon: "🎓", titleAr: "التميز الأكاديمي", titleEn: "Academic Excellence", bodyAr: "يلتحق الطلاب باستمرار بأعرق الجامعات البريطانية والدولية. تجمع المدرسة بين التدريس الأكاديمي المتميز وبيئة تدعم الفضول الفكري والطموح.", bodyEn: "Students consistently gain admission to leading UK and international universities. The school combines superior academic teaching with an environment supporting intellectual curiosity and ambition." },
              { icon: "🏆", titleAr: "الإرث الرياضي", titleEn: "Sporting Heritage", bodyAr: "في عام ١٨٢٥، أصبحت ألدنهام من أوائل المؤسسات التعليمية التي وضعت قواعد رسمية لكرة القدم، مما جعل ناديها من أقدم الأندية الكروية في العالم.", bodyEn: "In 1825, Aldenham became one of the earliest institutions to formally establish rules for football, making its club one of the oldest organized football clubs in the world." },
              { icon: "🌱", titleAr: "تنمية الشخصية", titleEn: "Character Development", bodyAr: "تتجاوز المدرسة التميز الأكاديمي لتشمل النزاهة والمسؤولية والإنجاز الرياضي والفني والثقافي، مع رعاية تربوية قوية وروح مجتمعية راسخة.", bodyEn: "The school goes beyond academic excellence to encompass integrity, responsibility, athletic and artistic achievement, with strong pastoral care and community spirit." },
              { icon: "🔗", titleAr: "الرابط مع الرياض", titleEn: "Connection to Riyadh", bodyAr: "يحمل فرع الرياض نفس القيم والمعايير الأكاديمية مباشرةً من المؤسسة الأم. يحصل الطلاب على ممرات تحويل ذات أولوية إلى مدرسة المملكة المتحدة.", bodyEn: "The Riyadh campus carries the same values and academic standards directly from the parent institution. Students receive priority transfer pathways to the UK school." },
            ].map((card, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "1.75rem", border: "1px solid #E8E0F5" }}>
                <div style={{ fontSize: 32, marginBottom: "0.75rem" }}>{card.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: C.dark, marginBottom: "0.6rem" }}>{isRtl ? card.titleAr : card.titleEn}</h3>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8 }}>{isRtl ? card.bodyAr : card.bodyEn}</p>
              </div>
            ))}
          </div>

          <div style={{ background: "#fff", borderRadius: 16, padding: "2rem", border: "1px solid #E8E0F5" }}>
            <h2 style={{ fontFamily: "Amiri,serif", fontSize: 22, color: C.dark, marginBottom: "1.5rem", textAlign: "center" }}>
              {isRtl ? "خريجون بارزون" : "Notable Alumni"}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "1rem" }}>
              {alumni.map((a, i) => (
                <div key={i} style={{ textAlign: "center", padding: "1rem", background: C.bg, borderRadius: 10 }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.dark, margin: "0 auto 0.75rem", display: "flex", alignItems: "center", justifyContent: "center", color: C.gold, fontSize: 20 }}>⭐</div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#1A1A1A" }}>{isRtl ? a.nameAr : a.nameEn}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{isRtl ? a.roleAr : a.roleEn}</div>
                </div>
              ))}
            </div>
          </div>
          {galleryImgs.length > 0 && (
            <div style={{ background: "#fff", borderRadius: 16, padding: "2rem", border: "1px solid #E8E0F5", marginTop: "2rem" }}>
              <h2 style={{ fontFamily: "Amiri,serif", fontSize: 20, color: C.dark, marginBottom: "1.25rem", textAlign: "center" }}>
                {isRtl ? "من حرم المدرسة الأم" : "From the UK Campus"}
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "1rem" }}>
                {galleryImgs.map((src, i) => (
                  <div key={i} style={{ borderRadius: 12, overflow: "hidden", aspectRatio: "3/2" }}>
                    <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </SubPage>
  );
}
