import type { MarketSignal, NormalizedListing } from "./types";

function median(values: number[]) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function calculateAreaMarketPrices(listings: NormalizedListing[]) {
  const pricesByArea = new Map<string, number[]>();

  for (const listing of listings) {
    if (!listing.area || listing.estimatedMonthlyNok == null) continue;
    const current = pricesByArea.get(listing.area) ?? [];
    current.push(listing.estimatedMonthlyNok);
    pricesByArea.set(listing.area, current);
  }

  return new Map(
    [...pricesByArea.entries()]
      .map(([area, prices]) => [area, median(prices)] as const)
      .filter((entry): entry is readonly [string, number] => entry[1] != null)
  );
}

export function getMarketSignal(
  estimatedMonthlyNok: number | null,
  marketPriceNok: number | null | undefined
): {
  marketSignal: MarketSignal;
  marketDeltaPercent: number | null;
} {
  if (estimatedMonthlyNok == null || marketPriceNok == null || marketPriceNok <= 0) {
    return { marketSignal: "unknown", marketDeltaPercent: null };
  }

  const marketDeltaPercent = ((estimatedMonthlyNok - marketPriceNok) / marketPriceNok) * 100;
  if (marketDeltaPercent <= -8) return { marketSignal: "under_market", marketDeltaPercent };
  if (marketDeltaPercent >= 8) return { marketSignal: "above_market", marketDeltaPercent };
  return { marketSignal: "market_price", marketDeltaPercent };
}
