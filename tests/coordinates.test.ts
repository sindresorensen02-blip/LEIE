import { describe, expect, it } from "vitest";
import { mockListings } from "@/lib/mockListings";

describe("Bergen listing coordinates", () => {
  it("keeps listing coordinates in [longitude, latitude] map order ranges", () => {
    for (const listing of mockListings) {
      expect(listing.latitude, listing.id).toBeGreaterThanOrEqual(60.2);
      expect(listing.latitude, listing.id).toBeLessThanOrEqual(60.55);
      expect(listing.longitude, listing.id).toBeGreaterThanOrEqual(5.1);
      expect(listing.longitude, listing.id).toBeLessThanOrEqual(5.6);
    }
  });
});
