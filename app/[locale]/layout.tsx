import type { Metadata } from "next";
import { t, type Locale } from "@/lib/i18n";
import { LocaleAttributes } from "@/components/LocaleAttributes";

const DESCRIPTIONS = {
  ar: "مدارس الأفق العالمية — تعليم عالمي متميز يجمع المنهج الأمريكي والبريطاني مع الهوية العربية الإسلامية. فرعان في الرياض: حي الورود وظهرة لبن. سجّل الآن.",
  en: "Horizon International Schools — world-class education combining American & British curricula with Arab Islamic identity. Two campuses in Riyadh: Al-Woroud & Zahrat Laban. Register now.",
};

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://horizon-schools.vercel.app").trim();
const OG_IMAGE = `${SITE_URL}/img/home-about/school-about.jpg`;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  const title = isAr
    ? "مدارس الأفق العالمية | التعليم العالمي في الرياض"
    : "Horizon International Schools | World-Class Education in Riyadh";
  const description = DESCRIPTIONS[isAr ? "ar" : "en"];
  const siteName = isAr ? "مدارس الأفق العالمية" : "Horizon International Schools";

  return {
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: { ar: `${SITE_URL}/ar`, en: `${SITE_URL}/en` },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}`,
      siteName,
      locale: isAr ? "ar_SA" : "en_GB",
      type: "website",
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    keywords: isAr
      ? [
          "مدارس الأفق العالمية", "مدارس دولية الرياض", "التعليم البريطاني", "مدارس أهلية الرياض",
          "المنهج الأمريكي", "تعليم دولي", "حي الورود", "ظهرة لبن", "مدارس شمال الرياض",
          "مدارس اللغة الإنجليزية", "أفضل مدارس الرياض", "تسجيل مدارس",
        ]
      : [
          "Horizon International Schools", "British curriculum Saudi Arabia", "international school Riyadh",
          "American curriculum Riyadh", "private school Riyadh", "Al-Woroud school", "Zahrat Laban school",
          "bilingual school Riyadh", "English school Saudi Arabia", "school registration Riyadh",
        ],
    other: {
      "geo.region":    "SA-01",
      "geo.placename": "Riyadh, Saudi Arabia",
      "geo.position":  "24.7136;46.6753",
      "ICBM":          "24.7136, 46.6753",
    },
  };
}

const SCHOOL_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "School",
  "@id": `${SITE_URL}/#school`,
  name: "Horizon International Schools",
  alternateName: "مدارس الأفق العالمية",
  url: SITE_URL,
  description: "Leading international school in Riyadh, Saudi Arabia, combining American & British curricula with Arab Islamic identity. Two campuses: Al-Woroud (North Riyadh) and Zahrat Laban.",
  foundingDate: "1999",
  telephone: "+920015440",
  email: "Info@horizon.sch.sa",
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/img/horizon-logo-purple.png`,
  },
  image: OG_IMAGE,
  address: [
    {
      "@type": "PostalAddress",
      name: "Al-Woroud Branch",
      addressCountry: "SA",
      addressRegion: "Riyadh",
      addressLocality: "Al-Woroud District, North Riyadh",
    },
    {
      "@type": "PostalAddress",
      name: "Zahrat Laban Branch",
      addressCountry: "SA",
      addressRegion: "Riyadh",
      addressLocality: "Zahrat Laban, Riyadh",
    },
  ],
  geo: {
    "@type": "GeoCoordinates",
    latitude:  24.7136,
    longitude: 46.6753,
  },
  hasMap: [
    "https://maps.app.goo.gl/n3yNWAUH3H7KvwXQ6?g_st=ic",
    "https://maps.app.goo.gl/nCHHfG5xqNXAVVDp6?g_st=ic",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+920015440",
    email: "Info@horizon.sch.sa",
    contactType: "admissions",
    availableLanguage: ["Arabic", "English"],
  },
  sameAs: [
    "https://horizon.sch.sa",
    "https://www.facebook.com/share/1AZECHi4mZ/?mibextid=wwXIfr",
    "https://www.facebook.com/share/18rDfbCv7P/?mibextid=wwXIfr",
    "https://www.instagram.com/horizonsch",
    "https://www.instagram.com/horizon_sch",
    "https://www.snapchat.com/add/horizonschool3",
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tr = t[locale as Locale] ?? t.ar;

  return (
    <>
      <LocaleAttributes lang={tr.lang} dir={tr.dir} />
      <style>{`body { font-family: var(--font-cairo, 'Cairo', sans-serif); margin: 0; background: #F5F5F5; }`}</style>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHOOL_SCHEMA) }}
      />
      {children}
    </>
  );
}
