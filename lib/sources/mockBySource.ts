import { mockListings } from "../mockListings";
import type { RentalSource } from "../types";

export function mockListingsForSource(source: RentalSource) {
  return mockListings.filter((listing) => listing.source === source);
}
