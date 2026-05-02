import { dedupeListings } from "../lib/dedupe";
import { resolveListingLocation } from "../lib/geocoding";
import { upsertListings } from "../lib/db";
import { fetchAllAdapterListingsForBergen } from "../lib/sources";

async function main() {
  const result = await fetchAllAdapterListingsForBergen();
  const geocoded = await Promise.all(result.listings.map(resolveListingLocation));
  const deduped = dedupeListings(geocoded);
  const saved = upsertListings(deduped);

  console.log(
    JSON.stringify(
      {
        adapters: result.statuses,
        inserted: saved.inserted,
        updated: saved.updated,
        skipped: geocoded.length - deduped.length
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
