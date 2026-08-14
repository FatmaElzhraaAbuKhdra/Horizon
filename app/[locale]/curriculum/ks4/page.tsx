import Link from "next/link";
import { type Locale } from "@/lib/i18n";
import SubPage from "@/components/SubPage";
import { AnimateIn, StaggerIn } from "@/components/AnimateIn";
import { prisma } from "@/lib/db";
import { slotImage } from "@/lib/slots";

const C = { dark: "#2D0864", gold: "#B300C4", bg: "#FAF7FF", card: "#fff", border: "#E8E0F5", muted: "#5A5A5A" };

const D_AR = `تجربة تعليمية متقدمة وشاملة متوافقة مع المنهج الوطني الإنجليزي، مصممة وفقاً لمسارات شهادة الثانوية العامة الدولية (IGCSE) من هيئة كامبريدج للتقييم الدولي. معلمون متخصصون في المواد الدراسية.

تركيز على إتقان المواد بعمق والتميز الأكاديمي ومهارات اجتياز الامتحانات. بنهاية المرحلة الأساسية الرابعة، يغادرنا التلاميذ وهم متعلمون واثقون ومتحمسون، ومستعدون جيدًا للدراسة المتقدمة.`;
const D_EN = `An advanced and comprehensive educational experience aligned with the English National Curriculum, designed according to Cambridge International IGCSE pathways. Subject-specialist teachers.

Focus on deep subject mastery, academic excellence and examination skills. By the end of Key Stage 4, students leave as confident, enthusiastic learners, well-prepared for advanced study.`;

const css = `
@keyframes floatY   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
@keyframes badgeSpin{
  0%  {opacity:0;transform:rotate(-12deg) scale(.6);}
  70% {transform:rotate(4deg) scale(1.08);}
  100%{opacity:1;transform:rotate(0) scale(1);}
}
@keyframes pulseOrange{
  0%  {box-shadow:0 0 0 0 rgba(217,119,6,.4);}
  70% {box-shadow:0 0 0 14px rgba(217,119,6,0);}
  100%{box-shadow:0 0 0 0 rgba(217,119,6,0);}
}
.float-icon{ animation:floatY 3.5s ease-in-out infinite; }
.badge-spin{ animation:badgeSpin .6s cubic-bezier(.22,1,.36,1) .15s both; }
.benefit-card{ transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s ease,border-color .3s; }
.benefit-card:hover{ transform:translateY(-5px); box-shadow:0 14px 32px rgba(0,0,0,.10); border-color:#D97706 !important; }
.subject-chip{ transition:transform .2s,background .2s,color .2s; cursor:default; }
.subject-chip:hover{ background:#D97706 !important; color:#fff !important; transform:scale(1.05); }
.cta-btn{ transition:transform .2s,box-shadow .2s; display:inline-block; }
.cta-btn:hover{ transform:translateY(-2px) scale(1.04); box-shadow:0 8px 24px rgba(217,119,6,.4); animation:pulseOrange 1.4s ease infinite; }
`;

