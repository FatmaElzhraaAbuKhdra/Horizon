import { type Locale, t } from "@/lib/i18n";
import { getAllEvents } from "@/lib/db-cache";
import SubPage from "@/components/SubPage";

export const dynamic = "force-dynamic";

export default async function EventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const tr = t[locale];
  const isRtl = locale === "ar";
  const C = { primaryDark: "#2D0864", gold: "#B300C4", goldLight: "#FDE8FF", bg: "#FAF7FF", border: "#E8E0F5", muted: "#5A5A5A" };

  let events: Array<{
    titleAr: string; titleEn: string; dateAr: string; dateEn: string;
    timeAr: string; timeEn: string; locationAr: string; locationEn: string;
    descAr: string; descEn: string; active: boolean;
  }> = [];

  try {
    events = await getAllEvents();
  } catch {}

  // Fallback to i18n if DB empty
  const list = events.length > 0 ? events.map(ev => ({
    title:    isRtl ? ev.titleAr    : ev.titleEn,
    date:     isRtl ? ev.dateAr     : ev.dateEn,
    time:     isRtl ? ev.timeAr     : ev.timeEn,
    location: isRtl ? ev.locationAr : ev.locationEn,
    desc:     isRtl ? ev.descAr     : ev.descEn,
  })) : [{
    title:    tr.event.title,
    date:     tr.event.date,
    time:     tr.event.time,
    location: tr.event.location,
    desc:     tr.event.desc,
  }];

  return (
    <SubPage locale={locale} title={tr.nav.events}>
      <section style={{ padding: "5rem 2rem", background: C.bg }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {list.map((ev, i) => (
            <div key={i} style={{ background: C.primaryDark, borderRadius: 20, padding: "3rem", color: "#fff", marginBottom: "2rem" }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: C.goldLight, marginBottom: "0.75rem", textTransform: "uppercase" }}>
                {isRtl ? "فعالية قادمة" : "Upcoming Event"}
              </div>
              <h2 style={{ fontFamily: "Amiri,serif", fontSize: 36, color: "#fff", marginBottom: "1.5rem" }}>{ev.title}</h2>
              <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                <span>📅 {ev.date}</span>
                <span>🕙 {ev.time}</span>
                <span>📍 {ev.location}</span>
              </div>
              <p style={{ color: "rgba(255,255,255,.75)", fontSize: 15, lineHeight: 1.8, marginBottom: "1.75rem" }}>{ev.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </SubPage>
  );
}
