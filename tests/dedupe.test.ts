import { describe, expect, it } from "vitest";
import { dedupeListings } from "@/lib/dedupe";
import { mockListings } from "@/lib/mockListings";

describe("dedupe", () => {
  it("deduplicates exact URLs and keeps the richer listing", () => {
    const base = mockListings[0];
    const duplicate = {
      ...base,
      id: "duplicate",
      description: null,
      images: []
    };
    const results = dedupeListings([duplicate, base]);
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe(base.id);
  });
});