export default async function KS4Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const isRtl = locale === "ar";
  const lang: "ar" | "en" = isRtl ? "ar" : "en";

  const [heroImg, allSettings] = await Promise.all([
    slotImage("about-hero"),
    prisma.schoolSetting.findMany({ where: { key: "academic.ks4" } }).catch(() => []),
  ]);

  const row = allSettings[0];
  const body = (lang === "ar" ? row?.valAr : row?.valEn) || (isRtl ? D_AR : D_EN);

  const subjectsAr = ["اللغة الإنجليزية كلغة أولى", "الرياضيات", "الأحياء", "الكيمياء", "الفيزياء", "التاريخ والجغرافيا", "اللغة العربية كلغة أولى", "اللغة الفرنسية", "الاقتصاد", "علوم الحاسوب", "الفنون التشكيلية", "التربية البدنية"];
  const subjectsEn = ["English Language", "Mathematics", "Biology", "Chemistry", "Physics", "History & Geography", "Arabic as First Language", "French", "Economics", "Computer Science", "Art & Design", "Physical Education"];
  const subjects = isRtl ? subjectsAr : subjectsEn;

  const benefitsAr = [
    { icon: "📚", title: "مناهج كامبريدج الدولية", desc: "مؤهلات معترف بها عالمياً من هيئة كامبريدج للتقييم الدولي" },
    { icon: "👨‍🏫", title: "معلمون متخصصون", desc: "كل مادة يدرّسها متخصص معتمد في مجاله" },
    { icon: "🎯", title: "تميز أكاديمي", desc: "إتقان عميق للمحتوى ومهارات اجتياز الامتحانات" },
    { icon: "🌍", title: "مسارات دولية", desc: "استعداد للالتحاق بمرحلة A-Levels والجامعات العالمية" },
  ];
  const benefitsEn = [
    { icon: "📚", title: "Cambridge International Curriculum", desc: "Globally recognised qualifications from Cambridge International Assessment" },
    { icon: "👨‍🏫", title: "Subject Specialists", desc: "Each subject taught by a qualified specialist in the field" },
    { icon: "🎯", title: "Academic Excellence", desc: "Deep content mastery and examination skills development" },
    { icon: "🌍", title: "International Pathways", desc: "Preparation for A-Levels and global university entry" },
  ];
  const benefits = isRtl ? benefitsAr : benefitsEn;

  return (
    <SubPage locale={locale} title={isRtl ? "المرحلة الثانوية — IGCSE" : "Key Stage 4 — IGCSE"} subtitle={isRtl ? "١٤ سنة فأكثر" : "Ages 14+"} heroImage={heroImg}>
      <style>{css}</style>
      <div style={{ background: C.bg }}>

        {/* ── Intro ── */}
        <section style={{ padding: "3.5rem 2rem 0" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <StaggerIn stagger={140} style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "inline-flex", gap: 8, alignItems: "center", marginBottom: "1.25rem" }}>
                  <span style={{ background: "#D97706", color: "#fff", fontWeight: 800, fontSize: 12, padding: "4px 14px", borderRadius: 20 }}>KS4 / IGCSE</span>
                  <span style={{ background: "#D9770622", color: "#D97706", fontWeight: 700, fontSize: 12, padding: "4px 14px", borderRadius: 20 }}>{isRtl ? "١٤ سنة فأكثر" : "Ages 14+"}</span>
                </div>
                <h2 style={{ fontFamily: "Amiri,serif", fontSize: 30, color: C.dark, marginBottom: "1.25rem", lineHeight: 1.4 }}>
                  {isRtl ? "التميز الأكاديمي يبدأ هنا" : "Academic Excellence Begins Here"}
                </h2>
                {body.split("\n\n").filter(Boolean).map((p, i) => (
                  <p key={i} style={{ fontSize: 15, color: C.muted, lineHeight: 1.9, marginBottom: "1rem" }}>{p}</p>
                ))}
              </div>
              <div style={{ width: 220, flexShrink: 0 }}>
                <div className="badge-spin" style={{ background: "#D97706", borderRadius: 18, padding: "1.5rem", color: "#fff", textAlign: "center" }}>
                  <div className="float-icon" style={{ fontSize: 40, marginBottom: "0.5rem", display: "inline-block" }}>🎓</div>
                  <div style={{ fontWeight: 800, fontSize: 20, marginBottom: "0.25rem" }}>IGCSE</div>
                  <div style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.5 }}>Cambridge International General Certificate of Secondary Education</div>
                </div>
              </div>
            </StaggerIn>
          </div>
        </section>

        {/* ── Benefits ── */}
        <section style={{ padding: "2.5rem 2rem 0" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <StaggerIn stagger={70} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: "1rem" }}>
              {benefits.map((b, i) => (
                <div key={i} className="benefit-card" style={{ background: C.card, borderRadius: 16, padding: "1.5rem", border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div className="float-icon" style={{ fontSize: 28, display: "inline-block", animationDelay: `${i * 0.5}s` }}>{b.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: C.dark }}>{b.title}</div>
                  <div style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.7 }}>{b.desc}</div>
                </div>
              ))}
            </StaggerIn>
          </div>
        </section>

        {/* ── Subjects ── */}
        <section style={{ padding: "2.5rem 2rem 0" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <AnimateIn from="bottom" delay={0} style={{ background: C.card, borderRadius: 20, padding: "2.5rem", border: `1px solid ${C.border}` }}>
              <h3 style={{ fontFamily: "Amiri,serif", fontSize: 22, color: C.dark, marginBottom: "1.5rem" }}>
                {isRtl ? "المواد المتاحة" : "Available Subjects"}
              </h3>
              <StaggerIn stagger={35} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: "0.75rem" }}>
                {subjects.map((s, i) => (
                  <div key={i} className="subject-chip" style={{ background: C.bg, borderRadius: 10, padding: "0.65rem 1rem", fontSize: 13.5, color: C.dark, fontWeight: 600, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: "#D97706", fontWeight: 800 }}>✓</span>{s}
                  </div>
                ))}
              </StaggerIn>
            </AnimateIn>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: "3rem 2rem 5rem" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <AnimateIn from="scale" delay={0} style={{ background: C.dark, borderRadius: 20, padding: "2.5rem", textAlign: "center", color: "#fff" }}>
              <h3 style={{ fontFamily: "Amiri,serif", fontSize: 22, color: "#fff", marginBottom: "1.25rem" }}>
                {isRtl ? "هل أنت مستعد للمرحلة الثانوية؟" : "Ready for Key Stage 4?"}
              </h3>
              <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
                <Link href={`/${locale}/admissions`} className="cta-btn" style={{ background: C.gold, color: "#fff", padding: "12px 26px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
                  {isRtl ? "قدّم الآن" : "Apply Now"}
                </Link>
                <Link href={`/${locale}/programs`} style={{ background: "rgba(255,255,255,.15)", color: "#fff", padding: "12px 26px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
                  {isRtl ? "البرنامج الأكاديمي كاملاً" : "Full Academic Programme"}
                </Link>
              </div>
            </AnimateIn>
          </div>
        </section>
      </div>
    </SubPage>
  );
}
