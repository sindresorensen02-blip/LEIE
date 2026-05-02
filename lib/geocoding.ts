import { getDb } from "./db";
import { getNeighborhoodCentroid } from "./neighborhoods";
import type { LocationAccuracy, NormalizedListing } from "./types";

export type GeocodeResult = {
  latitude: number;
  longitude: number;
  provider: string;
  locationAccuracy: LocationAccuracy;
};

export async function geocodeBergenLocation(input: {
  address?: string | null;
  area?: string | null;
}): Promise<GeocodeResult | null> {
  const query = [input.address, input.area, "Bergen, Norway"].filter(Boolean).join(", ");
  if (!query.trim()) return null;

  const cached = getDb()
    .prepare("select latitude, longitude, provider from geocode_cache where query = ?")
    .get(query) as GeocodeResult | undefined;
  if (cached) {
    return {
      ...cached,
      locationAccuracy: input.address ? "address_geocoded" : "approximate_area"
    };
  }

  const centroid = getNeighborhoodCentroid(input.area);
  if (!centroid) return null;
  const locationAccuracy: LocationAccuracy = input.address ? "address_geocoded" : "approximate_area";

  const result: GeocodeResult = {
    latitude: centroid.latitude,
    longitude: centroid.longitude,
    provider: "mock",
    locationAccuracy
  };

  getDb()
    .prepare(
      "insert or replace into geocode_cache (query, latitude, longitude, provider, updated_at) values (?, ?, ?, ?, ?)"
    )
    .run(query, result.latitude, result.longitude, result.provider, new Date().toISOString());

  return result;
}

export async function resolveListingLocation(listing: NormalizedListing): Promise<NormalizedListing> {
  if (listing.latitude != null && listing.longitude != null && listing.locationAccuracy === "exact") {
    return listing;
  }

  const geocode = await geocodeBergenLocation({ address: listing.address, area: listing.area });
  if (!geocode) return listing;

  return {
    ...listing,
    latitude: listing.latitude ?? geocode.latitude,
    longitude: listing.longitude ?? geocode.longitude,
    locationAccuracy: listing.latitude != null && listing.longitude != null ? listing.locationAccuracy : geocode.locationAccuracy
  };
}
