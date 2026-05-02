import { airbnbAdapter } from "./airbnb";
import { finnAdapter } from "./finn";
import { heimstadenAdapter } from "./heimstaden";
import { hybelAdapter } from "./hybel";
import { utleiemeglerenAdapter } from "./utleiemegleren";

export const sourceAdapters = [
  finnAdapter,
  airbnbAdapter,
  hybelAdapter,
  utleiemeglerenAdapter,
  heimstadenAdapter
];

export async function fetchAllAdapterListingsForBergen() {
  const results = await Promise.all(
    sourceAdapters.map(async (adapter) => ({
      adapter,
      listings: await adapter.fetchListingsForBergen()
    }))
  );

  return {
    listings: results.flatMap((result) => result.listings),
    statuses: results.map((result) => ({
      source: result.adapter.source,
      status: result.adapter.status,
      notes: result.adapter.notes,
      count: result.listings.length
    }))
  };
}
