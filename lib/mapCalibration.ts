export type ImagePoint = {
  xPercent: number;
  yPercent: number;
};

export const BERGEN_IMAGE_BOUNDS = {
  north: 60.52,
  south: 60.25,
  west: 5.12,
  east: 5.55
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function latLngToImagePoint(lat: number, lng: number): ImagePoint {
  const x =
    ((lng - BERGEN_IMAGE_BOUNDS.west) /
      (BERGEN_IMAGE_BOUNDS.east - BERGEN_IMAGE_BOUNDS.west)) *
    100;
  const y =
    ((BERGEN_IMAGE_BOUNDS.north - lat) /
      (BERGEN_IMAGE_BOUNDS.north - BERGEN_IMAGE_BOUNDS.south)) *
    100;

  return {
    xPercent: clamp(x, 1, 99),
    yPercent: clamp(y, 1, 99)
  };
}

/*
  Calibration notes:
  - Increase west/east span if pins appear too far left or right.
  - Move west/east together if the whole pin layer needs horizontal shifting.
  - Increase/decrease north/south if pins appear too high or low.
  - The generated Bergen image is not a real map tile, so these bounds are
    intentionally approximate and should be manually tuned against the artwork.
*/
