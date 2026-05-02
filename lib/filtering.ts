import { isBefore, parseISO, startOfToday } from "date-fns";
import { distanceKm } from "./distance";
import type { ListingFilters, NormalizedListing } from "./types";

export function isAvailableNow(value: string | null) {
  if (!value) return false;
  return isBefore(parseISO(value), startOfToday()) || value === startOfToday().toISOString().slice(0, 10);
}

export function filterListings(listings: NormalizedListing[], filters: ListingFilters) {
  return listings.filter((listing) => {
    if (filters.maxPrice && (listing.estimatedMonthlyNok ?? Number.POSITIVE_INFINITY) > filters.maxPrice) {
      return false;
    }
    if (filters.propertyType && filters.propertyType !== "all" && listing.propertyType !== filters.propertyType) {
      return false;
    }
    if (filters.source && filters.source !== "all" && listing.source !== filters.source) {
      return false;
    }
    if (filters.minSize && (listing.sizeM2 ?? 0) < filters.minSize) {
      return false;
    }
    if (filters.minBedrooms && (listing.bedrooms ?? 0) < filters.minBedrooms) {
      return false;
    }
    if (filters.onlyAvailableNow && !isAvailableNow(listing.availableFrom)) {
      return false;
    }
    if (filters.includeShortTerm === false && listing.priceNightlyNok != null) {
      return false;
    }
    return true;
  });
}

export function sortListings(listings: NormalizedListing[], filters: ListingFilters) {
  const origin =
    filters.lat != null && filters.lng != null
      ? { latitude: filters.lat, longitude: filters.lng }
      : null;

  return [...listings].sort((a, b) => {
    if (filters.sort === "newest") {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    if (filters.sort === "largest") {
      return (b.sizeM2 ?? -1) - (a.sizeM2 ?? -1);
    }
    if (filters.sort === "closest" && origin) {
      const aDistance =
        a.latitude != null && a.longitude != null
          ? distanceKm(origin, { latitude: a.latitude, longitude: a.longitude })
          : Number.POSITIVE_INFINITY;
      const bDistance =
        b.latitude != null && b.longitude != null
          ? distanceKm(origin, { latitude: b.latitude, longitude: b.longitude })
          : Number.POSITIVE_INFINITY;
      return aDistance - bDistance;
    }
    const aPrice = a.estimatedMonthlyNok ?? Number.POSITIVE_INFINITY;
    const bPrice = b.estimatedMonthlyNok ?? Number.POSITIVE_INFINITY;
    return aPrice - bPrice;
  });
}

export function applyListingQuery(listings: NormalizedListing[], filters: ListingFilters) {
  return sortListings(filterListings(listings, filters), filters);
}
