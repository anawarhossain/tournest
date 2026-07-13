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
  return error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");
}

/**
 * Stripe does not support charging in BDT (Bangladeshi Taka) — requirements §11
 * flags this and asks for a USD-equivalent fallback. The rate is configurable via
 * env so it can be kept current without a code change; NEXT_PUBLIC_ so the price
 * shown at checkout on the client matches what Stripe will actually charge.
 * For production, replace the static rate with a live FX rate lookup.
 */
export const BDT_TO_USD_RATE = Number(
  process.env.NEXT_PUBLIC_BDT_TO_USD_RATE ?? "0.0084",
);

/** Converts a BDT amount to whole USD cents for Stripe's `unit_amount`. */
export function bdtToUsdCents(amountBdt: number): number {
  return Math.round(amountBdt * BDT_TO_USD_RATE * 100);
}

/** Converts a BDT amount to a USD amount (2dp), e.g. for display at checkout. */
export function bdtToUsd(amountBdt: number): number {
  return Math.round(amountBdt * BDT_TO_USD_RATE * 100) / 100;
}
