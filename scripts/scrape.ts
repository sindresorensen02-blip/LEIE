import { dedupeListings } from "../lib/dedupe";
import { geocodeBergenLocation } from "../lib/geocoding";
import { upsertListings } from "../lib/db";
import { fetchAllAdapterListingsForBergen } from "../lib/sources";

async function main() {
  const result = await fetchAllAdapterListingsForBergen();
  const geocoded = await Promise.all(
    result.listings.map(async (listing) => {
      if (listing.latitude != null && listing.longitude != null) return listing;
      const geocode = await geocodeBergenLocation({ address: listing.address, area: listing.area });
      return geocode ? { ...listing, latitude: geocode.latitude, longitude: geocode.longitude } : listing;
    })
  );
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
