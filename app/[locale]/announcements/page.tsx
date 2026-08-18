import { type Locale, t } from "@/lib/i18n";
import { getAnnouncements } from "@/lib/db-cache";
import SubPage from "@/components/SubPage";

export const dynamic = "force-dynamic";

const FALLBACK: { id: string; date: string; titleAr: string; titleEn: string; bodyAr: string; bodyEn: string; imageUrl: string }[] = [];

export default async function AnnouncementsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const tr = t[locale];
  const C = { primaryDark: "#2D0864", secondary: "#B300C4", bg: "#FAF7FF", card: "#fff", border: "#E8E0F5", muted: "#5A5A5A", light: "#8A8A8A" };
  const isAr = locale === "ar";

  let dbItems: typeof FALLBACK = [];
  try {
    const rows = await getAnnouncements();
    if (rows.length > 0) dbItems = rows.map(r => ({ id: r.id, date: r.date, titleAr: r.titleAr, titleEn: r.titleEn, bodyAr: r.bodyAr, bodyEn: r.bodyEn, imageUrl: r.imageUrl }));
  } catch {}

  const items = dbItems.length > 0 ? dbItems : FALLBACK;

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(isAr ? "ar-SA" : "en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <SubPage locale={locale} title={tr.nav.announcements}>
      <section style={{ padding: "5rem 2rem", background: C.bg }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 2rem", background: C.card, borderRadius: 20, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 44, marginBottom: "1rem" }}>📢</div>
              <p style={{ color: C.muted, fontSize: 15 }}>{isAr ? "لا توجد تعميمات حالياً." : "No announcements at the moment."}</p>
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              {/* Vertical line */}
              <div style={{ position: "absolute", top: 8, bottom: 8, insetInlineStart: 15, width: 2, background: `linear-gradient(to bottom, ${C.secondary}, ${C.border})` }} />

              <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                {items.map(item => (
                  <div key={item.id} style={{ position: "relative", paddingInlineStart: "3rem" }}>
                    {/* Dot */}
                    <div style={{ position: "absolute", insetInlineStart: 7, top: 6, width: 18, height: 18, borderRadius: "50%", background: C.secondary, border: `3px solid ${C.bg}`, boxShadow: `0 0 0 2px ${C.secondary}` }} />

                    <div style={{ background: C.card, borderRadius: 18, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: "0 4px 18px rgba(90,23,133,.06)" }}>
                      {item.imageUrl && (
                        <div style={{ width: "100%", aspectRatio: "16/8", overflow: "hidden" }}>
                          <img src={item.imageUrl} alt="" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        </div>
                      )}
                      <div style={{ padding: "1.5rem 1.75rem" }}>
                        <div style={{ fontSize: 12.5, color: C.secondary, fontWeight: 700, marginBottom: "0.6rem" }}>{fmtDate(item.date)}</div>
                        <h3 style={{ fontFamily: "Amiri,serif", fontSize: 21, color: C.primaryDark, marginBottom: "0.75rem", lineHeight: 1.4 }}>
                          {isAr ? item.titleAr : item.titleEn}
                        </h3>
                        <p style={{ fontSize: 14.5, color: C.muted, lineHeight: 1.9, whiteSpace: "pre-line" }}>
                          {isAr ? item.bodyAr : item.bodyEn}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </SubPage>
  );
}
