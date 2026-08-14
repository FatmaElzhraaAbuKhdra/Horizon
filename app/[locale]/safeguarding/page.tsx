import { type Locale, t } from "@/lib/i18n";
import SubPage from "@/components/SubPage";

const C = { dark: "#2D0864", mid: "#7A24B2", gold: "#B300C4", bg: "#FAF7FF", text: "#1A1A1A", muted: "#5A5A5A" };

export default async function SafeguardingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const isRtl = locale === "ar";

  const content = {
    title: isRtl ? "الحماية والرعاية التربوية" : "Safeguarding & Pastoral Care",
    intro: isRtl
      ? "رفاهية الطلاب وسلامتهم ونموهم الشخصي تشكّل أساس فلسفتنا التعليمية. التميز الأكاديمي ينمو في البيئات التي يشعر فيها الأطفال بالأمان والتقدير."
      : "Student wellbeing, safety, and personal growth form the foundation of our educational philosophy. Academic excellence thrives in environments where children feel secure and valued.",
    sections: [
      {
        icon: "🤝",
        titleAr: "الرعاية المتكاملة",
        titleEn: "Integrated Pastoral Care",
        bodyAr: "نجمع بين الرعاية التربوية المنظمة وممارسات الحماية الصارمة المستمدة من تقاليد المدارس البريطانية المستقلة. نركز على السلوك والأخلاق والاحترام وضبط النفس، ونعمل على دعم النمو الأكاديمي والاجتماعي والعاطفي.",
        bodyEn: "We combine structured pastoral care with rigorous safeguarding practices drawn from British independent boarding school traditions. We focus on behaviour, ethics, respect, and self-discipline, supporting academic, social, and emotional development.",
      },
      {
        icon: "🛡️",
        titleAr: "إطار الحماية",
        titleEn: "Protection Framework",
        bodyAr: "الحماية مسؤولية مشتركة في مجتمعنا المدرسي. يشرف قادة الحماية المعيّنون (DSLs) على حماية الطفل، مع إجراءات إبلاغ واضحة، وسيطرة آمنة على الوصول إلى الحرم الجامعي، وإشراف مستمر، وتدريب منتظم للموظفين على إجراءات حماية الطفل.",
        bodyEn: "Safeguarding is a shared responsibility across our school community. Designated Safeguarding Leads (DSLs) oversee child protection, with clear reporting procedures, secure campus access and supervision, and regular staff training on child protection procedures.",
      },
      {
        icon: "💚",
        titleAr: "الصحة النفسية والتدخل المبكر",
        titleEn: "Wellbeing & Early Intervention",
        bodyAr: "نقدم الإرشاد التربوي وتوجيه الصحة النفسية والدعم السلوكي مع تعاون كامل مع الأسرة. كل طالب لديه مشرف تربوي مخصص يتابع تقدمه الأكاديمي والشخصي باستمرار.",
        bodyEn: "We provide pastoral guidance, mental health support, and behavioural assistance with full family collaboration. Every student has a dedicated pastoral tutor who monitors their academic and personal progress continuously.",
      },
      {
        icon: "🔒",
        titleAr: "أمان الحرم الجامعي",
        titleEn: "Campus Safety",
        bodyAr: "مدرستنا محاطة بمنظومة أمنية متكاملة تشمل كاميرات مراقبة، وبوابات تحكم في الدخول، وضباط أمن متخصصين. جميع الزوار مسجلون ويرافقهم موظفون في جميع الأوقات.",
        bodyEn: "Our school is secured by a comprehensive security system including surveillance cameras, access control gates, and dedicated security officers. All visitors are registered and accompanied by staff at all times.",
      },
    ],
  };

  return (
    <SubPage locale={locale} title={content.title}>
      <section style={{ padding: "3rem 2rem 5rem", background: C.bg }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontSize: 17, lineHeight: 1.9, color: C.muted, marginBottom: "3rem", textAlign: "center", maxWidth: 700, margin: "0 auto 3rem" }}>
            {content.intro}
          </p>
          <div style={{ display: "grid", gap: "1.5rem" }}>
            {content.sections.map((s, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "2rem", border: "1px solid #E8E0F5", display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                <div style={{ fontSize: 36, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <h2 style={{ fontFamily: "Amiri, serif", fontSize: 22, color: C.dark, marginBottom: "0.75rem" }}>
                    {isRtl ? s.titleAr : s.titleEn}
                  </h2>
                  <p style={{ color: C.muted, lineHeight: 1.85, fontSize: 15 }}>
                    {isRtl ? s.bodyAr : s.bodyEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "3rem", background: C.dark, borderRadius: 16, padding: "2rem", color: "#fff", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: "0.75rem" }}>📞</div>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,.8)", marginBottom: "0.5rem" }}>
              {isRtl ? "للإبلاغ عن أي مخاوف تتعلق بسلامة الطلاب، تواصل معنا مباشرة:" : "To report any student safety concerns, contact us directly:"}
            </p>
            <p style={{ color: C.gold, fontWeight: 700, fontSize: 17 }}>info@aldenhamprepriyadh.com &nbsp;|&nbsp; +966 11 826 5411</p>
          </div>
        </div>
      </section>
    </SubPage>
  );
}
