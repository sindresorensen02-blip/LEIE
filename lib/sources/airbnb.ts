import { mockListingsForSource } from "./mockBySource";
import type { SourceAdapter } from "./types";

export const airbnbAdapter: SourceAdapter = {
  source: "airbnb",
  status: "requires_permission",
  notes:
    "Airbnb live collection is disabled. Use only an approved API, public feed, partner export, or written permission; no scraping, login-wall access, or anti-bot bypassing is implemented.",
  fetchListingsForBergen: async () => mockListingsForSource("airbnb")
};
