import { type Locale } from "@/lib/i18n";
import { getCalendarEvents } from "@/lib/db-cache";

export const dynamic = "force-dynamic";
import SubPage from "@/components/SubPage";

const C = { dark: "#2D0864", gold: "#B300C4", bg: "#FAF7FF", muted: "#5A5A5A" };

const CATEGORY_COLORS: Record<string, string> = {
  academic: "#7A24B2", exams: "#C8320A", arts: "#7B3FA0", sports: "#1A6BC8",
  culture: "#B300C4", admissions: "#2D0864", parents: "#2E7D32", general: "#5A5A5A",
};
const CATEGORY_LABELS: Record<string, { ar: string; en: string }> = {
  academic: { ar: "أكاديمي", en: "Academic" }, exams: { ar: "امتحانات", en: "Exams" },
  arts: { ar: "فنون", en: "Arts" }, sports: { ar: "رياضة", en: "Sports" },
  culture: { ar: "ثقافي", en: "Cultural" }, admissions: { ar: "قبول", en: "Admissions" },
  parents: { ar: "أولياء الأمور", en: "Parents" }, general: { ar: "عام", en: "General" },
};

export default async function CalendarEventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const isRtl = locale === "ar";

  const events = await getCalendarEvents();

  return (
    <SubPage locale={locale} title={isRtl ? "الأحداث الأكاديمية" : "Academic Calendar Events"}>
      <section style={{ padding: "3rem 2rem 5rem", background: C.bg }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "grid", gap: "0.85rem" }}>
            {events.map((ev) => {
              const color = CATEGORY_COLORS[ev.category] ?? C.muted;
              const catLabel = CATEGORY_LABELS[ev.category] ?? { ar: ev.category, en: ev.category };
              return (
                <div key={ev.id} style={{ background: "#fff", borderRadius: 12, padding: "1.25rem 1.5rem", border: "1px solid #E8E0F5", display: "flex", gap: "1rem", alignItems: "center" }}>
                  <div style={{ width: 4, borderRadius: 4, alignSelf: "stretch", background: color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, color: "#1A1A1A" }}>{isRtl ? ev.titleAr : ev.titleEn}</div>
                    <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>📅 {isRtl ? ev.dateAr : ev.dateEn}</div>
                  </div>
                  <span style={{ background: color + "18", color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>
                    {isRtl ? catLabel.ar : catLabel.en}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </SubPage>
  );
}
