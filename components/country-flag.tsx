"use client";

import type { ComponentPropsWithoutRef } from "react";

interface CountryFlagProps {
  code: string;
  className?: string;
}

export function CountryFlag({ code, className = "" }: CountryFlagProps) {
  const normalizedCode = code.toUpperCase();
  if (normalizedCode.length !== 2) {
    return <span className={className} aria-label="Invalid country code" />;
  }

  const flag = normalizedCode
    .split("")
    .map((char) => String.fromCodePoint(0x1f1e6 + char.charCodeAt(0) - 0x41))
    .join("");

  return (
    <span
      className={`inline-flex items-center ${className}`}
      aria-label={normalizedCode}
      role="img"
    >
      {flag}
    </span>
  );
}

export function CFlag({ children, className = "", ...props }: ComponentPropsWithoutRef<"span"> & { children?: React.ReactNode }) {
  const code = (children as string)?.trim?.() || "";
  return <CountryFlag code={code} className={className} {...props} />;
}