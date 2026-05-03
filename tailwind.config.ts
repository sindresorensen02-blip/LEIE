import type { Config } from "tailwindcss";
import { palette } from "./lib/theme";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: palette.brand,
        navy: palette.navy,
        snow: palette.snow,
        ice: palette.ice,
        "ice-strong": palette.iceStrong,
        muted: palette.muted,
        "muted-strong": palette.mutedStrong,
        amber: palette.amber,
        error: palette.error
      },
      backgroundImage: {
        "brand-gradient": `linear-gradient(135deg, ${palette.brand.blue} 0%, ${palette.brand.cyan} 50%, ${palette.brand.teal} 100%)`
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 32, 51, 0.04), 0 4px 16px rgba(16, 32, 51, 0.06)",
        "card-hover":
          "0 2px 6px rgba(16, 32, 51, 0.06), 0 12px 32px rgba(16, 32, 51, 0.08)",
        focus: "0 0 0 3px rgba(11, 111, 243, 0.18)"
      },
      borderRadius: {
        "2xl": "1rem"
      }
    }
  },
  plugins: []
};

export default config;
