export type NeighborhoodCentroid = {
  name: string;
  latitude: number;
  longitude: number;
};

export const BERGEN_SENTRUM = {
  latitude: 60.39299,
  longitude: 5.32415
};

export const BERGEN_NEIGHBORHOODS: Record<string, NeighborhoodCentroid> = {
  sentrum: { name: "Sentrum", latitude: 60.39299, longitude: 5.32415 },
  bergenhus: { name: "Bergenhus", latitude: 60.4011, longitude: 5.3186 },
  sandviken: { name: "Sandviken", latitude: 60.4155, longitude: 5.3252 },
  "åsane": { name: "Åsane", latitude: 60.4642, longitude: 5.3262 },
  asane: { name: "Åsane", latitude: 60.4642, longitude: 5.3262 },
  fana: { name: "Fana", latitude: 60.2965, longitude: 5.3542 },
  "årstad": { name: "Årstad", latitude: 60.3742, longitude: 5.3463 },
  arstad: { name: "Årstad", latitude: 60.3742, longitude: 5.3463 },
  fyllingsdalen: { name: "Fyllingsdalen", latitude: 60.3516, longitude: 5.2855 },
  "laksevåg": { name: "Laksevåg", latitude: 60.3885, longitude: 5.2842 },
  laksevag: { name: "Laksevåg", latitude: 60.3885, longitude: 5.2842 },
  loddefjord: { name: "Loddefjord", latitude: 60.3632, longitude: 5.2326 },
  nesttun: { name: "Nesttun", latitude: 60.3171, longitude: 5.3546 },
  "nygård": { name: "Nygård", latitude: 60.3868, longitude: 5.3266 },
  nygard: { name: "Nygård", latitude: 60.3868, longitude: 5.3266 },
  "møhlenpris": { name: "Møhlenpris", latitude: 60.3824, longitude: 5.3204 },
  mohlenpris: { name: "Møhlenpris", latitude: 60.3824, longitude: 5.3204 },
  nordnes: { name: "Nordnes", latitude: 60.3971, longitude: 5.3064 },
  danmarksplass: { name: "Danmarksplass", latitude: 60.373, longitude: 5.3384 },
  "landås": { name: "Landås", latitude: 60.365, longitude: 5.3638 },
  landas: { name: "Landås", latitude: 60.365, longitude: 5.3638 },
  kronstad: { name: "Kronstad", latitude: 60.3739, longitude: 5.3491 },
  paradis: { name: "Paradis", latitude: 60.3372, longitude: 5.3497 },
  "eidsvåg": { name: "Eidsvåg", latitude: 60.4436, longitude: 5.3079 },
  eidsvag: { name: "Eidsvåg", latitude: 60.4436, longitude: 5.3079 },
  bryggen: { name: "Bryggen", latitude: 60.3974, longitude: 5.3247 },
  solheimsviken: { name: "Solheimsviken", latitude: 60.3773, longitude: 5.3324 }
};

export function normalizeNeighborhood(value: string | null | undefined) {
  return value?.trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "") ?? "";
}

export function getNeighborhoodCentroid(area: string | null | undefined) {
  if (!area) return null;
  const direct = BERGEN_NEIGHBORHOODS[area.trim().toLowerCase()];
  if (direct) return direct;
  return BERGEN_NEIGHBORHOODS[normalizeNeighborhood(area)] ?? null;
}
