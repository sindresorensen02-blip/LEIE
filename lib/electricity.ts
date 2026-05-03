/**
 * Bergen sits in price area NO5 of the Norwegian electricity market. We show a
 * single representative kWh rate alongside listings to give a felt sense of
 * monthly running cost; per-neighborhood variation is not modeled today.
 */
export const BERGEN_NO5_NOK_PER_KWH = 1.42;

export function getBergenElectricityRate(): number {
  return BERGEN_NO5_NOK_PER_KWH;
}

export function formatKwhPrice(nokPerKwh: number): string {
  return `${nokPerKwh.toFixed(2).replace(".", ",")} kr/kWh`;
}
