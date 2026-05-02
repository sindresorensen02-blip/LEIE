import type { NormalizedListing } from "./types";

function normalizeText(value: string | null | undefined) {
  return (
    value
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim() ?? ""
  );
}

function completenessScore(listing: NormalizedListing) {
  return [
    listing.priceMonthlyNok,
    listing.priceNightlyNok,
    listing.estimatedMonthlyNok,
    listing.address,
    listing.latitude,
    listing.longitude,
    listing.bedrooms,
    listing.sizeM2,
    listing.description,
    listing.images.length ? listing.images[0] : null
  ].filter((value) => value != null && value !== "").length;
}

function arePossibleDuplicates(a: NormalizedListing, b: NormalizedListing) {
  if (a.listingUrl && b.listingUrl && a.listingUrl === b.listingUrl) return true;
  if (a.source === b.source && a.externalId && a.externalId === b.externalId) return true;

  const sameArea = normalizeText(a.area) && normalizeText(a.area) === normalizeText(b.area);
  const similarTitle =
    normalizeText(a.title).split(" ").filter((word) => normalizeText(b.title).includes(word)).length >= 3;
  const priceDelta =
    a.estimatedMonthlyNok != null && b.estimatedMonthlyNok != null
      ? Math.abs(a.estimatedMonthlyNok - b.estimatedMonthlyNok)
      : Number.POSITIVE_INFINITY;
  if (sameArea && similarTitle && priceDelta <= 750) return true;

  const sameAddress = normalizeText(a.address) && normalizeText(a.address) === normalizeText(b.address);
  const similarSize =
    a.sizeM2 != null && b.sizeM2 != null ? Math.abs(a.sizeM2 - b.sizeM2) <= 3 : false;
  return Boolean(sameAddress && similarSize);
}

export function dedupeListings(listings: NormalizedListing[]) {
  const result: NormalizedListing[] = [];
  for (const listing of listings) {
    const existingIndex = result.findIndex((candidate) => arePossibleDuplicates(candidate, listing));
    if (existingIndex === -1) {
      result.push(listing);
      continue;
    }
    if (completenessScore(listing) > completenessScore(result[existingIndex])) {
      result[existingIndex] = listing;
    }
  }
  return result;
}
