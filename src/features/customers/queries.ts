import { prisma } from "@/db/prisma";

export async function getCustomers(search?: string) {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      consultations: {
        orderBy: { visitedAt: "desc" },
        take: 1,
        select: { visitedAt: true },
      },
    },
  });

  const keyword = search?.trim();
  if (!keyword) return customers;

  // 생년월일은 DB 컬럼이 날짜 타입이라 SQL contains로 부분 일치가 안 되므로
  // 숫자만 뽑아서 메모리에서 비교한다 (구분자 -, . 어떻게 입력해도 매칭됨).
  const digitsOnly = keyword.replace(/\D/g, "");

  return customers.filter((customer) => {
    if (customer.name.includes(keyword)) return true;
    if (customer.phone.includes(keyword)) return true;
    if (digitsOnly && customer.birthDate) {
      const birthDigits = customer.birthDate.toISOString().slice(0, 10).replaceAll("-", "");
      if (birthDigits.includes(digitsOnly)) return true;
    }
    return false;
  });
}

export type CustomerListItem = Awaited<ReturnType<typeof getCustomers>>[number];

export async function getCustomerDetail(id: string) {
  const [customer, paymentSummary] = await Promise.all([
    prisma.customer.findUnique({
      where: { id },
      include: {
        consultations: { orderBy: { visitedAt: "desc" } },
        _count: { select: { appointments: true } },
      },
    }),
    // 판매 금액은 Payment 쪽에서 합산한다 (Consultation에는 결제 정보를 두지 않음 —
    // 정액권처럼 결제 1건이 여러 상담에 걸치는 경우가 있어 Payment를 별도로 관리한다).
    prisma.payment.aggregate({
      where: { customerId: id },
      _sum: { amount: true },
    }),
  ]);

  if (!customer) return null;

  return {
    ...customer,
    appointmentCount: customer._count.appointments,
    consultationCount: customer.consultations.length,
    totalPaidAmount: paymentSummary._sum.amount ?? 0,
  };
}

export type CustomerDetail = NonNullable<
  Awaited<ReturnType<typeof getCustomerDetail>>
>;
