import Link from "next/link";
import type { CustomerListItem } from "@/features/customers/queries";
import { formatDate } from "@/lib/format";

const iconProps = {
  className: "h-4 w-4",
  fill: "none",
  viewBox: "0 0 24 24",
  strokeWidth: 1.75,
  stroke: "currentColor",
};

function buildHref(id: string, query?: string) {
  const params = new URLSearchParams();
  params.set("id", id);
  if (query) params.set("q", query);
  return `/customers?${params.toString()}`;
}

function lastVisitAt(customer: CustomerListItem) {
  return customer.consultations[0]?.visitedAt ?? customer.createdAt;
}

export function CustomerListPanel({
  customers,
  selectedId,
  query,
}: {
  customers: CustomerListItem[];
  selectedId?: string;
  query?: string;
}) {
  return (
    <div className="flex w-140 shrink-0 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <form
        action="/customers"
        className="flex items-center gap-2 border-b border-zinc-200 p-3 dark:border-zinc-800"
      >
        <select
          disabled
          className="rounded border border-zinc-300 bg-zinc-50 px-2 py-1.5 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
        >
          <option>성명, 연락처, 생년월일</option>
        </select>
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="성명, 연락처, 생년월일(예: 19920502)"
          className="flex-1 rounded border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="submit"
          title="검색"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-teal-600 text-white hover:bg-teal-700"
        >
          <svg {...iconProps}>
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path strokeLinecap="round" d="m20 20-4.5-4.5" />
          </svg>
        </button>
      </form>

      <div className="flex items-center justify-between border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            고객목록
          </span>
          <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-700 dark:bg-teal-500/10 dark:text-teal-400">
            {customers.length}
          </span>
        </div>
        <Link
          href="/customers?new=1"
          className="rounded bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700"
        >
          고객등록
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto">
        {customers.length === 0 ? (
          <p className="p-6 text-center text-sm text-zinc-500">
            등록된 고객이 없습니다.
          </p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 bg-zinc-50 text-xs text-zinc-500 dark:bg-zinc-800/60">
              <tr>
                <th className="w-9 px-2 py-2 text-center font-medium">#</th>
                <th className="px-2 py-2 text-center font-medium">성명</th>
                <th className="w-14 px-2 py-2 text-center font-medium">성별</th>
                <th className="px-2 py-2 text-center font-medium">생년월일</th>
                <th className="px-2 py-2 text-center font-medium">연락처</th>
                <th className="px-2 py-2 text-center font-medium">최종방문일</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => {
                const isSelected = customer.id === selectedId;
                const href = buildHref(customer.id, query);
                return (
                  <tr
                    key={customer.id}
                    className={`border-b border-zinc-100 dark:border-zinc-800 ${
                      isSelected
                        ? "bg-teal-50 dark:bg-teal-500/10"
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                    }`}
                  >
                    <td className="px-2 py-2 text-center text-zinc-400">
                      {index + 1}
                    </td>
                    <td className="p-0">
                      <Link
                        href={href}
                        className="block px-2 py-2 text-center font-medium text-zinc-900 dark:text-zinc-50"
                      >
                        {customer.name}
                      </Link>
                    </td>
                    <td className="p-0">
                      <Link
                        href={href}
                        className="block truncate px-2 py-2 text-center text-zinc-500"
                        title={customer.gender ?? undefined}
                      >
                        {customer.gender ?? "-"}
                      </Link>
                    </td>
                    <td className="p-0">
                      <Link
                        href={href}
                        className="block px-2 py-2 text-center text-zinc-500"
                      >
                        {customer.birthDate ? formatDate(customer.birthDate) : "-"}
                      </Link>
                    </td>
                    <td className="p-0">
                      <Link
                        href={href}
                        className="block px-2 py-2 text-center text-zinc-500"
                      >
                        {customer.phone}
                      </Link>
                    </td>
                    <td className="p-0">
                      <Link
                        href={href}
                        className="block px-2 py-2 text-center text-zinc-500"
                      >
                        {formatDate(lastVisitAt(customer))}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
