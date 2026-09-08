"use client";

import type { ReactNode } from "react";
import { useTransition } from "react";
import { deleteCustomer } from "@/features/customers/actions";

const iconProps = {
  className: "h-4 w-4",
  fill: "none",
  viewBox: "0 0 24 24",
  strokeWidth: 1.75,
  stroke: "currentColor",
};

export function DeleteCustomerButton({
  id,
  name,
  className,
  children,
}: {
  id: string;
  name: string;
  className?: string;
  children?: ReactNode;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      title="삭제"
      disabled={pending}
      onClick={() => {
        if (!confirm(`'${name}' 고객을 삭제하시겠습니까?`)) return;
        const formData = new FormData();
        formData.set("id", id);
        startTransition(() => {
          deleteCustomer(formData);
        });
      }}
      className={
        className ??
        "flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200 disabled:opacity-50 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
      }
    >
      {children ?? (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 6.5h15" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.5 6.5V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v1.5"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.5 6.5 7.3 19a1.5 1.5 0 0 0 1.5 1.5h6.4a1.5 1.5 0 0 0 1.5-1.5l.8-12.5"
          />
        </svg>
      )}
    </button>
  );
}
