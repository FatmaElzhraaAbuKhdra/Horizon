import { type Locale } from "@/lib/i18n";
import SubPage from "@/components/SubPage";
import { AnimateIn, StaggerIn } from "@/components/AnimateIn";
import { slotImages, slotImage } from "@/lib/slots";
import { prisma } from "@/lib/db";

const C = { dark: "#2D0864", gold: "#B300C4", bg: "#FAF7FF", muted: "#5A5A5A", border: "#E8E0F5" };

const D_AR = "تُعدّ المرحلة الأساسية الثانية في مدرسة ألدنهام بالرياض منهجًا دراسيًا واسعًا وطموحًا، يتسم بتزايد التحدي والاستقلالية. التركيز على الإتقان والفهم المفاهيمي والتفكير الواضح — تعلم الشرح والحل والتأمل.\n\nبدءاً من الصف الخامس، يتم تقديم تدريس متخصص منفصل في الرياضيات والعلوم واللغة الإنجليزية والعلوم الإنسانية — بداية ما يُمكن اعتباره مدرسة ثانوية ابتدائية.";
const D_EN = "Key Stage 2 at Aldenham Prep Riyadh offers a broad and ambitious curriculum, characterised by increasing challenge and independence. Focus on mastery, conceptual understanding and clear thinking — learning to explain, solve and reflect.\n\nFrom Year 5, separate specialist teaching is introduced in Mathematics, Science, English and Humanities — the beginning of a junior secondary school approach.";

const css = `
@keyframes floatY{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
@keyframes numberPop{ 0%{opacity:0;transform:scale(.5)} 70%{transform:scale(1.15)} 100%{opacity:1;transform:scale(1)} }
.float-icon{ animation:floatY 3.5s ease-in-out infinite; }
.subject-row{ transition:transform .2s,background .2s; }
.subject-row:hover{ background:#EEF7F5 !important; transform:translateX(-3px); }
.num-badge{ animation:numberPop .4s cubic-bezier(.22,1,.36,1) both; }
`;

export default async function KS2Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const isRtl = locale === "ar";
  const lang: "ar" | "en" = isRtl ? "ar" : "en";

  const [photos, heroImg, allSettings] = await Promise.all([
    slotImages("curriculum-ks2"),
    slotImage("about-hero"),
    prisma.schoolSetting.findMany({ where: { key: "academic.ks2" } }).catch(() => []),
  ]);

  const row = allSettings[0];
  const body = (lang === "ar" ? row?.valAr : row?.valEn) || (isRtl ? D_AR : D_EN);

  const subjects = isRtl
    ? ["اللغة الإنجليزية", "الرياضيات", "العلوم", "الإنسانيات العالمية (التاريخ والجغرافيا)", "اللغة العربية", "اللغة الفرنسية", "الحوسبة", "الفنون والتصميم", "الموسيقى", "التربية البدنية", "التربية الصحية والشخصية (PSHE)"]
    : ["English", "Mathematics", "Science", "Global Humanities (History & Geography)", "Arabic Language", "French", "Computing", "Arts & Design", "Music", "Physical Education", "PSHE & Character Development"];

  return (
    <SubPage locale={locale} title={isRtl ? "المرحلة الثانية (KS2)" : "Key Stage 2 (KS2)"} subtitle={isRtl ? "٧ – ١١ سنة" : "Ages 7–11"} heroImage={heroImg}>
      <style>{css}</style>
      <section style={{ padding: "3rem 2rem 5rem", background: C.bg }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <StaggerIn stagger={150} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "2rem", marginBottom: "2.5rem" }}>
            <div>
              {body.split("\n\n").filter(Boolean).map((p, i) => (
                <p key={i} style={{ fontSize: 16, lineHeight: 1.9, color: C.muted, marginBottom: "1.5rem" }}>{p}</p>
              ))}
            </div>
            <div style={{ background: C.dark, borderRadius: 16, padding: "1.5rem", color: "#fff", textAlign: "center" }}>
              <div className="float-icon" style={{ fontSize: 48, marginBottom: "0.5rem", display: "inline-block" }}>🔬</div>
              <div style={{ color: C.gold, fontSize: 13, fontWeight: 700 }}>{isRtl ? "الفئة العمرية" : "Age Group"}</div>
              <div style={{ fontSize: 24, fontWeight: 700, margin: "0.5rem 0" }}>{isRtl ? "٧ – ١١ سنة" : "7 – 11 Years"}</div>
              <div style={{ color: "rgba(255,255,255,.7)", fontSize: 13 }}>Grades 3–6</div>
            </div>
          </StaggerIn>

          <AnimateIn from="bottom" delay={0}>
            <h2 style={{ fontFamily: "Amiri,serif", fontSize: 22, color: C.dark, marginBottom: "1.25rem" }}>
              {isRtl ? `${subjects.length} مجالاً للتعلم` : `${subjects.length} Learning Fields`}
            </h2>
          </AnimateIn>
          <StaggerIn stagger={45} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "0.85rem" }}>
            {subjects.map((s, i) => (
              <div key={i} className="subject-row" style={{ background: "#fff", borderRadius: 10, padding: "1rem 1.25rem", border: `1px solid ${C.border}`, display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <span className="num-badge" style={{ color: "#fff", background: "#7C3AED", fontWeight: 800, fontSize: 13, width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, animationDelay: `${i * 45}ms` }}>{i + 1}</span>
                <span style={{ fontSize: 14, color: "#1A1A1A" }}>{s}</span>
              </div>
            ))}
          </StaggerIn>

          {photos.length > 0 && (
            <AnimateIn from="bottom" delay={0} style={{ marginTop: "2.5rem" }}>
              <StaggerIn stagger={60} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "1rem" }}>
                {photos.map((src, i) => (
                  <div key={i} style={{ borderRadius: 14, overflow: "hidden", aspectRatio: "4/3", transition: "transform .3s,box-shadow .3s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.03)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 28px rgba(0,0,0,.15)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}>
                    <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
                  </div>
                ))}
              </StaggerIn>
            </AnimateIn>
          )}
        </div>
      </section>
    </SubPage>
  );
}
