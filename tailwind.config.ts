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
        // Legacy aliases (kept so any unrelated screens keep rendering)
        ink: "#04060B",
        night: "#08111F",
        cyan: "#05B6E8",
        teal: "#00C7A7",
        frost: "#E8F1FF",
        // Mobile design palette
        leie: {
          blue: "#0B6FF3",
          cyan: "#05B6E8",
          teal: "#00C7A7",
          navy: "#102033",
          snow: "#F7FAFC",
          ice: "#DDE7EF",
          muted: "#64748B",
          mutedStrong: "#475569",
          error: "#EF4444"
        }
      },
      fontFamily: {
        sans: ["DM Sans", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 30px rgba(91, 227, 242, 0.38)",
        "glow-strong": "0 0 46px rgba(91, 227, 242, 0.72)",
        sheet: "0 -4px 30px rgba(16, 32, 51, 0.13)"
      }
    }
  },
  plugins: []
};

export default config;
