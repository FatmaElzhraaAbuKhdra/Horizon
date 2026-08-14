import { MetadataRoute } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://horizon-schools.vercel.app").trim();

const pages = [
  { path: "",                                   priority: 1.0, freq: "weekly"  },
  { path: "/admissions",                        priority: 0.9, freq: "monthly" },
  { path: "/registration/formal_registration",  priority: 0.9, freq: "monthly" },
  { path: "/fees",                              priority: 0.8, freq: "monthly" },
  { path: "/about",                             priority: 0.8, freq: "monthly" },
  { path: "/curriculum",                        priority: 0.7, freq: "monthly" },
  { path: "/contact",                           priority: 0.7, freq: "monthly" },
  { path: "/events",                            priority: 0.7, freq: "weekly"  },
  { path: "/activities",                        priority: 0.6, freq: "monthly" },
  { path: "/news",                              priority: 0.6, freq: "weekly"  },
  { path: "/term-dates",                        priority: 0.6, freq: "monthly" },
  { path: "/calendar-events",                   priority: 0.6, freq: "monthly" },
  { path: "/safeguarding",                      priority: 0.5, freq: "monthly" },
  { path: "/policies",                          priority: 0.5, freq: "monthly" },
  { path: "/aspa",                              priority: 0.5, freq: "monthly" },
  { path: "/aldenham-uk",                       priority: 0.5, freq: "monthly" },
  { path: "/careers",                           priority: 0.5, freq: "monthly" },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["ar", "en"] as const;
  const lastModified = new Date();

  return locales.flatMap(locale =>
    pages.map(p => ({
      url: `${siteUrl}/${locale}${p.path}`,
      lastModified,
      changeFrequency: p.freq as MetadataRoute.Sitemap[number]["changeFrequency"],
      priority: p.priority,
    }))
  );
}
