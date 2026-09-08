import type { Consultation } from "@/generated/prisma/client";
import { formatDateTime } from "@/lib/format";

export function ConsultationHistory({
  consultations,
}: {
  consultations: Consultation[];
}) {
  return (
    <div className="border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
      <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        상담내역
      </h3>
      {consultations.length === 0 ? (
        <p className="text-sm text-zinc-500">상담 이력이 없습니다.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
          {consultations.map((consultation) => (
            <li key={consultation.id} className="flex flex-col gap-1 py-3">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {formatDateTime(consultation.visitedAt)}
                </span>
                {consultation.durationDays && (
                  <span className="text-xs text-zinc-500">
                    복용 {consultation.durationDays}일
                  </span>
                )}
              </div>
              {consultation.symptomNote && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  증상: {consultation.symptomNote}
                </p>
              )}
              {consultation.prescriptionNote && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  처방: {consultation.prescriptionNote}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
