import { describe, expect, it } from "vitest";
import { getNeighborhoodCentroid } from "@/lib/neighborhoods";

describe("neighborhood fallback", () => {
  it("finds centroid even with Norwegian diacritics normalized", () => {
    expect(getNeighborhoodCentroid("Åsane")?.latitude).toBeCloseTo(60.4642);
    expect(getNeighborhoodCentroid("Mohlenpris")?.longitude).toBeCloseTo(5.3204);
  });
});
