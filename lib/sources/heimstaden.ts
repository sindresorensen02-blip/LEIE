import { mockListingsForSource } from "./mockBySource";
import type { SourceAdapter } from "./types";

export const heimstadenAdapter: SourceAdapter = {
  source: "heimstaden",
  status: "requires_permission",
  notes:
    "Heimstaden live data is stubbed. Enable only with official API/feed access, partner access, or written permission; mock Bergen inventory is used for the MVP.",
  fetchListingsForBergen: async () => mockListingsForSource("heimstaden")
};
