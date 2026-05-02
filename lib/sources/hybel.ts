import { mockListingsForSource } from "./mockBySource";
import type { SourceAdapter } from "./types";

export const hybelAdapter: SourceAdapter = {
  source: "hybel",
  status: "requires_permission",
  notes:
    "Hybel.no live collection is disabled until official API/feed access or written permission is available. Mock Bergen listings are returned by default.",
  fetchListingsForBergen: async () => mockListingsForSource("hybel")
};
