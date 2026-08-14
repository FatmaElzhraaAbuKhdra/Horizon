import { type Locale } from "@/lib/i18n";
import FormalRegistrationClient from "./FormalRegistrationClient";

export default async function FormalRegistrationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  return <FormalRegistrationClient locale={locale} />;
}
