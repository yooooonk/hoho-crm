"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createCustomer(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const birthDateRaw = String(formData.get("birthDate") ?? "").trim();
  const constitutionTag = String(formData.get("constitutionTag") ?? "").trim();
  const memo = String(formData.get("memo") ?? "").trim();

  if (!name || !phone) {
    throw new Error("이름과 전화번호는 필수입니다.");
  }

  await prisma.customer.create({
    data: {
      name,
      phone,
      birthDate: birthDateRaw ? new Date(birthDateRaw) : null,
      constitutionTag: constitutionTag || null,
      memo: memo || null,
    },
  });

  revalidatePath("/");
}
