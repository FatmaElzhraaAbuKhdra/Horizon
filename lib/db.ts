import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = (process.env.DATABASE_URL ?? "").trim();

const g = globalThis as unknown as { _prisma?: PrismaClient };

function createPrisma() {
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter } as any);
}

export const prisma = g._prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") g._prisma = prisma;
