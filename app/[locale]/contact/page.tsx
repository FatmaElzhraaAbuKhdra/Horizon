import { type Locale, t } from "@/lib/i18n";
import { getSettings } from "@/lib/db-cache";
import SubPage from "@/components/SubPage";

export const dynamic = "force-dynamic";
import ContactClient from "@/components/ContactClient";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const tr = t[locale];

  let contactInfo = null;
  try {
    const settings = await getSettings();
    if (settings.length > 0) {
      const m: Record<string, { valAr: string; valEn: string }> = {};
      settings.forEach((s: { key: string; valAr: string; valEn: string }) => { m[s.key] = { valAr: s.valAr, valEn: s.valEn }; });
      const g = (key: string) => locale === "ar" ? (m[key]?.valAr || "") : (m[key]?.valEn || "");
      contactInfo = {
        phone:   g("contact.phone")   || tr.contact.phone,
        email:   g("contact.email")   || tr.contact.email,
        address: g("contact.address") || tr.contact.address,
        hours:   g("contact.hours")   || tr.contact.hours,
        tourInfo:g("contact.tourInfo")|| tr.contact.tourInfo,
      };
    }
  } catch {}

  return (
    <SubPage locale={locale} title={tr.nav.contact}>
      <ContactClient locale={locale} contactInfo={contactInfo} />
    </SubPage>
  );
}
