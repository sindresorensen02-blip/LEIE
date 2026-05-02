import { mockListingsForSource } from "./mockBySource";
import type { SourceAdapter } from "./types";

export const finnAdapter: SourceAdapter = {
  source: "finn",
  status: "requires_permission",
  notes:
    "FINN.no live listing collection is disabled. Approved API access, a public feed, partner access, or written permission is required before enabling live data.",
  fetchListingsForBergen: async () => mockListingsForSource("finn")
};
