import type { NormalizedListing, PropertyType } from "./types";

export const BERGEN_NOK_PER_KWH = 1.42;

export const KWH_PER_M2_ANNUAL: Record<PropertyType, number> = {
  house: 175,
  apartment: 130,
  studio: 115,
  room: 95,
  shared_room: 80,
  unknown: 130
};

export const FLAT_KWH_MONTHLY: Record<PropertyType, number> = {
  house: 320,
  apartment: 180,
  studio: 130,
  room: 85,
  shared_room: 70,
  unknown: 180
};

export const INTERNET_NOK_DEFAULT = 499;
export const TRANSPORT_NOK_DEFAULT = 755;

export type CostConfidence = "low" | "medium" | "high";

export interface TotalMonthlyCost {
  rentNok: number;
  electricityNok: number;
  internetNok: number;
  transportNok: number;
  totalNok: number;
  assumptions: string[];
  confidence: CostConfidence;
}

export interface TotalCostOptions {
  includeInternet?: boolean;
  includeTransport?: boolean;
  nokPerKwh?: number;
  internetNok?: number;
  transportNok?: number;
}

type CostInputListing = Pick<
  NormalizedListing,
  "estimatedMonthlyNok" | "priceMonthlyNok" | "priceNightlyNok" | "propertyType" | "sizeM2"
>;

export function calculateTotalMonthlyCost(
  listing: CostInputListing,
  opts: TotalCostOptions = {}
): TotalMonthlyCost {
  const {
    includeInternet = true,
    includeTransport = false,
    nokPerKwh = BERGEN_NOK_PER_KWH,
    internetNok = INTERNET_NOK_DEFAULT,
    transportNok = TRANSPORT_NOK_DEFAULT
  } = opts;

  const assumptions: string[] = [];
  let confidence: CostConfidence = "high";

  const rentNok =
    listing.estimatedMonthlyNok ??
    listing.priceMonthlyNok ??
    (listing.priceNightlyNok != null ? listing.priceNightlyNok * 30 : 0);

  const isShortTerm = listing.priceNightlyNok != null && listing.priceMonthlyNok == null;

  let electricityNok = 0;

  if (isShortTerm) {
    assumptions.push("Strøm antatt inkludert i korttidspris (nattleie)");
  } else if (listing.sizeM2 != null && listing.propertyType) {
    const kwhPerM2 = KWH_PER_M2_ANNUAL[listing.propertyType] ?? KWH_PER_M2_ANNUAL.unknown;
    electricityNok = Math.round(((listing.sizeM2 * kwhPerM2) / 12) * nokPerKwh);
    assumptions.push(
      `Strøm: ${listing.sizeM2} m² × ${kwhPerM2} kWh/m²/år ÷ 12 × ${nokPerKwh.toFixed(2)} kr/kWh`
    );
  } else if (listing.propertyType) {
    const flatKwh = FLAT_KWH_MONTHLY[listing.propertyType] ?? FLAT_KWH_MONTHLY.unknown;
    electricityNok = Math.round(flatKwh * nokPerKwh);
    assumptions.push(
      `Strøm: estimert uten arealdata — typebasert gjennomsnitt (${flatKwh} kWh/mnd × ${nokPerKwh.toFixed(2)} kr/kWh)`
    );
    if (confidence === "high") confidence = "medium";
  } else {
    electricityNok = Math.round(FLAT_KWH_MONTHLY.unknown * nokPerKwh);
    assumptions.push(
      `Strøm: fallback-estimat uten type- eller arealdata (${FLAT_KWH_MONTHLY.unknown} kWh/mnd antatt)`
    );
    confidence = "low";
  }

  let internetEstNok = 0;
  if (includeInternet && !isShortTerm) {
    internetEstNok = internetNok;
    assumptions.push(
      `Internett: typisk fastpris ${internetNok} kr/mnd (kan allerede være inkludert i husleien)`
    );
    if (confidence === "high") confidence = "medium";
  }

  let transportEstNok = 0;
  if (includeTransport) {
    transportEstNok = transportNok;
    assumptions.push(`Månedskort Skyss Bergen: ${transportNok} kr/mnd`);
  }

  const totalNok = rentNok + electricityNok + internetEstNok + transportEstNok;

  return {
    rentNok,
    electricityNok,
    internetNok: internetEstNok,
    transportNok: transportEstNok,
    totalNok,
    assumptions,
    confidence
  };
}
