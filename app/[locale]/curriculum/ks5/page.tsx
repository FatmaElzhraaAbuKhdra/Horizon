import Link from "next/link";
import { type Locale } from "@/lib/i18n";
import SubPage from "@/components/SubPage";
import { AnimateIn, StaggerIn } from "@/components/AnimateIn";
import { prisma } from "@/lib/db";
import { slotImage } from "@/lib/slots";

const C = { dark: "#2D0864", gold: "#B300C4", bg: "#FAF7FF", card: "#fff", border: "#E8E0F5", muted: "#5A5A5A" };

const D_AR = `تجربة تعليمية متطلبة وموجهة نحو المستقبل تهيئ الطلاب للالتحاق بالجامعة. توافق مع شهادة الثانوية العامة البريطانية (A Levels) والمؤهلات المعترف بها دولياً من هيئة كامبريدج.

يتجاوز التعلّم مجرد إتقان المحتوى، ليُركّز على التفكير النقدي وتحليل الأفكار وتقييمها وتركيبها. مجموعات صغيرة وتوجيه متخصص وإرشاد أكاديمي منظم. عند التخرّج، يكون الطلاب واثقين من أنفسهم، ولبقين، ومُتفوقين أكاديميًا.`;
const D_EN = `A demanding, future-focused educational experience preparing students for university admission. Aligned with British A Levels and Cambridge internationally recognised qualifications.

Learning goes beyond content mastery to focus on critical thinking, analysis, evaluation and synthesis. Small groups, specialist guidance and structured academic mentoring. Upon graduation, students are self-assured, articulate and academically excellent.`;

const css = `
@keyframes floatY{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
@keyframes badgeSpin{
  0%  {opacity:0;transform:rotate(-12deg) scale(.6);}
  70% {transform:rotate(4deg) scale(1.08);}
  100%{opacity:1;transform:rotate(0) scale(1);}
}
@keyframes pulseGreen{
  0%  {box-shadow:0 0 0 0 rgba(90,23,133,.4);}
  70% {box-shadow:0 0 0 14px rgba(90,23,133,0);}
  100%{box-shadow:0 0 0 0 rgba(90,23,133,0);}
}
@keyframes shimmerGold{
  0%  {background-position:-200% center;}
  100%{background-position: 200% center;}
}
.float-icon{ animation:floatY 3.5s ease-in-out infinite; }
.badge-spin{ animation:badgeSpin .6s cubic-bezier(.22,1,.36,1) .15s both; }
.benefit-card{ transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s,border-color .3s; }
.benefit-card:hover{ transform:translateY(-5px); box-shadow:0 14px 32px rgba(0,0,0,.10); border-color:#2D0864 !important; }
.subject-chip{ transition:transform .2s,background .2s,color .2s; cursor:default; }
.subject-chip:hover{ background:#2D0864 !important; color:#fff !important; transform:scale(1.05); }
.dest-tag{ transition:transform .2s,box-shadow .2s; }
.dest-tag:hover{ transform:scale(1.08); box-shadow:0 4px 12px rgba(0,0,0,.15); }
.cta-btn{ transition:transform .2s,box-shadow .2s; display:inline-block; }
.cta-btn:hover{ transform:translateY(-2px) scale(1.04); box-shadow:0 8px 24px rgba(179,0,196,.4); animation:pulseGreen 1.4s ease infinite; }
.gold-text{
  background:linear-gradient(90deg,#B300C4 0%,#FDE8FF 40%,#B300C4 60%,#8800CC 100%);
  background-size:200% auto;
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  background-clip:text;
  animation:shimmerGold 3s linear infinite;
}
`;

