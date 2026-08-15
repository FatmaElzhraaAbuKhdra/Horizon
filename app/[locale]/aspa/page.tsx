import { type Locale } from "@/lib/i18n";
import { getAspaMembers } from "@/lib/db-cache";

export const dynamic = "force-dynamic";
import SubPage from "@/components/SubPage";

const C = { dark: "#2D0864", gold: "#B300C4", bg: "#FAF7FF", muted: "#5A5A5A" };

export default async function AspaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const isRtl = locale === "ar";

  const members = await getAspaMembers();

  const objectives = isRtl ? [
    "تعزيز الانتماء بين أولياء الأمور والمعلمين والطلاب",
    "دعم الأهداف التعليمية من خلال التعاون المثمر",
    "إثراء تجربة الطلاب عبر الفعاليات والمبادرات",
    "تشجيع التواصل الفعّال بين الأسرة والمدرسة",
    "تعزيز مشاركة أولياء الأمور في الحياة المدرسية",
  ] : [
    "Foster belonging among parents, teachers, and students",
    "Support educational goals through meaningful collaboration",
    "Enrich student experience through events and initiatives",
    "Encourage effective parent-school communication",
    "Promote parental involvement in school life",
  ];

  return (
    <SubPage locale={locale} title={isRtl ? "رابطة أولياء أمور مدرسة ألدنهام (ASPA)" : "Aldenham School Parents' Association (ASPA)"}>
      <section style={{ padding: "3rem 2rem 5rem", background: C.bg }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.85, marginBottom: "3rem", textAlign: "center", maxWidth: 700, margin: "0 auto 3rem" }}>
            {isRtl
              ? "رابطة أولياء الأمور (ASPA) هي جمعية تطوعية تُعزز الشراكة بين المنزل والمدرسة، وتُثري تجربة الطلاب من خلال التواصل والفعاليات والمبادرات المجتمعية."
              : "The ASPA is a voluntary association that strengthens the partnership between home and school, enriching student experiences through communication, events, and community initiatives."}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "2rem", marginBottom: "3rem" }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: "2rem", border: "1px solid #E8E0F5" }}>
              <h2 style={{ fontFamily: "Amiri,serif", fontSize: 22, color: C.dark, marginBottom: "1.25rem" }}>
                {isRtl ? "أهداف الرابطة" : "Association Objectives"}
              </h2>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {objectives.map((obj, i) => (
                  <li key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
                    <span style={{ color: C.gold, flexShrink: 0, marginTop: 2 }}>✓</span>
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ background: C.dark, borderRadius: 16, padding: "2rem", color: "#fff" }}>
              <h2 style={{ fontFamily: "Amiri,serif", fontSize: 22, color: C.gold, marginBottom: "1rem" }}>
                {isRtl ? "انضم إلينا" : "Join Us"}
              </h2>
              <p style={{ color: "rgba(255,255,255,.8)", lineHeight: 1.85, fontSize: 14, marginBottom: "1.25rem" }}>
                {isRtl
                  ? "أولياء أمور الطلاب مدعوون للانضمام إلى الرابطة والمساهمة في بناء مجتمع مدرسي قوي ومتماسك."
                  : "Parents of students are invited to join the association and contribute to building a strong, cohesive school community."}
              </p>
              <a href={`mailto:info@aldenhamprepriyadh.com`} style={{ display: "inline-block", background: C.gold, color: "#fff", padding: "10px 20px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
                {isRtl ? "تواصل معنا" : "Contact Us"}
              </a>
            </div>
          </div>

          <h2 style={{ fontFamily: "Amiri,serif", fontSize: 24, color: C.dark, marginBottom: "1.5rem", textAlign: "center" }}>
            {isRtl ? "أعضاء اللجنة التنفيذية" : "Executive Committee Members"}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
            {members.map((m) => (
              <div key={m.id} style={{ background: "#fff", borderRadius: 12, padding: "1.25rem", border: "1px solid #E8E0F5", display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", color: C.gold, fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                  {(isRtl ? m.nameAr : m.nameEn).split(" ").slice(-1)[0]?.[0] ?? "A"}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#1A1A1A" }}>{isRtl ? m.nameAr : m.nameEn}</div>
                  <div style={{ fontSize: 12, color: C.gold, marginTop: 2 }}>{isRtl ? m.roleAr : m.roleEn}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SubPage>
  );
}
