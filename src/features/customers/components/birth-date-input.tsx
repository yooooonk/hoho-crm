"use client";

import { useState } from "react";
import { formatBirthInfo } from "@/lib/birth-info";

function toDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, 8);
}

function formatDigits(digits: string) {
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

function parseDate(digits: string) {
  if (digits.length !== 8) return null;
  const year = Number(digits.slice(0, 4));
  const month = Number(digits.slice(4, 6));
  const day = Number(digits.slice(6, 8));
  const date = new Date(year, month - 1, day);
  const isValid =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;
  return isValid ? date : null;
}

export function BirthDateInput({
  name,
  defaultValue,
  className,
}: {
  name: string;
  defaultValue?: string;
  className?: string;
}) {
  const [value, setValue] = useState(() =>
    formatDigits(toDigits(defaultValue ?? "")),
  );
  const parsedDate = parseDate(toDigits(value));

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        inputMode="numeric"
        name={name}
        placeholder="19920512"
        maxLength={10}
        value={value}
        onChange={(event) => setValue(formatDigits(toDigits(event.target.value)))}
        className={className}
      />
      {parsedDate && (
        <span className="whitespace-nowrap text-xs text-zinc-500">
          {formatBirthInfo(parsedDate)}
        </span>
      )}
    </div>
  );
}