export default async function KS5Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const isRtl = locale === "ar";
  const lang: "ar" | "en" = isRtl ? "ar" : "en";

  const [heroImg, allSettings] = await Promise.all([
    slotImage("about-hero"),
    prisma.schoolSetting.findMany({ where: { key: { in: ["academic.ks5", "academic.university"] } } }).catch(() => []),
  ]);

  const map: Record<string, { valAr: string; valEn: string }> = {};
  allSettings.forEach((r: { key: string; valAr: string; valEn: string }) => { map[r.key] = { valAr: r.valAr, valEn: r.valEn }; });
  const get = (key: string, defAr: string, defEn: string) => (lang === "ar" ? map[key]?.valAr : map[key]?.valEn) || (isRtl ? defAr : defEn);

  const body = get("academic.ks5", D_AR, D_EN);
  const uniText = get("academic.university",
    "برنامج إرشاد جامعي مصمم بعناية يدعم الطلاب بدءًا من مرحلة الاستكشاف المبكر وحتى تقديم طلبات الالتحاق بنجاح.",
    "A carefully designed university guidance programme supporting students from early exploration through to successful applications."
  );

  const subjectsAr = ["الرياضيات", "الفيزياء", "الكيمياء", "الأحياء", "اللغة الإنجليزية", "التاريخ", "الاقتصاد", "علوم الأعمال", "علوم الحاسوب", "اللغة العربية", "الفنون التشكيلية", "علم النفس"];
  const subjectsEn = ["Mathematics", "Physics", "Chemistry", "Biology", "English Literature", "History", "Economics", "Business Studies", "Computer Science", "Arabic", "Art & Design", "Psychology"];
  const subjects = isRtl ? subjectsAr : subjectsEn;

  const benefitsAr = [
    { icon: "🏆", title: "A-Levels البريطانية", desc: "أرقى المؤهلات المعترف بها دولياً للقبول الجامعي" },
    { icon: "👥", title: "مجموعات صغيرة", desc: "توجيه متخصص وتفاعل أعمق في فصول دراسية محدودة العدد" },
    { icon: "🧠", title: "تفكير نقدي", desc: "التحليل والتقييم وتركيب الأفكار — ما تبحث عنه الجامعات" },
    { icon: "🎓", title: "إرشاد جامعي متخصص", desc: "دعم شخصي من الاستكشاف المبكر حتى القبول الجامعي" },
  ];
  const benefitsEn = [
    { icon: "🏆", title: "British A-Levels", desc: "Among the most globally recognised qualifications for university entry" },
    { icon: "👥", title: "Small Groups", desc: "Specialist guidance and deeper engagement in limited-size classrooms" },
    { icon: "🧠", title: "Critical Thinking", desc: "Analysis, evaluation and synthesis — what universities look for" },
    { icon: "🎓", title: "Personal University Guidance", desc: "Support from early exploration all the way to successful admission" },
  ];
  const benefits = isRtl ? benefitsAr : benefitsEn;
  const destinations = isRtl
    ? ["المملكة المتحدة", "الشرق الأوسط", "أوروبا", "أمريكا الشمالية", "أستراليا", "كندا"]
    : ["United Kingdom", "Middle East", "Europe", "North America", "Australia", "Canada"];

  return (
    <SubPage locale={locale} title={isRtl ? "المرحلة الثانوية العليا — A-Levels" : "Key Stage 5 — A-Levels"} subtitle={isRtl ? "١٦ سنة فأكثر" : "Ages 16+"} heroImage={heroImg}>
      <style>{css}</style>
      <div style={{ background: C.bg }}>

        {/* ── Intro ── */}
        <section style={{ padding: "3.5rem 2rem 0" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <StaggerIn stagger={140} style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "inline-flex", gap: 8, alignItems: "center", marginBottom: "1.25rem" }}>
                  <span style={{ background: C.dark, color: "#fff", fontWeight: 800, fontSize: 12, padding: "4px 14px", borderRadius: 20 }}>KS5 / A-Levels</span>
                  <span style={{ background: C.gold + "22", color: C.gold, fontWeight: 700, fontSize: 12, padding: "4px 14px", borderRadius: 20 }}>{isRtl ? "١٦ سنة فأكثر" : "Ages 16+"}</span>
                </div>
                <h2 style={{ fontFamily: "Amiri,serif", fontSize: 30, color: C.dark, marginBottom: "1.25rem", lineHeight: 1.4 }}>
                  {isRtl
                    ? <><span className="gold-text">نحو مستقبل أكاديمي</span> عالمي</>
                    : <>Towards a <span className="gold-text">World-Class</span> Academic Future</>}
                </h2>
                {body.split("\n\n").filter(Boolean).map((p, i) => (
                  <p key={i} style={{ fontSize: 15, color: C.muted, lineHeight: 1.9, marginBottom: "1rem" }}>{p}</p>
                ))}
              </div>
              <div style={{ width: 220, flexShrink: 0 }}>
                <div className="badge-spin" style={{ background: C.dark, borderRadius: 18, padding: "1.5rem", color: "#fff", textAlign: "center" }}>
                  <div className="float-icon" style={{ fontSize: 40, marginBottom: "0.5rem", display: "inline-block" }}>🏆</div>
                  <div style={{ fontWeight: 800, fontSize: 20, marginBottom: "0.25rem" }}>A-Levels</div>
                  <div style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.5 }}>Cambridge International Advanced Level Qualifications</div>
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
                    <span style={{ color: C.dark, fontWeight: 800 }}>✓</span>{s}
                  </div>
                ))}
              </StaggerIn>
            </AnimateIn>
          </div>
        </section>

        {/* ── University pathways ── */}
        <section style={{ padding: "2.5rem 2rem 0" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <AnimateIn from="bottom" delay={0} style={{ background: "#EEF7F5", borderRadius: 20, padding: "2.5rem", border: "1px solid #C8E6E0" }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                <div className="float-icon" style={{ fontSize: 36, flexShrink: 0, display: "inline-block" }}>🌍</div>
                <div>
                  <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, marginBottom: 4 }}>
                    {isRtl ? "الإرشاد الجامعي" : "UNIVERSITY GUIDANCE"}
                  </div>
                  <h3 style={{ fontFamily: "Amiri,serif", fontSize: 20, color: C.dark, margin: 0 }}>
                    {isRtl ? "الوجهات الجامعية" : "University Destinations"}
                  </h3>
                </div>
              </div>
              <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.9, marginBottom: "1.5rem" }}>{uniText}</p>
              <StaggerIn stagger={60} style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
                {destinations.map((d, i) => (
                  <span key={i} className="dest-tag" style={{ background: C.dark, color: "#fff", fontSize: 13, fontWeight: 700, padding: "6px 16px", borderRadius: 20, display: "inline-block" }}>{d}</span>
                ))}
              </StaggerIn>
            </AnimateIn>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: "3rem 2rem 5rem" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <AnimateIn from="scale" delay={0} style={{ background: "linear-gradient(135deg,#2D0864,#7A24B2)", borderRadius: 20, padding: "2.5rem", textAlign: "center", color: "#fff" }}>
              <div className="float-icon" style={{ fontSize: 40, marginBottom: "0.75rem", display: "inline-block" }}>🎓</div>
              <h3 style={{ fontFamily: "Amiri,serif", fontSize: 22, color: "#fff", marginBottom: "1.25rem" }}>
                {isRtl ? "ابدأ رحلتك نحو الجامعة اليوم" : "Begin Your University Journey Today"}
              </h3>
              <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
                <Link href={`/${locale}/admissions`} className="cta-btn" style={{ background: C.gold, color: "#fff", padding: "12px 26px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
                  {isRtl ? "قدّم الآن" : "Apply Now"}
                </Link>
                <Link href={`/${locale}/programs`} style={{ background: "rgba(255,255,255,.15)", color: "#fff", padding: "12px 26px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
                  {isRtl ? "جميع المراحل الدراسية" : "All Academic Stages"}
                </Link>
              </div>
            </AnimateIn>
          </div>
        </section>
      </div>
    </SubPage>
  );
}
