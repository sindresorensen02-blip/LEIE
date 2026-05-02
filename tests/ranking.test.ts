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
});
