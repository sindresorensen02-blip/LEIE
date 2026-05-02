import type { NormalizedListing, RentalSource } from "../types";

export type SourceAdapterStatus = "mock" | "requires_permission";

export type SourceAdapter = {
  source: RentalSource;
  status: SourceAdapterStatus;
  notes: string;
  fetchListingsForBergen: () => Promise<NormalizedListing[]>;
};
