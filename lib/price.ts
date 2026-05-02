import type { NormalizedListing } from "./types";

export function parseNokPrice(input: string): number | null {
  const normalized = input
    .replace(/\u00a0/g, " ")
    .replace(/,/g, "")
    .replace(/\.(?=\d{3}\b)/g, "")
    .toLowerCase();
  const match = normalized.match(/(?:nok|kr)?\s*(\d[\d\s]*)\s*(?:nok|kr)?/i);
  if (!match) return null;
  const value = Number.parseInt(match[1].replace(/\s/g, ""), 10);
  return Number.isFinite(value) ? value : null;
}

export function parseMonthlyPrice(input: string): number | null {
  const lower = input.toLowerCase();
  if (/(night|natt|per night|\/night)/.test(lower)) return null;
  return parseNokPrice(input);
}

export function parseNightlyPrice(input: string): number | null {
  const lower = input.toLowerCase();
  if (!/(night|natt|per night|\/night)/.test(lower)) return null;
  return parseNokPrice(input);
}

export function estimatedMonthlyPrice(
  listing: Pick<NormalizedListing, "priceMonthlyNok" | "priceNightlyNok">
) {
  if (listing.priceMonthlyNok != null) return listing.priceMonthlyNok;
  if (listing.priceNightlyNok != null) return listing.priceNightlyNok * 30;
  return null;
}

export function formatNok(value: number | null | undefined) {
  if (value == null) return "Price missing";
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    maximumFractionDigits: 0
  }).format(value);
}
