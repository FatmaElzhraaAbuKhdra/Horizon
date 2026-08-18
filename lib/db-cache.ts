import { unstable_cache } from "next/cache";
import { prisma } from "./db";

const HOUR = 3600;

export const getSettings = unstable_cache(
  () => prisma.schoolSetting.findMany().catch(() => []),
  ["settings"],
  { revalidate: HOUR, tags: ["settings"] }
);

export const getHomePageData = unstable_cache(
  async () => {
    const [events, testimonials] = await Promise.all([
      prisma.schoolEvent.findMany({ where: { active: true }, orderBy: { createdAt: "asc" }, take: 1 }).catch(() => []),
      prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []),
    ]);
    return { events, testimonials };
  },
  ["home-data"],
  { revalidate: HOUR, tags: ["events", "testimonials"] }
);

export const getAllEvents = unstable_cache(
  () => prisma.schoolEvent.findMany({ where: { active: true }, orderBy: { createdAt: "asc" } }).catch(() => []),
  ["all-events"],
  { revalidate: HOUR, tags: ["events"] }
);

export const getNews = unstable_cache(
  () => prisma.newsItem.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }).catch(() => []),
  ["news"],
  { revalidate: HOUR, tags: ["news"] }
);

export const getAnnouncements = unstable_cache(
  () => prisma.announcement.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }).catch(() => []),
  ["announcements"],
  { revalidate: HOUR, tags: ["announcements"] }
);

export const getFees = unstable_cache(
  async () => {
    const [rows, oneTime, schedule, additional] = await Promise.all([
      prisma.feeRow.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []),
      prisma.feeOneTime.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []),
      prisma.feeScheduleTerm.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []),
      prisma.feeAdditional.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []),
    ]);
    return { rows, oneTime, schedule, additional };
  },
  ["fees"],
  { revalidate: HOUR, tags: ["fees"] }
);

export const getJobs = unstable_cache(
  () => prisma.job.findMany({ where: { active: true }, orderBy: { createdAt: "desc" } }).catch(() => []),
  ["jobs"],
  { revalidate: HOUR, tags: ["jobs"] }
);

export const getPolicies = unstable_cache(
  () => prisma.policy.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []),
  ["policies"],
  { revalidate: HOUR, tags: ["policies"] }
);

export const getTermDates = unstable_cache(
  () => prisma.termDate.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []),
  ["term-dates"],
  { revalidate: HOUR, tags: ["term-dates"] }
);

export const getCalendarEvents = unstable_cache(
  () => prisma.academicCalendarEvent.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }).catch(() => []),
  ["calendar-events"],
  { revalidate: HOUR, tags: ["calendar-events"] }
);

export const getAspaMembers = unstable_cache(
  () => prisma.aspaMember.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []),
  ["aspa"],
  { revalidate: HOUR, tags: ["aspa"] }
);

export const getAdmissionsSteps = unstable_cache(
  () => prisma.admissionsStep.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []),
  ["admissions"],
  { revalidate: HOUR, tags: ["admissions"] }
);
