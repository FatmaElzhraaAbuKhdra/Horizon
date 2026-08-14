import { type Locale } from "@/lib/i18n";
import { prisma } from "@/lib/db";
import FeesPage from "./FeesClient";

export const dynamic = "force-dynamic";

export default async function Fees({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  let dbRows = null;
  let dbOneTime = null;
  let dbSchedule = null;
  let dbAdditional = null;

  try {
    const rows = await prisma.feeRow.findMany({ orderBy: { sortOrder: "asc" } });
    if (rows.length > 0) {
      dbRows = rows.map(r => ({ id: r.id, group: r.group, term1: r.term1, term2: r.term2, term3: r.term3, total: r.total, totalVat: r.totalVat }));
    }
    const ot = await prisma.feeOneTime.findMany({ orderBy: { sortOrder: "asc" } });
    if (ot.length > 0) dbOneTime = ot.map(r => ({ id: r.id, labelAr: r.labelAr, labelEn: r.labelEn, amount: r.amount, noteAr: r.noteAr, noteEn: r.noteEn }));

    const sc = await prisma.feeScheduleTerm.findMany({ orderBy: { sortOrder: "asc" } });
    if (sc.length > 0) dbSchedule = sc.map(r => ({ id: r.id, labelAr: r.labelAr, labelEn: r.labelEn, pct: r.pct, dateAr: r.dateAr, dateEn: r.dateEn }));

    const ad = await prisma.feeAdditional.findMany({ orderBy: { sortOrder: "asc" } });
    if (ad.length > 0) dbAdditional = ad.map(r => ({ id: r.id, icon: r.icon, labelAr: r.labelAr, labelEn: r.labelEn, valueAr: r.valueAr, valueEn: r.valueEn }));
  } catch {}

  return <FeesPage locale={locale as Locale} dbRows={dbRows} dbOneTime={dbOneTime} dbSchedule={dbSchedule} dbAdditional={dbAdditional} />;
}
