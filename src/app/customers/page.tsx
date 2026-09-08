import { CustomerDetailPanel } from "@/features/customers/components/customer-detail-panel";
import { CustomerListPanel } from "@/features/customers/components/customer-list-panel";
import { getCustomerDetail, getCustomers } from "@/features/customers/queries";

export const dynamic = "force-dynamic";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; id?: string; new?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() || undefined;
  const isNew = params.new === "1";

  const customers = await getCustomers(query);
  const selectedId = isNew ? undefined : params.id ?? customers[0]?.id;
  const customer = selectedId ? await getCustomerDetail(selectedId) : null;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          고객관리
        </h1>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <CustomerListPanel
          customers={customers}
          selectedId={customer?.id}
          query={query}
        />
        <CustomerDetailPanel key={customer?.id ?? "new"} customer={customer} />
      </div>
    </div>
  );
}
