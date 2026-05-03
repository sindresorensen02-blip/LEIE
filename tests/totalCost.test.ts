import { describe, it, expect } from "vitest";
import {
  calculateTotalMonthlyCost,
  BERGEN_NOK_PER_KWH,
  KWH_PER_M2_ANNUAL,
  FLAT_KWH_MONTHLY,
  INTERNET_NOK_DEFAULT,
  TRANSPORT_NOK_DEFAULT
} from "@/lib/totalCost";
import type { PropertyType } from "@/lib/types";

type ListingInput = {
  estimatedMonthlyNok: number | null;
  priceMonthlyNok: number | null;
  priceNightlyNok: number | null;
  propertyType: PropertyType;
  sizeM2: number | null;
};

function makeListing(overrides: Partial<ListingInput> = {}): ListingInput {
  return {
    estimatedMonthlyNok: 10000,
    priceMonthlyNok: 10000,
    priceNightlyNok: null,
    propertyType: "apartment",
    sizeM2: 50,
    ...overrides
  };
}

describe("calculateTotalMonthlyCost — core", () => {
  it("returns correct structure", () => {
    const result = calculateTotalMonthlyCost(makeListing());
    expect(result).toHaveProperty("rentNok");
    expect(result).toHaveProperty("electricityNok");
    expect(result).toHaveProperty("internetNok");
    expect(result).toHaveProperty("transportNok");
    expect(result).toHaveProperty("totalNok");
    expect(result).toHaveProperty("assumptions");
    expect(result).toHaveProperty("confidence");
    expect(Array.isArray(result.assumptions)).toBe(true);
  });

  it("sums all components correctly", () => {
    const listing = makeListing({ estimatedMonthlyNok: 12000, sizeM2: 60, propertyType: "apartment" });
    const result = calculateTotalMonthlyCost(listing, {
      includeInternet: true,
      includeTransport: true
    });
    expect(result.totalNok).toBe(
      result.rentNok + result.electricityNok + result.internetNok + result.transportNok
    );
  });

  it("uses estimatedMonthlyNok as rent when available", () => {
    const result = calculateTotalMonthlyCost(makeListing({ estimatedMonthlyNok: 15000 }));
    expect(result.rentNok).toBe(15000);
  });

  it("falls back to priceMonthlyNok when estimatedMonthlyNok is null", () => {
    const result = calculateTotalMonthlyCost(
      makeListing({ estimatedMonthlyNok: null, priceMonthlyNok: 9500 })
    );
    expect(result.rentNok).toBe(9500);
  });
});

describe("calculateTotalMonthlyCost — electricity", () => {
  it("calculates electricity from size and property type", () => {
    const listing = makeListing({ sizeM2: 60, propertyType: "apartment" });
    const expected = Math.round((60 * KWH_PER_M2_ANNUAL.apartment / 12) * BERGEN_NOK_PER_KWH);
    const result = calculateTotalMonthlyCost(listing, { includeInternet: false });
    expect(result.electricityNok).toBe(expected);
  });

  it("uses flat estimate when sizeM2 is null", () => {
    const listing = makeListing({ sizeM2: null, propertyType: "studio" });
    const expected = Math.round(FLAT_KWH_MONTHLY.studio * BERGEN_NOK_PER_KWH);
    const result = calculateTotalMonthlyCost(listing, { includeInternet: false });
    expect(result.electricityNok).toBe(expected);
    expect(result.confidence).toBe("medium");
  });

  it("respects custom nokPerKwh override", () => {
    const listing = makeListing({ sizeM2: 40, propertyType: "room" });
    const customRate = 2.0;
    const expected = Math.round((40 * KWH_PER_M2_ANNUAL.room / 12) * customRate);
    const result = calculateTotalMonthlyCost(listing, {
      nokPerKwh: customRate,
      includeInternet: false
    });
    expect(result.electricityNok).toBe(expected);
  });

  it("has high confidence when size and type are known", () => {
    const result = calculateTotalMonthlyCost(
      makeListing({ sizeM2: 50, propertyType: "apartment" }),
      { includeInternet: false }
    );
    expect(result.confidence).toBe("high");
  });
});

