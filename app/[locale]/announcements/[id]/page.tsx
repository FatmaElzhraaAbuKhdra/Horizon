import type { Metadata } from "next";
import { type Locale, t } from "@/lib/i18n";
import { getAnnouncements } from "@/lib/db-cache";
import SubPage from "@/components/SubPage";
import AnnouncementsTimeline, { type AnnouncementItem } from "@/components/AnnouncementsTimeline";

export const dynamic = "force-dynamic";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://horizon-schools.vercel.app").trim();

async function loadItems(): Promise<AnnouncementItem[]> {
  try {
    const rows = await getAnnouncements();
    return rows.map(r => ({ id: r.id, date: r.date, titleAr: r.titleAr, titleEn: r.titleEn, bodyAr: r.bodyAr, bodyEn: r.bodyEn, imageUrl: r.imageUrl }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params as { locale: Locale; id: string };
  const isAr = locale === "ar";
  const items = await loadItems();
  const post = items.find(i => i.id === id);
  if (!post) return {};

  const title = isAr ? post.titleAr : post.titleEn;
  const desc = (isAr ? post.bodyAr : post.bodyEn).slice(0, 160);
  const url = `${SITE_URL}/${locale}/announcements/${id}`;

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: desc,
      url,
      type: "article",
      images: post.imageUrl ? [{ url: `${SITE_URL}${post.imageUrl}` }] : undefined,
    },
    twitter: {
      card: post.imageUrl ? "summary_large_image" : "summary",
      title,
      description: desc,
      images: post.imageUrl ? [`${SITE_URL}${post.imageUrl}`] : undefined,
    },
  };
}

export default async function AnnouncementPostPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params as { locale: Locale; id: string };
  const tr = t[locale];
  const C = { bg: "#FAF7FF" };
  const items = await loadItems();

  return (
    <SubPage locale={locale} title={tr.nav.announcements}>
      <section style={{ padding: "5rem 2rem", background: C.bg }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <AnnouncementsTimeline items={items} locale={locale} initialId={id} />
        </div>
      </section>
    </SubPage>
  );
}
