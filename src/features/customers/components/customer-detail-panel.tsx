"use client";

import type { ReactNode } from "react";
import { useActionState, useEffect, useRef, useState } from "react";
import { createCustomer, updateCustomer } from "@/features/customers/actions";
import type { CustomerDetail } from "@/features/customers/queries";
import { initialCustomerFormState } from "@/features/customers/types";
import { formatDate } from "@/lib/format";
import { formatBirthInfo } from "@/lib/birth-info";
import { DeleteCustomerButton } from "./delete-customer-button";
import { ConsultationHistory } from "./consultation-history";
import { CustomerSummaryBar } from "./customer-summary-bar";
import { BirthDateInput } from "./birth-date-input";
import { PhoneInput } from "./phone-input";

function Field({
  label,
  required,
  className,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  error?: string | null;
  children: ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-1 text-sm ${className ?? ""}`}>
      <span className="text-zinc-500">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </span>
      {children}
      {error && <span className="text-xs text-rose-500">{error}</span>}
    </div>
  );
}

const inputClass =
  "rounded border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900";
const textClass = "py-1.5 text-base font-medium text-zinc-900 dark:text-zinc-50";

export function CustomerDetailPanel({
  customer,
}: {
  customer: CustomerDetail | null;
}) {
  const action = customer ? updateCustomer : createCustomer;
  const [state, formAction, pending] = useActionState(
    action,
    initialCustomerFormState,
  );

  const [isEditing, setIsEditing] = useState(!customer);

  // Bump on every completed submit attempt (success or failure) so the
  // uncontrolled fields below remount and pick up state.values — React
  // resets a <form action> 's uncontrolled fields after the action settles,
  // which would otherwise wipe out what the user typed when a validation
  // error comes back (see docs/features/customer-management.md).
  const [resetToken, setResetToken] = useState(0);
  const wasPendingRef = useRef(false);
  useEffect(() => {
    if (wasPendingRef.current && !pending) {
      setResetToken((token) => token + 1);
    }
    wasPendingRef.current = pending;
  }, [pending]);

  const savedUpdatedAtRef = useRef(customer?.updatedAt.getTime());
  useEffect(() => {
    const currentUpdatedAt = customer?.updatedAt.getTime();
    if (customer && currentUpdatedAt !== savedUpdatedAtRef.current) {
      savedUpdatedAtRef.current = currentUpdatedAt;
      setIsEditing(false);
    }
  }, [customer]);

  const values = state.values;
  const name = values?.name ?? customer?.name ?? "";
  const phone = values?.phone ?? customer?.phone ?? "";
  const address = values?.address ?? customer?.address ?? "";
  const constitutionTag = values?.constitutionTag ?? customer?.constitutionTag ?? "";
  const memo = values?.memo ?? customer?.memo ?? "";
  const birthDateValue =
    values?.birthDate ??
    (customer?.birthDate ? formatDate(customer.birthDate) : "");

  const genderValue = customer?.gender ?? "";
  const derivedGenderOption =
    genderValue === "남" || genderValue === "여"
      ? genderValue
      : genderValue
        ? "기타"
        : "";
  const genderOption = values?.genderOption ?? derivedGenderOption;
  const genderOtherDefault =
    values?.genderOther ??
    (derivedGenderOption === "기타" ? genderValue : "");

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <form action={formAction} className="flex flex-col gap-4 p-6">
        {customer && <input type="hidden" name="id" defaultValue={customer.id} />}

        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            {customer ? "고객 상세" : "신규 고객 등록"}
          </h2>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <button
                type="submit"
                disabled={pending}
                className="rounded bg-teal-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60"
              >
                {pending
                  ? customer
                    ? "저장 중..."
                    : "등록 중..."
                  : customer
                    ? "저장"
                    : "등록"}
              </button>
            ) : (
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  setIsEditing(true);
                }}
                className="rounded bg-zinc-100 px-4 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                수정
              </button>
            )}
            {customer && (
              <DeleteCustomerButton
                id={customer.id}
                name={customer.name}
                className="rounded bg-rose-50 px-4 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400"
              >
                삭제
              </DeleteCustomerButton>
            )}
          </div>
        </div>

        <div key={resetToken} className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          <Field
            label="성명"
            required={isEditing}
            error={state.field === "name" ? state.error : null}
          >
            {isEditing ? (
              <input
                name="name"
                required
                defaultValue={name}
                className={inputClass}
              />
            ) : (
              <p className={textClass}>{customer?.name}</p>
            )}
          </Field>
          <Field label="성별">
            {isEditing ? (
              <div className="flex items-center gap-3 py-1.5 text-sm">
                {(["남", "여"] as const).map((value) => (
                  <label key={value} className="flex items-center gap-1.5">
                    <input
                      type="radio"
                      name="genderOption"
                      value={value}
                      defaultChecked={genderOption === value}
                      className="h-3.5 w-3.5 accent-teal-600"
                    />
                    {value}
                  </label>
                ))}
                <label className="flex items-center gap-1.5">
                  <input
                    type="radio"
                    name="genderOption"
                    value="기타"
                    defaultChecked={genderOption === "기타"}
                    className="h-3.5 w-3.5 accent-teal-600"
                  />
                  기타
                </label>
                <input
                  type="text"
                  name="genderOther"
                  placeholder="직접 입력"
                  defaultValue={genderOtherDefault}
                  className={`${inputClass} w-24 py-1`}
                />
              </div>
            ) : (
              <p className={textClass}>{customer?.gender || "-"}</p>
            )}
          </Field>

          <Field
            label="연락처"
            required={isEditing}
            error={state.field === "phone" ? state.error : null}
          >
            {isEditing ? (
              <PhoneInput
                name="phone"
                required
                defaultValue={phone}
                className={inputClass}
              />
            ) : (
              <p className={textClass}>{customer?.phone}</p>
            )}
          </Field>
          <Field
            label="생년월일"
            error={state.field === "birthDate" ? state.error : null}
          >
            {isEditing ? (
              <BirthDateInput
                name="birthDate"
                defaultValue={birthDateValue || undefined}
                className={inputClass}
              />
            ) : (
              <p className={textClass}>
                {customer?.birthDate ? formatDate(customer.birthDate) : "-"}
                {customer?.birthDate && (
                  <span className="ml-2 text-sm font-normal text-zinc-500">
                    {formatBirthInfo(customer.birthDate)}
                  </span>
                )}
              </p>
            )}
          </Field>

          <Field label="주소" className="sm:col-span-2">
            {isEditing ? (
              <input
                name="address"
                defaultValue={address}
                className={inputClass}
              />
            ) : (
              <p className={textClass}>{customer?.address || "-"}</p>
            )}
          </Field>

          <Field label="체질">
            {isEditing ? (
              <input
                name="constitutionTag"
                placeholder="예: 태음인"
                defaultValue={constitutionTag}
                className={inputClass}
              />
            ) : (
              <p className={textClass}>{customer?.constitutionTag || "-"}</p>
            )}
          </Field>
          <Field label="등록일">
            <p className={textClass}>
              {customer ? formatDate(customer.createdAt) : "저장 시 자동 등록"}
            </p>
          </Field>

          <Field label="메모" className="sm:col-span-2">
            {isEditing ? (
              <textarea
                name="memo"
                rows={3}
                defaultValue={memo}
                className={inputClass}
              />
            ) : (
              <p className={`${textClass} whitespace-pre-wrap`}>
                {customer?.memo || "-"}
              </p>
            )}
          </Field>
        </div>
      </form>

      {customer && (
        <CustomerSummaryBar
          appointmentCount={customer.appointmentCount}
          consultationCount={customer.consultationCount}
          totalPaidAmount={customer.totalPaidAmount}
        />
      )}

      {customer && <ConsultationHistory consultations={customer.consultations} />}
    </div>
  );
}
