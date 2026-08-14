import { defineConfig } from "prisma/config";

export default defineConfig({
  // @ts-ignore — earlyAccess is valid in Prisma 7 but missing from types
  earlyAccess: true,
  schema: "prisma/schema.prisma",
  datasource: {
    url: (process.env.DATABASE_URL ?? "").trim(),
  },
  migrate: {
    adapter: async () => {
      const { PrismaPg } = await import("@prisma/adapter-pg");
      return new PrismaPg({ connectionString: (process.env.DATABASE_URL ?? "").trim() });
    },
  },
});
