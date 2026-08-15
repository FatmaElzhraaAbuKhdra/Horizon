import { type Locale } from "@/lib/i18n";
import { getAdmissionsSteps } from "@/lib/db-cache";
import AdmissionsClient from "./AdmissionsClient";

export const dynamic = "force-dynamic";

export default async function AdmissionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const steps = await getAdmissionsSteps();
  const dbSteps = steps.length > 0 ? steps.map(s => ({
    id: s.id, num: s.num,
    titleAr: s.titleAr, titleEn: s.titleEn,
    color: s.color,
    itemsAr: JSON.parse(s.itemsAr) as string[],
    itemsEn: JSON.parse(s.itemsEn) as string[],
  })) : null;

  return <AdmissionsClient locale={locale as Locale} dbSteps={dbSteps} />;
}
