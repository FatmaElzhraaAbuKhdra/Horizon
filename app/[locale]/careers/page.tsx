import { type Locale } from "@/lib/i18n";
import { prisma } from "@/lib/db";
import { JOBS_SEED } from "@/lib/seed-data";

export const dynamic = "force-dynamic";
import SubPage from "@/components/SubPage";

const C = { dark: "#2D0864", gold: "#B300C4", bg: "#FAF7FF", muted: "#5A5A5A" };

export default async function CareersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const isRtl = locale === "ar";

  let jobs = await prisma.job.findMany({ where: { active: true }, orderBy: { createdAt: "desc" } }).catch(() => []);
  if (jobs.length === 0) {
    await prisma.job.createMany({ data: JOBS_SEED }).catch(() => {});
    jobs = await prisma.job.findMany({ where: { active: true }, orderBy: { createdAt: "desc" } }).catch(() => []);
  }

  return (
    <SubPage locale={locale} title={isRtl ? "فرص التوظيف" : "Employment Opportunities"}>
      <section style={{ padding: "3rem 2rem 5rem", background: C.bg }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ background: C.dark, borderRadius: 16, padding: "2rem", color: "#fff", marginBottom: "2.5rem" }}>
            <h2 style={{ fontFamily: "Amiri,serif", fontSize: 24, color: C.gold, marginBottom: "1rem" }}>
              {isRtl ? "انضم إلى فريق الأفق العالمية" : "Join the Horizon International Schools Team"}
            </h2>
            <p style={{ color: "rgba(255,255,255,.8)", lineHeight: 1.85, fontSize: 15 }}>
              {isRtl
                ? "نبحث عن معلمين ومتخصصين متميزين يشاركوننا شغف التميز الأكاديمي والالتزام بنمو الطالب شمولياً. نقدم باقة مزايا تنافسية تشمل رواتب معفاة من الضرائب وإقامة في الرياض وفرص تطوير مهني مستمر."
                : "We seek distinguished teachers and specialists who share our passion for academic excellence and commitment to holistic student growth. We offer a competitive benefits package including tax-exempt salaries, Riyadh accommodation, and continuous professional development opportunities."}
            </p>
          </div>

          {jobs.length > 0 ? (
            <div style={{ display: "grid", gap: "1.5rem", marginBottom: "2.5rem" }}>
              {jobs.map((job) => (
                <div key={job.id} style={{ background: "#fff", borderRadius: 16, padding: "2rem", border: "1px solid #E8E0F5" }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: C.dark, marginBottom: "0.85rem" }}>{isRtl ? job.titleAr : job.titleEn}</h3>
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.85, marginBottom: "1.25rem" }}>{isRtl ? job.descAr : job.descEn}</p>
                  <a href="mailto:info@aldenhamprepriyadh.com" style={{ display: "inline-block", background: C.gold, color: "#fff", padding: "10px 22px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
                    {isRtl ? "قدّم الآن" : "Apply Now"}
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: "#fff", borderRadius: 16, padding: "3rem", border: "1px solid #E8E0F5", textAlign: "center", marginBottom: "2.5rem" }}>
              <div style={{ fontSize: 48, marginBottom: "1rem" }}>📭</div>
              <p style={{ color: C.muted, fontSize: 15 }}>
                {isRtl ? "لا توجد وظائف شاغرة حالياً. تابعونا للاطلاع على الفرص المستقبلية." : "No current vacancies. Stay tuned for future opportunities."}
              </p>
            </div>
          )}

          <div style={{ background: "#fff", borderRadius: 14, padding: "1.75rem", border: "1px solid #E8E0F5" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: "1rem" }}>
              {isRtl ? "متطلبات المتقدمين" : "Applicant Requirements"}
            </h3>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {(isRtl ? [
                "خبرة موثقة في المناهج البريطانية أو الدولية",
                "شهادة تعليمية معترف بها",
                "الالتزام بأعلى معايير حماية الطفل",
                "روح تعاونية وقدرة على العمل بالفريق",
                "الاستعداد للمساهمة في الحياة المدرسية خارج الفصل",
              ] : [
                "Documented experience in British or international curricula",
                "Recognized teaching qualification",
                "Commitment to the highest child safeguarding standards",
                "Collaborative spirit and ability to work in a team",
                "Willingness to contribute to school life beyond the classroom",
              ]).map((item, i) => (
                <li key={i} style={{ display: "flex", gap: "0.75rem", fontSize: 14, color: C.muted }}>
                  <span style={{ color: C.gold }}>✓</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </SubPage>
  );
}
