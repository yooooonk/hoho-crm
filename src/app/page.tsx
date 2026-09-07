import Link from "next/link";

const sections = [
  {
    href: "/appointments",
    label: "예약관리",
    description: "오늘 예약과 다가오는 일정을 확인합니다.",
  },
  {
    href: "/customers",
    label: "환자관리",
    description: "고객 정보와 상담 이력을 관리합니다.",
  },
  {
    href: "/inventory",
    label: "약재주문내역",
    description: "한약재 주문/재고 현황을 관리합니다.",
  },
  {
    href: "/payments",
    label: "매출관리",
    description: "결제 내역과 매출 현황을 관리합니다.",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <header>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          대시보드
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          각 메뉴를 완성하는 대로 이 화면에 요약 정보가 표시됩니다.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800 dark:hover:bg-emerald-500/5"
          >
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {section.label}
            </span>
            <span className="text-xs text-zinc-500">{section.description}</span>
            <span className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              준비 중
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
