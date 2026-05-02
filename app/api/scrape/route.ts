import { NextResponse } from "next/server";
import { dedupeListings } from "@/lib/dedupe";
import { geocodeBergenLocation } from "@/lib/geocoding";
import { upsertListings } from "@/lib/db";
import { fetchAllAdapterListingsForBergen } from "@/lib/sources";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Mock import is development-only." }, { status: 403 });
  }

  const adapterResult = await fetchAllAdapterListingsForBergen();
  const geocoded = await Promise.all(
    adapterResult.listings.map(async (listing) => {
      if (listing.latitude != null && listing.longitude != null) return listing;
      const geocode = await geocodeBergenLocation({ address: listing.address, area: listing.area });
      return geocode ? { ...listing, latitude: geocode.latitude, longitude: geocode.longitude } : listing;
    })
  );
  const deduped = dedupeListings(geocoded);
  const { inserted, updated } = upsertListings(deduped);

  return NextResponse.json({
    sourceCounts: Object.fromEntries(
      adapterResult.statuses.map((status) => [status.source, status.count])
    ),
    inserted,
    updated,
    skipped: geocoded.length - deduped.length,
    adapters: adapterResult.statuses
  });
}
