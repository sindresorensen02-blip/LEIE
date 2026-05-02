import { getDb } from "./db";
import { getNeighborhoodCentroid } from "./neighborhoods";

export type GeocodeResult = {
  latitude: number;
  longitude: number;
  provider: string;
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
  if (cached) return cached;

  const centroid = getNeighborhoodCentroid(input.area);
  if (!centroid) return null;

  const result = {
    latitude: centroid.latitude,
    longitude: centroid.longitude,
    provider: "mock"
  };

  getDb()
    .prepare(
      "insert or replace into geocode_cache (query, latitude, longitude, provider, updated_at) values (?, ?, ?, ?, ?)"
    )
    .run(query, result.latitude, result.longitude, result.provider, new Date().toISOString());

  return result;
}
