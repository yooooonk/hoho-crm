"use client";

import { useState } from "react";

function toDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, 11);
}

function formatDigits(digits: string) {
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

export function PhoneInput({
  name,
  required,
  defaultValue,
  className,
}: {
  name: string;
  required?: boolean;
  defaultValue?: string;
  className?: string;
}) {
  const [value, setValue] = useState(() =>
    formatDigits(toDigits(defaultValue ?? "")),
  );

  return (
    <input
      type="text"
      inputMode="numeric"
      name={name}
      required={required}
      placeholder="010-0000-0000"
      maxLength={13}
      value={value}
      onChange={(event) => setValue(formatDigits(toDigits(event.target.value)))}
      className={className}
    />
  );
}
