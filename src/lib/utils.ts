// src/lib/utils.ts
import type { ZodError } from "zod";

/** Formats a number as Bangladeshi Taka, e.g. formatBDT(12000) -> "৳12,000" */
export function formatBDT(amount: number): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Flattens a ZodError into a single human-readable string for API error responses. */
export function zodErrorMessage(error: ZodError): string {
  return error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
}