describe("calculateTotalMonthlyCost — short-term listings", () => {
  it("sets electricityNok to 0 for nightly listings", () => {
    const listing = makeListing({
      estimatedMonthlyNok: null,
      priceMonthlyNok: null,
      priceNightlyNok: 900,
      sizeM2: 30,
      propertyType: "studio"
    });
    const result = calculateTotalMonthlyCost(listing);
    expect(result.electricityNok).toBe(0);
  });

  it("estimates rent as nightly × 30 when only nightly price exists", () => {
    const listing = makeListing({
      estimatedMonthlyNok: null,
      priceMonthlyNok: null,
      priceNightlyNok: 800
    });
    const result = calculateTotalMonthlyCost(listing);
    expect(result.rentNok).toBe(800 * 30);
  });

  it("does not include internet for short-term listings by default", () => {
    const listing = makeListing({
      estimatedMonthlyNok: null,
      priceMonthlyNok: null,
      priceNightlyNok: 1200
    });
    const result = calculateTotalMonthlyCost(listing, { includeInternet: true });
    expect(result.internetNok).toBe(0);
  });

  it("records assumption about electricity being included", () => {
    const listing = makeListing({
      estimatedMonthlyNok: null,
      priceMonthlyNok: null,
      priceNightlyNok: 950
    });
    const result = calculateTotalMonthlyCost(listing);
    expect(result.assumptions.some((a) => a.includes("korttidspris"))).toBe(true);
  });
});

describe("calculateTotalMonthlyCost — internet", () => {
  it("includes default internet cost when includeInternet is true", () => {
    const result = calculateTotalMonthlyCost(makeListing(), { includeInternet: true });
    expect(result.internetNok).toBe(INTERNET_NOK_DEFAULT);
  });

  it("excludes internet when includeInternet is false", () => {
    const result = calculateTotalMonthlyCost(makeListing(), { includeInternet: false });
    expect(result.internetNok).toBe(0);
  });

  it("respects custom internet cost override", () => {
    const result = calculateTotalMonthlyCost(makeListing(), {
      includeInternet: true,
      internetNok: 599
    });
    expect(result.internetNok).toBe(599);
  });

  it("lowers confidence to at most medium when internet is included", () => {
    const result = calculateTotalMonthlyCost(
      makeListing({ sizeM2: 50, propertyType: "apartment" }),
      { includeInternet: true }
    );
    expect(result.confidence).not.toBe("high");
  });
});

describe("calculateTotalMonthlyCost — transport", () => {
  it("excludes transport by default", () => {
    const result = calculateTotalMonthlyCost(makeListing());
    expect(result.transportNok).toBe(0);
  });

  it("includes transport when includeTransport is true", () => {
    const result = calculateTotalMonthlyCost(makeListing(), { includeTransport: true });
    expect(result.transportNok).toBe(TRANSPORT_NOK_DEFAULT);
  });

  it("respects custom transport cost", () => {
    const result = calculateTotalMonthlyCost(makeListing(), {
      includeTransport: true,
      transportNok: 800
    });
    expect(result.transportNok).toBe(800);
  });
});

describe("sorting by total monthly cost", () => {
  it("sorts listings by totalNok ascending", () => {
    const listings = [
      makeListing({ estimatedMonthlyNok: 15000, sizeM2: 80, propertyType: "apartment" }),
      makeListing({ estimatedMonthlyNok: 7000, sizeM2: 20, propertyType: "room" }),
      makeListing({ estimatedMonthlyNok: 10000, sizeM2: 50, propertyType: "studio" })
    ].map((l) => ({ ...l, totalCost: calculateTotalMonthlyCost(l, { includeInternet: true }) }));

    const sorted = [...listings].sort((a, b) => a.totalCost.totalNok - b.totalCost.totalNok);
    expect(sorted[0].totalCost.totalNok).toBeLessThanOrEqual(sorted[1].totalCost.totalNok);
    expect(sorted[1].totalCost.totalNok).toBeLessThanOrEqual(sorted[2].totalCost.totalNok);
  });

  it("places cheapest-total listing first", () => {
    const listings = [
      makeListing({ estimatedMonthlyNok: 20000, sizeM2: 100, propertyType: "house" }),
      makeListing({ estimatedMonthlyNok: 5500, sizeM2: 12, propertyType: "room" })
    ].map((l) => ({ ...l, totalCost: calculateTotalMonthlyCost(l) }));

    const sorted = [...listings].sort((a, b) => a.totalCost.totalNok - b.totalCost.totalNok);
    expect(sorted[0].estimatedMonthlyNok).toBe(5500);
  });
});

describe("calculateTotalMonthlyCost — assumptions", () => {
  it("always returns at least one assumption", () => {
    const result = calculateTotalMonthlyCost(makeListing());
    expect(result.assumptions.length).toBeGreaterThan(0);
  });

  it("records an electricity assumption for long-term listings", () => {
    const result = calculateTotalMonthlyCost(makeListing({ sizeM2: 40 }));
    expect(result.assumptions.some((a) => a.toLowerCase().includes("strøm"))).toBe(true);
  });

  it("records an internet assumption when included", () => {
    const result = calculateTotalMonthlyCost(makeListing(), { includeInternet: true });
    expect(result.assumptions.some((a) => a.toLowerCase().includes("internett"))).toBe(true);
  });

  it("records a transport assumption when included", () => {
    const result = calculateTotalMonthlyCost(makeListing(), { includeTransport: true });
    expect(result.assumptions.some((a) => a.toLowerCase().includes("skyss"))).toBe(true);
  });
});
