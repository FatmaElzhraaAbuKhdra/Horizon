import { type Locale } from "@/lib/i18n";
import SubPage from "@/components/SubPage";
import { AnimateIn, StaggerIn } from "@/components/AnimateIn";
import { slotImages, slotImage } from "@/lib/slots";
import { prisma } from "@/lib/db";

const C = { dark: "#2D0864", gold: "#B300C4", bg: "#FAF7FF", muted: "#5A5A5A", border: "#E8E0F5" };

const D_AR = "يوفر برنامجنا للمرحلة الأساسية الثالثة جسرًا أكاديميًا متينًا بين التعليم الابتدائي والثانوي. تدريس متخصص في جميع المواد مع توقعات عالية وتحديات منظمة وتوسع هادف.\n\nيتوافق مع متطلبات المناهج الوطنية البريطانية وارتباطها بمسارات التقدم المعتمدة من هيئة كامبريدج للتقييم الدولي. بحلول نهاية السنة التاسعة، يكون التلاميذ مستعدين أكاديميًا، وواثقين اجتماعياً، وجاهزين لاتخاذ خيارات مدروسة.";
const D_EN = "Our Key Stage 3 programme provides a solid academic bridge between primary and secondary education. Specialist teaching in all subjects with high expectations, structured challenge and purposeful progression.\n\nAligned with UK National Curriculum requirements and Cambridge International Assessment progression pathways. By the end of Year 9, students are academically prepared, socially confident, and ready to make informed choices.";

const css = `
@keyframes floatY{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
@keyframes chipIn{ 0%{opacity:0;transform:scale(.7)} 70%{transform:scale(1.07)} 100%{opacity:1;transform:scale(1)} }
.float-icon{ animation:floatY 3.5s ease-in-out infinite; }
.subject-group{ transition:transform .25s,box-shadow .25s; }
.subject-group:hover{ transform:translateY(-3px); box-shadow:0 8px 20px rgba(0,0,0,.08); }
.chip-tag{ transition:background .2s,color .2s,transform .2s; }
.chip-tag:hover{ background:#2D0864 !important; color:#fff !important; transform:scale(1.08); }
`;

export default async function KS3Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const isRtl = locale === "ar";
  const lang: "ar" | "en" = isRtl ? "ar" : "en";

  const [photos, heroImg, allSettings] = await Promise.all([
    slotImages("curriculum-ks3"),
    slotImage("about-hero"),
    prisma.schoolSetting.findMany({ where: { key: "academic.ks3" } }).catch(() => []),
  ]);

  const row = allSettings[0];
  const body = (lang === "ar" ? row?.valAr : row?.valEn) || (isRtl ? D_AR : D_EN);

  const subjectGroups = isRtl ? [
    { group: "المواد الأساسية", subjects: ["اللغة الإنجليزية", "الرياضيات", "العلوم"] },
    { group: "الإنسانيات واللغات", subjects: ["التاريخ", "الجغرافيا", "اللغة العربية", "الفرنسية / الإسبانية / الصينية"] },
    { group: "التقنية والذكاء الاصطناعي", subjects: ["علوم الحاسوب", "الثقافة الرقمية والذكاء الاصطناعي", "التصميم التقني / الروبوتيات"] },
    { group: "الفنون والرياضة", subjects: ["الفنون", "الفنون الأدائية", "التربية البدنية"] },
    { group: "النمو الشخصي", subjects: ["التربية الصحية والاجتماعية (PSHE)", "مهارات الدراسة", "تعلّم كيف تتعلّم"] },
  ] : [
    { group: "Core Subjects", subjects: ["English Language", "Mathematics", "Science"] },
    { group: "Humanities & Languages", subjects: ["History", "Geography", "Arabic Language", "French/Spanish/Chinese"] },
    { group: "STEM & Digital", subjects: ["Computer Science", "Digital Culture & AI", "Technical Design / Robotics"] },
    { group: "Creative & Physical", subjects: ["Arts", "Music / Performing Arts", "Physical Education"] },
    { group: "Personal Development", subjects: ["PSHE & Wellbeing", "Study Skills", "Learning to Learn"] },
  ];

  return (
    <SubPage locale={locale} title={isRtl ? "المرحلة الثالثة (KS3)" : "Key Stage 3 (KS3)"} subtitle={isRtl ? "١١ – ١٤ سنة" : "Ages 11–14"} heroImage={heroImg}>
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
              <div className="float-icon" style={{ fontSize: 48, marginBottom: "0.5rem", display: "inline-block" }}>🚀</div>
              <div style={{ color: C.gold, fontSize: 13, fontWeight: 700 }}>{isRtl ? "الفئة العمرية" : "Age Group"}</div>
              <div style={{ fontSize: 24, fontWeight: 700, margin: "0.5rem 0" }}>{isRtl ? "١١ – ١٤ سنة" : "11 – 14 Years"}</div>
              <div style={{ color: "rgba(255,255,255,.7)", fontSize: 13 }}>Grades 7–9</div>
            </div>
          </StaggerIn>

          <StaggerIn stagger={80} style={{ display: "grid", gap: "1.25rem" }}>
            {subjectGroups.map((g, i) => (
              <div key={i} className="subject-group" style={{ background: "#fff", borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                <div style={{ background: C.bg, padding: "0.75rem 1.25rem", borderBottom: `1px solid ${C.border}` }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: C.dark, margin: 0 }}>{g.group}</h3>
                </div>
                <div style={{ padding: "0.75rem 1.25rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {g.subjects.map((s, j) => (
                    <span key={j} className="chip-tag" style={{ background: C.dark + "12", color: C.dark, fontSize: 13, padding: "4px 12px", borderRadius: 20 }}>{s}</span>
                  ))}
                </div>
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
