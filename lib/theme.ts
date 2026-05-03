/**
 * LEIE brand palette — single source of truth.
 *
 * Tailwind reads these via `tailwind.config.ts`, MapView reads them for paint
 * specs, and `app/globals.css` mirrors them as CSS custom properties. Keep the
 * three in sync when changing a color.
 */
export const palette = {
  brand: {
    blue: "#0B6FF3",
    cyan: "#05B6E8",
    teal: "#00C7A7"
  },
  navy: "#102033",
  snow: "#F7FAFC",
  white: "#FFFFFF",
  ice: "#DDE7EF",
  iceStrong: "#C8D4DD",
  muted: "#64748B",
  amber: "#F59E0B",
  error: "#EF4444"
} as const;

export const marketSignalColors = {
  under_market: palette.brand.teal,
  market_price: palette.muted,
  above_market: palette.error,
  unknown: palette.brand.blue
} as const;
