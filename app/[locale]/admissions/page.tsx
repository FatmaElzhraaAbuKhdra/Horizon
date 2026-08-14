import { type Locale } from "@/lib/i18n";
import { prisma } from "@/lib/db";
import AdmissionsClient from "./AdmissionsClient";

export const dynamic = "force-dynamic";

export default async function AdmissionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  let dbSteps = null;
  try {
    const steps = await prisma.admissionsStep.findMany({ orderBy: { sortOrder: "asc" } });
    if (steps.length > 0) {
      dbSteps = steps.map(s => ({
        id: s.id, num: s.num,
        titleAr: s.titleAr, titleEn: s.titleEn,
        color: s.color,
        itemsAr: JSON.parse(s.itemsAr) as string[],
        itemsEn: JSON.parse(s.itemsEn) as string[],
      }));
    }
  } catch {}

  return <AdmissionsClient locale={locale as Locale} dbSteps={dbSteps} />;
}
