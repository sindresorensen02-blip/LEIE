import { normalizeNeighborhood } from "./neighborhoods";

const NO5_BERGEN_DEFAULT_NOK_PER_KWH = 1.42;

const BERGEN_NEIGHBORHOOD_KWH_PRICE: Record<string, number> = {
  sentrum: 1.48,
  bergenhus: 1.46,
  sandviken: 1.44,
  asane: 1.38,
  fana: 1.36,
  arstad: 1.43,
  fyllingsdalen: 1.4,
  laksevag: 1.39,
  loddefjord: 1.37,
  nesttun: 1.38,
  nygard: 1.47,
  mohlenpris: 1.46,
  nordnes: 1.47,
  danmarksplass: 1.44,
  landas: 1.42,
  kronstad: 1.43,
  paradis: 1.39,
  eidsvag: 1.4,
  bryggen: 1.49,
  solheimsviken: 1.43
};

export function getNeighborhoodElectricityPrice(area: string | null | undefined): number {
  const key = normalizeNeighborhood(area);
  return BERGEN_NEIGHBORHOOD_KWH_PRICE[key] ?? NO5_BERGEN_DEFAULT_NOK_PER_KWH;
}

export function formatKwhPrice(nokPerKwh: number): string {
  return `${nokPerKwh.toFixed(2).replace(".", ",")} kr/kWh`;
}
