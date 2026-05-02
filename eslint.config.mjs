import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [".expo/**", ".next/**", "node_modules/**", "leie.db", "next-env.d.ts", "package-lock.json"]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,ts,tsx,mjs}"],
    languageOptions: {
      globals: {
        React: "readonly",
        console: "readonly",
        process: "readonly",
        module: "readonly",
        Request: "readonly",
        URL: "readonly",
        navigator: "readonly",
        HTMLInputElement: "readonly"
      }
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn"
    }
  }
];
