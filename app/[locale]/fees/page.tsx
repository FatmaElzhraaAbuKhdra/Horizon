import { type Locale } from "@/lib/i18n";
import { getFees } from "@/lib/db-cache";
import FeesPage from "./FeesClient";

export const dynamic = "force-dynamic";

export default async function Fees({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const { rows, oneTime: _ot, schedule: _sc, additional: _ad } = await getFees();
  const dbRows = rows.length > 0 ? rows.map(r => ({ id: r.id, group: r.group, term1: r.term1, term2: r.term2, term3: r.term3, total: r.total, totalVat: r.totalVat })) : null;
  const dbOneTime = _ot.length > 0 ? _ot.map(r => ({ id: r.id, labelAr: r.labelAr, labelEn: r.labelEn, amount: r.amount, noteAr: r.noteAr, noteEn: r.noteEn })) : null;
  const dbSchedule = _sc.length > 0 ? _sc.map(r => ({ id: r.id, labelAr: r.labelAr, labelEn: r.labelEn, pct: r.pct, dateAr: r.dateAr, dateEn: r.dateEn })) : null;
  const dbAdditional = _ad.length > 0 ? _ad.map(r => ({ id: r.id, icon: r.icon, labelAr: r.labelAr, labelEn: r.labelEn, valueAr: r.valueAr, valueEn: r.valueEn })) : null;

  return <FeesPage locale={locale as Locale} dbRows={dbRows} dbOneTime={dbOneTime} dbSchedule={dbSchedule} dbAdditional={dbAdditional} />;
}
