import { describe, expect, it } from "vitest";
import {
  hasValidBergenCoordinates,
  listingsToFeatureCollection
} from "@/lib/mapFeatures";
import type { RankedListing } from "@/lib/types";

function makeListing(overrides: Partial<RankedListing> = {}): RankedListing {
  return {
    id: "test-1",
    externalId: null,
    source: "mock",
    title: "Test listing",
    listingUrl: "https://example.com",
    priceMonthlyNok: 10000,
    priceNightlyNok: null,
    estimatedMonthlyNok: 10000,
    depositNok: null,
    propertyType: "apartment",
    address: null,
    area: "Sentrum",
    latitude: 60.39,
    longitude: 5.32,
    locationAccuracy: "exact",
    bedrooms: 1,
    sizeM2: 40,
    availableFrom: null,
    images: [],
    description: null,
    scrapedAt: "2026-05-01T00:00:00.000Z",
    updatedAt: "2026-05-01T00:00:00.000Z",
    badges: [],
    marketSignal: "market_price",
    marketDeltaPercent: 0,
    marketPriceNok: 10000,
    ...overrides
  };
}

describe("hasValidBergenCoordinates", () => {
  it("accepts coordinates inside the Bergen bbox", () => {
    expect(hasValidBergenCoordinates(makeListing({ latitude: 60.39, longitude: 5.32 }))).toBe(true);
  });

  it("rejects null coordinates", () => {
    expect(hasValidBergenCoordinates(makeListing({ latitude: null, longitude: null }))).toBe(false);
  });

  it("rejects coordinates outside the Bergen bbox", () => {
    expect(hasValidBergenCoordinates(makeListing({ latitude: 59.91, longitude: 10.75 }))).toBe(false);
    expect(hasValidBergenCoordinates(makeListing({ latitude: 60.39, longitude: 0 }))).toBe(false);
  });

  it("rejects swapped lat/lng (a common bug)", () => {
    expect(hasValidBergenCoordinates(makeListing({ latitude: 5.32, longitude: 60.39 }))).toBe(false);
  });
});

describe("listingsToFeatureCollection", () => {
  it("emits one feature per valid listing in [lng, lat] order", () => {
    const collection = listingsToFeatureCollection(
      [
        makeListing({ id: "a", latitude: 60.39, longitude: 5.32 }),
        makeListing({ id: "b", latitude: 60.45, longitude: 5.28 })
      ],
      null
    );
    expect(collection.features).toHaveLength(2);
    expect(collection.features[0].geometry.coordinates).toEqual([5.32, 60.39]);
    expect(collection.features[1].geometry.coordinates).toEqual([5.28, 60.45]);
  });

  it("filters out listings with invalid coordinates", () => {
    const collection = listingsToFeatureCollection(
      [
        makeListing({ id: "in-bergen", latitude: 60.39, longitude: 5.32 }),
        makeListing({ id: "outside", latitude: 59.91, longitude: 10.75 }),
        makeListing({ id: "missing", latitude: null, longitude: null })
      ],
      null
    );
    expect(collection.features.map((feature) => feature.properties.id)).toEqual(["in-bergen"]);
  });

  it("marks the matching id as selected", () => {
    const collection = listingsToFeatureCollection(
      [
        makeListing({ id: "a" }),
        makeListing({ id: "b" })
      ],
      "b"
    );
    expect(collection.features.find((f) => f.properties.id === "a")?.properties.selected).toBe(false);
    expect(collection.features.find((f) => f.properties.id === "b")?.properties.selected).toBe(true);
  });

  it("derives cheapest from the Cheapest badge and approximate from locationAccuracy", () => {
    const collection = listingsToFeatureCollection(
      [
        makeListing({ id: "cheap", badges: ["Cheapest"], locationAccuracy: "exact" }),
        makeListing({ id: "approx", badges: [], locationAccuracy: "approximate_area" })
      ],
      null
    );
    expect(collection.features[0].properties.cheapest).toBe(true);
    expect(collection.features[0].properties.approximate).toBe(false);
    expect(collection.features[1].properties.cheapest).toBe(false);
    expect(collection.features[1].properties.approximate).toBe(true);
  });
});
