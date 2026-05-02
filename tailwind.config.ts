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
        ink: "#04060B",
        night: "#08111F",
        cyan: "#5BE3F2",
        teal: "#2BC4D9",
        frost: "#E8F1FF"
      },
      boxShadow: {
        glow: "0 0 30px rgba(91, 227, 242, 0.38)",
        "glow-strong": "0 0 46px rgba(91, 227, 242, 0.72)"
      }
    }
  },
  plugins: []
};

export default config;
