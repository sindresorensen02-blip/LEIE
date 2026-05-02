import { describe, expect, it } from "vitest";
import { applyListingQuery } from "@/lib/filtering";
import { mockListings } from "@/lib/mockListings";

describe("listing filters", () => {
  it("filters by max price and puts missing prices last", () => {
    const results = applyListingQuery(mockListings, { maxPrice: 7000, includeShortTerm: false, sort: "cheapest" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((listing) => (listing.estimatedMonthlyNok ?? Infinity) <= 7000)).toBe(true);
    expect(results[0].estimatedMonthlyNok).toBeLessThanOrEqual(results.at(-1)?.estimatedMonthlyNok ?? Infinity);
  });

  it("filters by property type and source", () => {
    const results = applyListingQuery(mockListings, {
      propertyType: "room",
      source: "hybel",
      includeShortTerm: true
    });
    expect(results.every((listing) => listing.propertyType === "room" && listing.source === "hybel")).toBe(true);
  });
});
