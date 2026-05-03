import { describe, expect, it } from "vitest";
import { calculateAreaMarketPrices, getMarketSignal } from "@/lib/market";
import type { NormalizedListing } from "@/lib/types";

function makeListing(area: string, price: number | null): NormalizedListing {
  return {
    id: `${area}-${price}`,
    externalId: null,
    source: "mock",
    title: "t",
    listingUrl: "https://example.com",
    priceMonthlyNok: price,
    priceNightlyNok: null,
    estimatedMonthlyNok: price,
    depositNok: null,
    propertyType: "apartment",
    address: null,
    area,
    latitude: null,
    longitude: null,
    locationAccuracy: "approximate_area",
    bedrooms: null,
    sizeM2: null,
    availableFrom: null,
    images: [],
    description: null,
    scrapedAt: "2026-05-01T00:00:00.000Z",
    updatedAt: "2026-05-01T00:00:00.000Z"
  };
}

describe("getMarketSignal thresholds", () => {
  it("returns 'unknown' when either price is missing or zero", () => {
    expect(getMarketSignal(null, 10000).marketSignal).toBe("unknown");
    expect(getMarketSignal(10000, null).marketSignal).toBe("unknown");
    expect(getMarketSignal(10000, 0).marketSignal).toBe("unknown");
  });

  it("classifies under_market at exactly -8% and below", () => {
    expect(getMarketSignal(9200, 10000).marketSignal).toBe("under_market");
    expect(getMarketSignal(8000, 10000).marketSignal).toBe("under_market");
  });

  it("classifies market_price between -8% (exclusive) and +8% (exclusive)", () => {
    expect(getMarketSignal(9201, 10000).marketSignal).toBe("market_price");
    expect(getMarketSignal(10000, 10000).marketSignal).toBe("market_price");
    expect(getMarketSignal(10799, 10000).marketSignal).toBe("market_price");
  });

  it("classifies above_market at exactly +8% and above", () => {
    expect(getMarketSignal(10800, 10000).marketSignal).toBe("above_market");
    expect(getMarketSignal(15000, 10000).marketSignal).toBe("above_market");
  });

  it("returns the signed delta percent rounded by caller", () => {
    expect(getMarketSignal(11000, 10000).marketDeltaPercent).toBeCloseTo(10);
    expect(getMarketSignal(9000, 10000).marketDeltaPercent).toBeCloseTo(-10);
  });
});

describe("calculateAreaMarketPrices", () => {
  it("computes the median price per area and skips areas without prices", () => {
    const result = calculateAreaMarketPrices([
      makeListing("Sentrum", 10000),
      makeListing("Sentrum", 12000),
      makeListing("Sentrum", 14000),
      makeListing("Fana", null),
      makeListing("Nordnes", 8000),
      makeListing("Nordnes", 10000)
    ]);
    expect(result.get("Sentrum")).toBe(12000);
    expect(result.get("Nordnes")).toBe(9000);
    expect(result.has("Fana")).toBe(false);
  });
});
