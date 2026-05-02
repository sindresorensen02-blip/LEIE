import { describe, expect, it } from "vitest";
import { latLngToImagePoint } from "@/lib/mapCalibration";

describe("map calibration", () => {
  it("maps Bergen coordinates inside image percentages", () => {
    const point = latLngToImagePoint(60.39299, 5.32415);
    expect(point.xPercent).toBeGreaterThan(1);
    expect(point.xPercent).toBeLessThan(99);
    expect(point.yPercent).toBeGreaterThan(1);
    expect(point.yPercent).toBeLessThan(99);
  });
});
