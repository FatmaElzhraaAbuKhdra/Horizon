import Link from "next/link";
import { type Locale } from "@/lib/i18n";
import SubPage from "@/components/SubPage";
import { AnimateIn, StaggerIn } from "@/components/AnimateIn";
import { prisma } from "@/lib/db";
import { slotImage } from "@/lib/slots";

const C = { dark: "#2D0864", gold: "#B300C4", bg: "#FAF7FF", card: "#fff", border: "#E8E0F5", muted: "#5A5A5A" };

const D: Record<string, { ar: string; en: string }> = {
  "academic.intro": {
    ar: "تجمع فلسفتنا التعليمية بين الدقة الأكاديمية العالية والتنمية الشاملة، بما يتماشى مع المنهج الوطني الإنجليزي من خلال تطبيق المنهج الدولي للسنوات المبكرة (IEYC) والمنهج الدولي للمرحلة الابتدائية (IPC).",
    en: "Our educational philosophy combines high academic rigour with holistic development, aligned with the English National Curriculum through the International Early Years Curriculum (IEYC) and the International Primary Curriculum (IPC).",
  },
  "academic.plus.items": {
    ar: "إتقان أعمق للمواد الأساسية (اللغة الإنجليزية، الرياضيات، العلوم، الحوسبة)\nفهم مفاهيمي أقوى وممارسة أكاديمية منظمة\nتنمية هادفة لمهارات التفكير وحل المشكلات\nتعلم متكامل يربط المعرفة بين المواد المختلفة\nتطور متسلسل بعناية يعكس كيفية تعلم الأطفال",
    en: "Deeper mastery of core subjects (English, Mathematics, Science, Computing)\nStronger conceptual understanding and structured academic practice\nPurposeful development of thinking skills and problem-solving\nIntegrated learning connecting knowledge across subjects\nCarefully sequenced progression reflecting how children learn",
  },
  "academic.teachers": {
    ar: "يعتمد النموذج على معلمين متخصصين بدءاً من الصف الخامس في المواد الأساسية (رياضيات، لغة إنجليزية، علوم)، بالإضافة إلى تدريس متخصص في التربية البدنية واللغات والفنون والحوسبة منذ الصف الأول.",
    en: "The model relies on specialist teachers from Year 5 in core subjects (Mathematics, English, Science), plus specialist teaching in PE, Languages, Arts and Computing from Year 1.",
  },
  "academic.university": {
    ar: "برنامج إرشاد جامعي مصمم بعناية يدعم الطلاب بدءًا من مرحلة الاستكشاف المبكر وحتى تقديم طلبات الالتحاق بنجاح. إرشاد أكاديمي مخصص، توجيه في اختيار المواد، ودعم خطوة بخطوة في التقديم للجامعات — المملكة المتحدة، الشرق الأوسط، أوروبا، أمريكا الشمالية.",
    en: "A carefully designed university guidance programme supporting students from early exploration through to successful applications. Personal counselling, subject selection guidance, and step-by-step support for universities worldwide — UK, Middle East, Europe, North America.",
  },
};

function g(map: Record<string, { valAr: string; valEn: string }>, key: string, lang: "ar" | "en") {
  const v = lang === "ar" ? map[key]?.valAr : map[key]?.valEn;
  return v || D[key]?.[lang] || "";
}

