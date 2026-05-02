import { describe, expect, it } from "vitest";
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
});
