import { createCustomer } from "@/features/customers/actions";
import { getCustomers } from "@/features/customers/queries";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-12">
      <header>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          환자관리
        </h1>
        <p className="mt-1 text-sm text-zinc-500">고객 목록</p>
      </header>

      <section className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          고객 추가
        </h2>
        <form action={createCustomer} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            이름 *
            <input
              name="name"
              required
              className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            전화번호 *
            <input
              name="phone"
              required
              placeholder="010-0000-0000"
              className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            생년월일
            <input
              type="date"
              name="birthDate"
              className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            체질 태그
            <input
              name="constitutionTag"
              placeholder="예: 태음인"
              className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            메모
            <textarea
              name="memo"
              rows={3}
              className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              추가
            </button>
          </div>
        </form>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          전체 고객 ({customers.length}명)
        </h2>
        {customers.length === 0 ? (
          <p className="text-sm text-zinc-500">등록된 고객이 없습니다.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {customers.map((customer) => (
              <li key={customer.id} className="flex flex-col gap-1 px-4 py-3">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">
                    {customer.name}
                  </span>
                  <span className="text-sm text-zinc-500">{customer.phone}</span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
                  {customer.constitutionTag && (
                    <span className="rounded bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800">
                      {customer.constitutionTag}
                    </span>
                  )}
                  {customer.birthDate && (
                    <span>
                      {customer.birthDate.toISOString().slice(0, 10)} 생
                    </span>
                  )}
                </div>
                {customer.memo && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {customer.memo}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