const STAGES = (isRtl: boolean, locale: string) => [
  { icon: "🌟", age: isRtl ? "٣ – ٥ سنوات" : "Ages 3–5", tag: "EYFS", titleAr: "مرحلة التأسيس المبكر", titleEn: "Early Years Foundation Stage", descKey: "academic.eyfs", href: `/${locale}/curriculum/eyfs`, color: "#2D9B6C" },
  { icon: "📖", age: isRtl ? "٥ سنوات فأكثر" : "Ages 5+", tag: "KS1", titleAr: "المرحلة الأساسية الأولى", titleEn: "Key Stage 1", descKey: "academic.ks1", href: `/${locale}/curriculum/ks1`, color: "#2563EB" },
  { icon: "🔬", age: isRtl ? "٧ سنوات فأكثر" : "Ages 7+", tag: "KS2", titleAr: "المرحلة الأساسية الثانية", titleEn: "Key Stage 2", descKey: "academic.ks2", href: `/${locale}/curriculum/ks2`, color: "#7C3AED" },
  { icon: "🚀", age: isRtl ? "١١ سنة فأكثر" : "Ages 11+", tag: "KS3", titleAr: "المرحلة الأساسية الثالثة", titleEn: "Key Stage 3", descKey: "academic.ks3", href: `/${locale}/curriculum/ks3`, color: "#DC2626" },
  { icon: "🎓", age: isRtl ? "١٤ سنة فأكثر" : "Ages 14+", tag: "KS4 / IGCSE", titleAr: "المرحلة الثانوية", titleEn: "Key Stage 4 / IGCSE", descKey: "academic.ks4", href: `/${locale}/curriculum/ks4`, color: "#D97706" },
  { icon: "🏆", age: isRtl ? "١٦ سنة فأكثر" : "Ages 16+", tag: "KS5 / A-Levels", titleAr: "المرحلة الثانوية العليا", titleEn: "Key Stage 5 / A-Levels", descKey: "academic.ks5", href: `/${locale}/curriculum/ks5`, color: "#2D0864" },
];

const css = `
@keyframes badgePop {
  0%  { opacity:0; transform:scale(.5) translateY(8px); }
  70% { transform:scale(1.1); }
  100%{ opacity:1; transform:scale(1) translateY(0); }
}
@keyframes floatY {
  0%,100%{ transform:translateY(0); }
  50%    { transform:translateY(-7px); }
}
@keyframes shimmerGold {
  0%  { background-position:-200% center; }
  100%{ background-position: 200% center; }
}
@keyframes pulseGold {
  0%  { box-shadow:0 0 0 0 rgba(179,0,196,.4); }
  70% { box-shadow:0 0 0 14px rgba(179,0,196,0); }
  100%{ box-shadow:0 0 0 0 rgba(179,0,196,0); }
}
.bp1{ animation:badgePop .5s cubic-bezier(.22,1,.36,1) .10s both; }
.bp2{ animation:badgePop .5s cubic-bezier(.22,1,.36,1) .22s both; }
.bp3{ animation:badgePop .5s cubic-bezier(.22,1,.36,1) .34s both; }
.float-icon{ animation:floatY 3.5s ease-in-out infinite; }
.gold-text{
  background:linear-gradient(90deg,#B300C4 0%,#FDE8FF 40%,#B300C4 60%,#8800CC 100%);
  background-size:200% auto;
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  background-clip:text;
  animation:shimmerGold 3s linear infinite;
}
.stage-card{ transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s ease; cursor:pointer; }
.stage-card:hover{ transform:translateY(-7px) scale(1.015); box-shadow:0 18px 42px rgba(0,0,0,.12); }
.stage-card:hover .float-icon{ animation-play-state:paused; transform:scale(1.2) rotate(-8deg); transition:transform .35s cubic-bezier(.22,1,.36,1); }
.check-item{ transition:transform .2s; }
.check-item:hover{ transform:translateX(-4px); }
.cta-btn{ transition:transform .2s ease,box-shadow .2s ease; display:inline-block; }
.cta-btn:hover{ transform:translateY(-2px) scale(1.04); box-shadow:0 8px 24px rgba(179,0,196,.4); animation:pulseGold 1.4s ease infinite; }
`;

