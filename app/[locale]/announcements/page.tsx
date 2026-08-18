import { type Locale, t } from "@/lib/i18n";
import { getAnnouncements } from "@/lib/db-cache";
import SubPage from "@/components/SubPage";
import AnnouncementsTimeline, { type AnnouncementItem } from "@/components/AnnouncementsTimeline";

export const dynamic = "force-dynamic";

export default async function AnnouncementsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const tr = t[locale];
  const C = { bg: "#FAF7FF" };

  let items: AnnouncementItem[] = [];
  try {
    const rows = await getAnnouncements();
    items = rows.map(r => ({ id: r.id, date: r.date, titleAr: r.titleAr, titleEn: r.titleEn, bodyAr: r.bodyAr, bodyEn: r.bodyEn, imageUrl: r.imageUrl }));
  } catch {}

  return (
    <SubPage locale={locale} title={tr.nav.announcements}>
      <section style={{ padding: "5rem 2rem", background: C.bg }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <AnnouncementsTimeline items={items} locale={locale} />
        </div>
      </section>
    </SubPage>
  );
}
