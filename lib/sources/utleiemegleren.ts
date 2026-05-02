import { mockListingsForSource } from "./mockBySource";
import type { SourceAdapter } from "./types";

export const utleiemeglerenAdapter: SourceAdapter = {
  source: "utleiemegleren",
  status: "requires_permission",
  notes:
    "Utleiemegleren live data requires approved feed, partner/API access, or written permission. The adapter intentionally contains no website scraping logic.",
  fetchListingsForBergen: async () => mockListingsForSource("utleiemegleren")
};
