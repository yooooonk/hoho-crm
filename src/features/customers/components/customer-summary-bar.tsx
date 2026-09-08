import { formatCurrency } from "@/lib/format";

function SummaryTile({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex flex-1 flex-col items-center gap-1 rounded-lg px-4 py-3 ${
        highlight
          ? "bg-teal-50 dark:bg-teal-500/10"
          : "bg-zinc-50 dark:bg-zinc-800/60"
      }`}
    >
      <span className="text-xs text-zinc-500">{label}</span>
      <span
        className={`text-sm font-semibold ${
          highlight
            ? "text-teal-700 dark:text-teal-400"
            : "text-zinc-900 dark:text-zinc-50"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export function CustomerSummaryBar({
  appointmentCount,
  consultationCount,
  totalPaidAmount,
}: {
  appointmentCount: number;
  consultationCount: number;
  totalPaidAmount: number;
}) {
  return (
    <div className="flex gap-2 border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
      <SummaryTile label="예약" value={`${appointmentCount}건`} />
      <SummaryTile label="상담" value={`${consultationCount}건`} />
      <SummaryTile
        label="판매"
        value={formatCurrency(totalPaidAmount)}
        highlight
      />
    </div>
  );
}
