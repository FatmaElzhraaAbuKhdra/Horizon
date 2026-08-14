import { type Locale } from "@/lib/i18n";
import SubPage from "@/components/SubPage";
import Link from "next/link";

const C = { dark: "#2D0864", gold: "#B300C4", bg: "#FAF7FF", muted: "#5A5A5A" };

export default async function SeniorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const isRtl = locale === "ar";

  return (
    <SubPage locale={locale} title={isRtl ? "المرحلة الثانوية — من ١٤ سنة" : "Senior School — Age 14+"}>
      <section style={{ padding: "3rem 2rem 5rem", background: C.bg }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ background: C.dark, borderRadius: 20, padding: "3rem", color: "#fff", marginBottom: "2.5rem", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: "1rem" }}>🎓</div>
            <h2 style={{ fontFamily: "Amiri,serif", fontSize: 28, color: C.gold, marginBottom: "1rem" }}>
              {isRtl ? "التحضير للمراحل الدراسية العليا" : "Preparation for Higher Education"}
            </h2>
            <p style={{ color: "rgba(255,255,255,.8)", lineHeight: 1.85, maxWidth: 600, margin: "0 auto", fontSize: 15 }}>
              {isRtl
                ? "تُعد المرحلة الثانوية في ألدنهام الرياض الطلاب للالتحاق بأفضل الجامعات البريطانية والدولية، مع توفير مسارات مباشرة للانتقال إلى مدرسة ألدنهام في المملكة المتحدة."
                : "Aldenham Riyadh's Senior School prepares students for admission to leading UK and international universities, with direct transfer pathways to Aldenham School in the United Kingdom."}
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
            {(isRtl ? [
              { icon: "📚", title: "مسار IGCSE", body: "إعداد شامل لامتحانات IGCSE عبر Cambridge International، مع تغطية عميقة لجميع المواد الأساسية والاختيارية." },
              { icon: "🌍", title: "الانتقال إلى المملكة المتحدة", body: "يحصل طلاب ألدنهام الرياض على أولوية في الانتقال إلى مدرسة ألدنهام بالمملكة المتحدة دون المرور بقوائم الانتظار العادية." },
              { icon: "🏆", title: "برامج الإثراء", body: "مسابقات أكاديمية، وأندية متخصصة، وبرامج إثراء في العلوم والتكنولوجيا والفنون والقيادة." },
              { icon: "💼", title: "الإرشاد المهني", body: "جلسات إرشاد مهني دورية لمساعدة الطلاب في اختيار مساراتهم الجامعية والمهنية بشكل مدروس." },
            ] : [
              { icon: "📚", title: "IGCSE Pathway", body: "Comprehensive preparation for Cambridge International IGCSE examinations, with in-depth coverage of all core and elective subjects." },
              { icon: "🌍", title: "UK Transfer Route", body: "Aldenham Riyadh students receive priority placement at Aldenham School UK, bypassing standard waiting lists through a genuine international network." },
              { icon: "🏆", title: "Enrichment Programmes", body: "Academic competitions, specialist clubs, and enrichment programmes in science, technology, arts, and leadership." },
              { icon: "💼", title: "Career Guidance", body: "Regular career counselling sessions to help students choose their university and career pathways with informed confidence." },
            ]).map((card, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "1.75rem", border: "1px solid #E8E0F5" }}>
                <div style={{ fontSize: 32, marginBottom: "0.75rem" }}>{card.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: "0.6rem" }}>{card.title}</h3>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8 }}>{card.body}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center" }}>
            <Link href={`/${locale}/admissions`} style={{ display: "inline-block", background: C.gold, color: "#fff", padding: "13px 30px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 15 }}>
              {isRtl ? "ابدأ رحلة التسجيل" : "Start Your Application"}
            </Link>
          </div>
        </div>
      </section>
    </SubPage>
  );
}
