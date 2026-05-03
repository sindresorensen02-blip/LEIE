import { describe, expect, it } from "vitest";
import { applyListingQuery } from "@/lib/filtering";
import { rankListings } from "@/lib/ranking";
import { mockListings } from "@/lib/mockListings";

describe("ranking", () => {
  it("adds cheapest, short-term, room, and available badges", () => {
    const ranked = rankListings(mockListings);
    expect(ranked.some((listing) => listing.badges.includes("Cheapest"))).toBe(true);
    expect(ranked.some((listing) => listing.badges.includes("Short-term"))).toBe(true);
    expect(ranked.some((listing) => listing.badges.includes("Room"))).toBe(true);
    expect(ranked.some((listing) => listing.badges.includes("Available now"))).toBe(true);
  });

  it("classifies listings against their area market median", () => {
    const ranked = rankListings(mockListings);
    expect(ranked.some((listing) => listing.marketSignal === "under_market")).toBe(true);
    expect(ranked.some((listing) => listing.marketSignal === "market_price")).toBe(true);
    expect(ranked.some((listing) => listing.marketSignal === "above_market")).toBe(true);
  });

  it("computes Cheapest within the filtered subset (not against the global dataset)", () => {
    const apartmentsOnly = applyListingQuery(mockListings, {
      propertyType: "apartment",
      includeShortTerm: true,
      sort: "cheapest"
    });
    const ranked = rankListings(apartmentsOnly);
    const cheapestPrices = ranked
      .filter((listing) => listing.badges.includes("Cheapest"))
      .map((listing) => listing.estimatedMonthlyNok ?? Number.POSITIVE_INFINITY);
    const minPrice = Math.min(
      ...ranked.map((listing) => listing.estimatedMonthlyNok ?? Number.POSITIVE_INFINITY)
    );
    expect(cheapestPrices.length).toBeGreaterThan(0);
    expect(Math.min(...cheapestPrices)).toBe(minPrice);
    expect(ranked.every((listing) => listing.propertyType === "apartment")).toBe(true);
  });

  it("returns an empty list for an empty input without throwing", () => {
    expect(rankListings([])).toEqual([]);
  });
});