export default async function ProgramsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const isRtl = locale === "ar";
  const lang: "ar" | "en" = isRtl ? "ar" : "en";

  const [heroImg, allSettings] = await Promise.all([
    slotImage("about-hero"),
    prisma.schoolSetting.findMany().catch(() => [] as { key: string; valAr: string; valEn: string }[]),
  ]);

  const map: Record<string, { valAr: string; valEn: string }> = {};
  allSettings.forEach((r: { key: string; valAr: string; valEn: string }) => { map[r.key] = { valAr: r.valAr, valEn: r.valEn }; });
  const s = (key: string) => g(map, key, lang);

  const plusItems = s("academic.plus.items").split("\n").filter(Boolean);
  const stages = STAGES(isRtl, locale);

  return (
    <SubPage locale={locale} title={isRtl ? "البرنامج الأكاديمي" : "Academic Programme"} heroImage={heroImg}>
      <style>{css}</style>
      <div style={{ background: C.bg }}>

        {/* ── Philosophy intro ── */}
        <section style={{ padding: "3.5rem 2rem 0" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <AnimateIn from="scale" delay={60} style={{ background: C.dark, borderRadius: 22, padding: "3rem", textAlign: "center", color: "#fff" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                {["Cambridge", "IPC", "IEYC"].map((b, i) => (
                  <span key={b} className={`bp${i + 1}`} style={{ background: "rgba(255,255,255,.15)", color: "#fff", fontWeight: 800, fontSize: 12, padding: "5px 18px", borderRadius: 30, letterSpacing: 1 }}>{b}</span>
                ))}
              </div>
              <h2 style={{ fontFamily: "Amiri,serif", fontSize: 28, color: "#fff", marginBottom: "1.25rem", lineHeight: 1.5 }}>
                {isRtl ? "فلسفتنا التعليمية" : "Our Educational Philosophy"}
              </h2>
              <p style={{ color: "rgba(255,255,255,.88)", lineHeight: 1.9, maxWidth: 700, margin: "0 auto", fontSize: 15 }}>
                {s("academic.intro")}
              </p>
            </AnimateIn>
          </div>
        </section>

        {/* ── Aldenham+ & specialist teachers ── */}
        <section style={{ padding: "3rem 2rem 0" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <StaggerIn stagger={120} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1.5rem" }}>
              <div style={{ background: C.card, borderRadius: 20, padding: "2.5rem", border: `1px solid ${C.border}` }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.gold, color: "#fff", fontWeight: 800, fontSize: 14, padding: "5px 16px", borderRadius: 30, marginBottom: "1.25rem" }}>
                  ✨ {isRtl ? "برنامج الأفق+" : "Horizon+ Programme"}
                </div>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: "1.25rem" }}>
                  {isRtl
                    ? "يتم تعزيز البرامج من خلال منهج خاص طورته مدارس الأفق العالمية. يشمل:"
                    : "Programmes are enhanced through a bespoke curriculum developed by Horizon International Schools. It includes:"}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  {plusItems.map((item, i) => (
                    <div key={i} className="check-item" style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                      <span style={{ color: C.gold, fontWeight: 800, flexShrink: 0, marginTop: 2 }}>✓</span>
                      <span style={{ fontSize: 14, color: C.dark, lineHeight: 1.7 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: C.card, borderRadius: 20, padding: "2.5rem", border: `1px solid ${C.border}` }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.dark, color: "#fff", fontWeight: 800, fontSize: 14, padding: "5px 16px", borderRadius: 30, marginBottom: "1.25rem" }}>
                  👩‍🏫 {isRtl ? "نموذج المعلمين المتخصصين" : "Specialist Teacher Model"}
                </div>
                <p style={{ fontSize: 14.5, color: C.muted, lineHeight: 1.9 }}>{s("academic.teachers")}</p>
                <div style={{ marginTop: "1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "0.75rem" }}>
                  {(isRtl
                    ? ["من الصف ١: التربية البدنية، الفنون، الموسيقى، العربية، الفرنسية، الحاسوب", "من الصف ٥: الرياضيات، العلوم، اللغة الإنجليزية، العلوم الإنسانية"]
                    : ["From Year 1: PE, Arts, Music, Arabic, French, Computing", "From Year 5: Maths, Science, English, Humanities"]
                  ).map((t, i) => (
                    <div key={i} style={{ background: C.bg, borderRadius: 10, padding: "0.75rem 1rem", fontSize: 13, color: C.dark, fontWeight: 600, border: `1px solid ${C.border}` }}>{t}</div>
                  ))}
                </div>
              </div>
            </StaggerIn>
          </div>
        </section>

        {/* ── Stage cards ── */}
        <section style={{ padding: "3rem 2rem 0" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <AnimateIn delay={0}>
              <h2 style={{ fontFamily: "Amiri,serif", fontSize: 28, color: C.dark, marginBottom: "1.75rem", textAlign: "center" }}>
                <span className="gold-text">{isRtl ? "المراحل الدراسية" : "Academic Stages"}</span>
              </h2>
            </AnimateIn>
            <StaggerIn stagger={80} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: "1.25rem" }}>
              {stages.map((st, i) => {
                const desc = s(st.descKey);
                const firstPara = desc.split("\n\n")[0];
                return (
                  <Link key={i} href={st.href} style={{ textDecoration: "none" }}>
                    <div className="stage-card" style={{ background: C.card, borderRadius: 18, padding: "1.75rem", border: `1px solid ${C.border}`, height: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                        <div className="float-icon" style={{ width: 50, height: 50, borderRadius: 14, background: st.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0, animationDelay: `${i * 0.45}s` }}>
                          {st.icon}
                        </div>
                        <div>
                          <div style={{ background: st.color, color: "#fff", fontSize: 11, fontWeight: 800, padding: "2px 10px", borderRadius: 20, display: "inline-block", marginBottom: 4 }}>{st.tag}</div>
                          <div style={{ fontSize: 12, color: C.muted }}>{st.age}</div>
                        </div>
                      </div>
                      <h3 style={{ fontFamily: "Amiri,serif", fontSize: 20, color: C.dark, margin: 0 }}>
                        {isRtl ? st.titleAr : st.titleEn}
                      </h3>
                      <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.8, margin: 0, flex: 1 }}>
                        {firstPara.length > 160 ? firstPara.slice(0, 160) + "…" : firstPara}
                      </p>
                      <div style={{ color: st.color, fontWeight: 700, fontSize: 13 }}>
                        {isRtl ? "اقرأ المزيد ←" : "Learn more →"}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </StaggerIn>
          </div>
        </section>

        {/* ── University ── */}
        <section style={{ padding: "3rem 2rem 0" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <AnimateIn from="bottom" delay={0} style={{ background: C.card, borderRadius: 20, padding: "2.5rem", border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                <div className="float-icon" style={{ width: 48, height: 48, borderRadius: 12, background: "#EEF7F5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>🌍</div>
                <div>
                  <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2 }}>
                    {isRtl ? "الإرشاد الجامعي" : "UNIVERSITY GUIDANCE"}
                  </div>
                  <h3 style={{ fontFamily: "Amiri,serif", fontSize: 22, color: C.dark, marginTop: 4 }}>
                    {isRtl ? "مسارات الجامعة وآفاق المستقبل العالمية" : "University Pathways & Global Future Prospects"}
                  </h3>
                </div>
              </div>
              <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.9 }}>{s("academic.university")}</p>
            </AnimateIn>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: "3rem 2rem 5rem" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <AnimateIn from="scale" delay={0} style={{ background: C.dark, borderRadius: 20, padding: "3rem", textAlign: "center", color: "#fff" }}>
              <div className="float-icon" style={{ fontSize: 42, marginBottom: "0.75rem", display: "inline-block" }}>🏛️</div>
              <div style={{ color: C.gold, fontWeight: 800, fontSize: 13, letterSpacing: 2, marginBottom: "0.75rem" }}>
                {isRtl ? "٢٦+ عاماً من التميز التعليمي" : "26+ YEARS OF EXCELLENCE"}
              </div>
              <h2 style={{ fontFamily: "Amiri,serif", fontSize: 26, color: "#fff", marginBottom: "1.5rem" }}>
                {isRtl ? "انضم إلى مدارس الأفق العالمية" : "Join Horizon International Schools"}
              </h2>
              <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
                <Link href={`/${locale}/admissions`} className="cta-btn" style={{ background: C.gold, color: "#fff", padding: "13px 28px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 15 }}>
                  {isRtl ? "قدّم الآن" : "Apply Now"}
                </Link>
                <Link href={`/${locale}/admissions#tour`} style={{ background: "rgba(255,255,255,.15)", color: "#fff", padding: "13px 28px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 15 }}>
                  {isRtl ? "احجز جولة مدرسية" : "Book a School Tour"}
                </Link>
              </div>
            </AnimateIn>
          </div>
        </section>
      </div>
    </SubPage>
  );
}
