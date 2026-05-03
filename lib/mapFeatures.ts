import type { FeatureCollection, Point } from "geojson";
import type { MarketSignal, RankedListing } from "./types";

export const BERGEN_BBOX = {
  minLat: 60.2,
  maxLat: 60.55,
  minLng: 5.1,
  maxLng: 5.6
} as const;

export type ListingFeatureProperties = {
  id: string;
  title: string;
  marketSignal: MarketSignal;
  selected: boolean;
  cheapest: boolean;
  approximate: boolean;
};

export function hasValidBergenCoordinates(listing: RankedListing): boolean {
  return (
    listing.latitude != null &&
    listing.longitude != null &&
    listing.latitude >= BERGEN_BBOX.minLat &&
    listing.latitude <= BERGEN_BBOX.maxLat &&
    listing.longitude >= BERGEN_BBOX.minLng &&
    listing.longitude <= BERGEN_BBOX.maxLng
  );
}

export function listingsToFeatureCollection(
  listings: RankedListing[],
  selectedId: string | null
): FeatureCollection<Point, ListingFeatureProperties> {
  return {
    type: "FeatureCollection",
    features: listings.filter(hasValidBergenCoordinates).map((listing) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [listing.longitude as number, listing.latitude as number]
      },
      properties: {
        id: listing.id,
        title: listing.title,
        marketSignal: listing.marketSignal ?? "unknown",
        selected: selectedId === listing.id,
        cheapest: listing.badges.includes("Cheapest"),
        approximate: listing.locationAccuracy === "approximate_area"
      }
    }))
  };
}

/**
 * Logs (in dev) any listing whose coordinates fall outside the Bergen bbox so
 * silent pin-disappearance becomes visible during development.
 */
export function warnOnRejectedCoordinates(listings: RankedListing[]): void {
  if (process.env.NODE_ENV === "production") return;
  for (const listing of listings) {
    if (listing.latitude == null || listing.longitude == null) continue;
    if (!hasValidBergenCoordinates(listing)) {
      console.warn(
        `[LEIE map] listing "${listing.id}" rejected: lat=${listing.latitude}, lng=${listing.longitude} is outside Bergen bbox`
      );
    }
  }
}
