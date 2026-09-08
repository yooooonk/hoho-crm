"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/db/prisma";
import { Prisma } from "@/generated/prisma/client";
import type { CustomerFormState, CustomerFormValues } from "./types";

type CustomerFields = {
  name: string;
  gender: string | null;
  phone: string;
  birthDate: Date | null;
  address: string | null;
  constitutionTag: string | null;
  memo: string | null;
};

type ParsedCustomerFields =
  | { ok: true; data: CustomerFields }
  | { ok: false; state: CustomerFormState };

function extractRawValues(formData: FormData): CustomerFormValues {
  return {
    name: String(formData.get("name") ?? "").trim(),
    genderOption: String(formData.get("genderOption") ?? "").trim(),
    genderOther: String(formData.get("genderOther") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    birthDate: String(formData.get("birthDate") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    constitutionTag: String(formData.get("constitutionTag") ?? "").trim(),
    memo: String(formData.get("memo") ?? "").trim(),
  };
}

function readCustomerFields(formData: FormData): ParsedCustomerFields {
  const raw = extractRawValues(formData);
  const gender = raw.genderOption === "기타" ? raw.genderOther : raw.genderOption;

  if (!raw.name) {
    return {
      ok: false,
      state: { error: "성명을 입력해주세요.", field: "name", values: raw },
    };
  }
  if (!raw.phone) {
    return {
      ok: false,
      state: { error: "연락처를 입력해주세요.", field: "phone", values: raw },
    };
  }

  let birthDate: Date | null = null;
  if (raw.birthDate) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(raw.birthDate)) {
      return {
        ok: false,
        state: {
          error: "생년월일을 8자리 숫자로 입력해주세요. (예: 19920512)",
          field: "birthDate",
          values: raw,
        },
      };
    }
    birthDate = new Date(raw.birthDate);
    if (Number.isNaN(birthDate.getTime())) {
      return {
        ok: false,
        state: {
          error: "생년월일이 올바르지 않습니다.",
          field: "birthDate",
          values: raw,
        },
      };
    }
  }

  return {
    ok: true,
    data: {
      name: raw.name,
      gender: gender || null,
      phone: raw.phone,
      birthDate,
      address: raw.address || null,
      constitutionTag: raw.constitutionTag || null,
      memo: raw.memo || null,
    },
  };
}

export async function createCustomer(
  _prevState: CustomerFormState,
  formData: FormData,
): Promise<CustomerFormState> {
  const parsed = readCustomerFields(formData);
  if (!parsed.ok) return parsed.state;

  let createdId: string;
  try {
    const customer = await prisma.customer.create({ data: parsed.data });
    createdId = customer.id;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        error: "이미 등록된 연락처입니다.",
        field: "phone",
        values: extractRawValues(formData),
      };
    }
    throw error;
  }

  revalidatePath("/customers");
  redirect(`/customers?id=${createdId}`);
}

export async function updateCustomer(
  _prevState: CustomerFormState,
  formData: FormData,
): Promise<CustomerFormState> {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    throw new Error("고객 정보를 찾을 수 없습니다.");
  }

  const parsed = readCustomerFields(formData);
  if (!parsed.ok) return parsed.state;

  try {
    await prisma.customer.update({ where: { id }, data: parsed.data });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        error: "이미 등록된 연락처입니다.",
        field: "phone",
        values: extractRawValues(formData),
      };
    }
    throw error;
  }

  revalidatePath("/customers");
  redirect(`/customers?id=${id}`);
}

export async function deleteCustomer(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    throw new Error("고객 정보를 찾을 수 없습니다.");
  }

  await prisma.customer.delete({ where: { id } });

  revalidatePath("/customers");
  redirect("/customers");
}
