import { isAvailableNow } from "./filtering";
import type { ListingBadge, NormalizedListing, RankedListing } from "./types";

function median(values: number[]) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function rankListings(listings: NormalizedListing[]): RankedListing[] {
  const priced = listings
    .filter((listing) => listing.estimatedMonthlyNok != null)
    .sort((a, b) => (a.estimatedMonthlyNok ?? 0) - (b.estimatedMonthlyNok ?? 0));
  const cheapestCutoff = Math.max(1, Math.ceil(priced.length * 0.1));
  const cheapestIds = new Set(priced.slice(0, cheapestCutoff).map((listing) => listing.id));
  const mediansByArea = new Map<string, number>();

  for (const area of new Set(listings.map((listing) => listing.area).filter(Boolean) as string[])) {
    const areaMedian = median(
      listings
        .filter((listing) => listing.area === area && listing.estimatedMonthlyNok != null)
        .map((listing) => listing.estimatedMonthlyNok as number)
    );
    if (areaMedian != null) mediansByArea.set(area, areaMedian);
  }

  return listings.map((listing) => {
    const badges: ListingBadge[] = [];
    if (cheapestIds.has(listing.id)) badges.push("Cheapest");
    if (
      listing.area &&
      listing.estimatedMonthlyNok != null &&
      mediansByArea.has(listing.area) &&
      listing.estimatedMonthlyNok < (mediansByArea.get(listing.area) as number)
    ) {
      badges.push("Good value");
    }
    if (listing.propertyType === "room" || listing.propertyType === "shared_room") badges.push("Room");
    if (listing.priceNightlyNok != null) badges.push("Short-term");
    if (isAvailableNow(listing.availableFrom)) badges.push("Available now");
    return { ...listing, badges };
  });
}
