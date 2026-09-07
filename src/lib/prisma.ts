import path from "node:path";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// `DATABASE_URL=file:./dev.db` is meant to resolve relative to prisma/schema.prisma
// (Prisma CLI convention), but the generated client resolves it relative to its own
// bundled location instead, which Next.js's bundler can move around. Resolve an
// absolute path from the prisma/ directory ourselves so the db file is always found.
const dbFile = (process.env.DATABASE_URL ?? "file:./dev.db").replace(
  /^file:/,
  "",
);
const datasourceUrl = `file:${path.resolve(process.cwd(), "prisma", dbFile)}`;

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ datasourceUrl });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
