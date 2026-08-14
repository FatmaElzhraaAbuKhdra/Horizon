import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";
import { prisma } from "@/lib/db";
import { readdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export const dynamic = "force-dynamic";
import HomePage from "@/components/HomePage";

async function slotImages(slot: string): Promise<string[]> {
  const dir = path.join(process.cwd(), "public", "img", slot);
  if (!existsSync(dir)) return [];
  const files = await readdir(dir);
  return files
    .filter(f => /\.(jpe?g|png|webp|gif|svg)$/i.test(f))
    .map(f => `/img/${slot}/${f}`);
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export default async function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  let dbEvent = null;
  let dbTestimonials = null;
  try {
    const events = await prisma.schoolEvent.findMany({ where: { active: true }, orderBy: { createdAt: "asc" }, take: 1 });
    if (events.length > 0) {
      const ev = events[0];
      dbEvent = { titleAr: ev.titleAr, titleEn: ev.titleEn, dateAr: ev.dateAr, dateEn: ev.dateEn, timeAr: ev.timeAr, timeEn: ev.timeEn, locationAr: ev.locationAr, locationEn: ev.locationEn, descAr: ev.descAr, descEn: ev.descEn, dateISO: ev.dateISO ?? "" };
    }
    const tms = await prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });
    if (tms.length > 0) {
      dbTestimonials = tms.map(t => ({ textAr: t.textAr, textEn: t.textEn, name: t.name, roleAr: t.roleAr, roleEn: t.roleEn, initials: t.initials }));
    }
  } catch {}

  const [[aboutImages, galleryImages, heroImages], allSettings] = await Promise.all([
    Promise.all([slotImages("home-about"), slotImages("home-gallery"), slotImages("home-hero")]),
    prisma.schoolSetting.findMany().catch(() => [] as { key: string; valAr: string }[]),
  ]);

  const speedSetting = allSettings.find(s => s.key === "gallery.speed");
  const gallerySpeed = Math.max(2, Math.min(15, Number(speedSetting?.valAr) || 5));

  const heroSrc = heroImages[0] ?? null;

  return (
    <>
      {heroSrc && (
        <link rel="preload" as="image" href={heroSrc} fetchPriority="high" />
      )}
      <HomePage
        locale={locale as Locale}
        dbEvent={dbEvent}
        dbTestimonials={dbTestimonials}
        aboutImage={aboutImages[0] ?? null}
        galleryImages={galleryImages}
        heroImage={heroSrc}
        gallerySpeed={gallerySpeed}
      />
    </>
  );
}
