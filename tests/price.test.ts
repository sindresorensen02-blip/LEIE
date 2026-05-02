import { describe, expect, it } from "vitest";
import { estimatedMonthlyPrice, parseMonthlyPrice, parseNightlyPrice, parseNokPrice } from "@/lib/price";

describe("price parsing", () => {
  it("parses Norwegian and English NOK formats", () => {
    expect(parseNokPrice("12 500 kr/mnd")).toBe(12500);
    expect(parseNokPrice("12.500,-")).toBe(12500);
    expect(parseNokPrice("8 900 kr")).toBe(8900);
    expect(parseNokPrice("15 000 NOK/month")).toBe(15000);
  });

  it("distinguishes nightly and monthly prices", () => {
    expect(parseNightlyPrice("NOK 1,200 per night")).toBe(1200);
    expect(parseMonthlyPrice("NOK 1,200 per night")).toBeNull();
    expect(estimatedMonthlyPrice({ priceMonthlyNok: null, priceNightlyNok: 1200 })).toBe(36000);
  });
});
