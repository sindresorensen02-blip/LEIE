export const BERGEN_NO5_NOK_PER_KWH = 1.42;

export function getNeighborhoodElectricityPrice(_area?: string | null): number {
  return BERGEN_NO5_NOK_PER_KWH;
}

export function formatKwhPrice(nokPerKwh: number): string {
  return `${nokPerKwh.toFixed(2).replace(".", ",")} kr/kWh`;
}
