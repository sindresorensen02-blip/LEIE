import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0B6FF3",
          cyan: "#05B6E8",
          teal: "#00C7A7"
        },
        navy: "#102033",
        snow: "#F7FAFC",
        ice: "#DDE7EF",
        muted: "#64748B",
        amber: "#F59E0B",
        error: "#EF4444",
        // legacy aliases preserved so any stragglers keep compiling
        ink: "#102033",
        cyan: "#05B6E8",
        teal: "#00C7A7",
        frost: "#102033"
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #0B6FF3 0%, #05B6E8 50%, #00C7A7 100%)"
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
