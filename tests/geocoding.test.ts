import { describe, expect, it } from "vitest";
import { resolveListingLocation } from "@/lib/geocoding";
import { mockListings } from "@/lib/mockListings";

describe("listing location accuracy", () => {
  it("preserves exact listing coordinates", async () => {
    const listing = await resolveListingLocation(mockListings[0]);
    expect(listing.locationAccuracy).toBe("exact");
  });

  it("uses approximate area centroid when only neighborhood is known", async () => {
    const listing = await resolveListingLocation({
      ...mockListings[0],
      id: "area-only",
      address: null,
      area: "Sandviken",
      latitude: null,
      longitude: null,
      locationAccuracy: "approximate_area"
    });

    expect(listing.locationAccuracy).toBe("approximate_area");
    expect(listing.latitude).toBeCloseTo(60.4155);
    expect(listing.longitude).toBeCloseTo(5.3252);
  });
});
