import { prisma } from "@/db/prisma";

export function getCustomers() {
  return prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
  });
}
