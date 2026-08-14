import { type Locale } from "@/lib/i18n";
import SubPage from "@/components/SubPage";
import { slotImages } from "@/lib/slots";

const C = { dark: "#2D0864", gold: "#B300C4", bg: "#FAF7FF", muted: "#5A5A5A" };

export default async function MusicDramaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const isRtl = locale === "ar";
  const photos = await slotImages("activities-arts");

  return (
    <SubPage locale={locale} title={isRtl ? "الموسيقى والمسرح" : "Music & Drama"}>
      <section style={{ padding: "3rem 2rem 5rem", background: C.bg }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontSize: 16, lineHeight: 1.9, color: C.muted, marginBottom: "2.5rem", textAlign: "center", maxWidth: 700, margin: "0 auto 2.5rem" }}>
            {isRtl
              ? "الموسيقى والمسرح جزء أساسي من التعليم الشامل في الأفق العالمية، يعملان جنباً إلى جنب مع الأكاديمي والرياضة ورعاية الطلاب لتنمية الإبداع والثقة بالنفس ومهارات التواصل."
              : "Music and drama form a fundamental part of holistic education at Horizon International Schools, working alongside academics, sports, and student care to develop creativity, self-confidence, and communication skills."}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "2rem", marginBottom: "2.5rem" }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: "2rem", border: "1px solid #E8E0F5" }}>
              <div style={{ fontSize: 48, marginBottom: "1rem" }}>🎭</div>
              <h2 style={{ fontFamily: "Amiri,serif", fontSize: 22, color: C.dark, marginBottom: "1rem" }}>
                {isRtl ? "المسرح والتعبير الإبداعي" : "Drama & Creative Expression"}
              </h2>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.85 }}>
                {isRtl
                  ? "تُمكّن أنشطة المسرح الطلاب من بناء ثقتهم عبر الخطابة والأداء وتقديم الأفكار. يُركز البرنامج على القصص، ولعب الأدوار، والأنشطة الأدائية التي تُعلّم التواصل الواضح والإبداع التعاوني."
                  : "Drama activities enable students to build confidence through speaking, performing, and presenting ideas. The programme emphasises storytelling, role-playing, and performance that teach clear communication and collaborative creativity."}
              </p>
            </div>
            <div style={{ background: C.dark, borderRadius: 16, padding: "2rem", color: "#fff" }}>
              <div style={{ fontSize: 48, marginBottom: "1rem" }}>🎵</div>
              <h2 style={{ fontFamily: "Amiri,serif", fontSize: 22, color: C.gold, marginBottom: "1rem" }}>
                {isRtl ? "أكاديمية الأفق الموسيقية" : "Horizon Music Academy"}
              </h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,.8)", lineHeight: 1.85 }}>
                {isRtl
                  ? "تُقدم الأكاديمية تعليماً عالي الجودة على آلات موسيقية متنوعة للمبتدئين والمتقدمين على حد سواء، عبر دروس فردية وجماعية صغيرة مصممة وفق وتيرة كل طالب واهتماماته."
                  : "The Academy provides high-quality instruction on diverse musical instruments for beginners and advancing musicians, through individual and small-group lessons tailored to each student's pace and interests."}
              </p>
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 16, padding: "2rem", border: "1px solid #E8E0F5" }}>
            <h2 style={{ fontFamily: "Amiri,serif", fontSize: 20, color: C.dark, marginBottom: "1.25rem", textAlign: "center" }}>
              {isRtl ? "ما يكتسبه الطلاب" : "What Students Develop"}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.85rem" }}>
              {(isRtl ? ["الثقة بالنفس", "الانضباط والمثابرة", "الإبداع والخيال", "التعاون مع الآخرين", "التعبير الفني", "مهارات الأداء أمام الجمهور"] : ["Self-Confidence", "Discipline & Perseverance", "Creativity & Imagination", "Collaboration", "Artistic Expression", "Performance Skills"]).map((item, i) => (
                <div key={i} style={{ background: C.bg, borderRadius: 10, padding: "0.85rem 1rem", fontSize: 14, color: "#1A1A1A", textAlign: "center", border: `1px solid ${C.gold}40` }}>
                  {item}
                </div>
              ))}
            </div>
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
