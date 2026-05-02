"use client";

import { useMemo, useState } from "react";
import { applyListingQuery } from "@/lib/filtering";
import { rankListings } from "@/lib/ranking";
import { distanceKm, isNearBergen } from "@/lib/distance";
import { BERGEN_SENTRUM } from "@/lib/neighborhoods";
import type { ListingFilters, RankedListing } from "@/lib/types";
import { FiltersPanel } from "./FiltersPanel";
import { ListingCard } from "./ListingCard";
import { ListingSidebar } from "./ListingSidebar";
import { MapView } from "./MapView";
import { TopBar } from "./TopBar";

export function LeieApp({ initialListings }: { initialListings: RankedListing[] }) {
  const [filters, setFilters] = useState<ListingFilters>({
    propertyType: "all",
    source: "all",
    includeShortTerm: true,
    sort: "cheapest",
    lat: BERGEN_SENTRUM.latitude,
    lng: BERGEN_SENTRUM.longitude
  });
  const [selectedId, setSelectedId] = useState(initialListings[0]?.id ?? null);
  const [locationLabel, setLocationLabel] = useState("Using Bergen Sentrum as default");

  const listings = useMemo(() => {
    const queried = applyListingQuery(initialListings, filters);
    const ranked = rankListings(queried).map((listing) => {
      if (filters.lat == null || filters.lng == null || listing.latitude == null || listing.longitude == null) {
        return listing;
      }
      return {
        ...listing,
        distanceKm: distanceKm(
          { latitude: filters.lat, longitude: filters.lng },
          { latitude: listing.latitude, longitude: listing.longitude }
        )
      };
    });

    return filters.sort === "closest"
      ? [...ranked].sort((a, b) => (a.distanceKm ?? Number.POSITIVE_INFINITY) - (b.distanceKm ?? Number.POSITIVE_INFINITY))
      : ranked;
  }, [initialListings, filters]);

  const selected = listings.find((listing) => listing.id === selectedId) ?? listings[0] ?? null;

  function handleUseLocation() {
    if (!navigator.geolocation) {
      setLocationLabel("Using Bergen Sentrum as default");
      setFilters((current) => ({ ...current, sort: "closest", lat: BERGEN_SENTRUM.latitude, lng: BERGEN_SENTRUM.longitude }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (!isNearBergen(latitude, longitude)) {
          setLocationLabel("Using Bergen Sentrum as default");
          setFilters((current) => ({ ...current, sort: "closest", lat: BERGEN_SENTRUM.latitude, lng: BERGEN_SENTRUM.longitude }));
          return;
        }
        setLocationLabel("Using your location");
        setFilters((current) => ({ ...current, sort: "closest", lat: latitude, lng: longitude }));
      },
      () => {
        setLocationLabel("Using Bergen Sentrum as default");
        setFilters((current) => ({ ...current, sort: "closest", lat: BERGEN_SENTRUM.latitude, lng: BERGEN_SENTRUM.longitude }));
      },
      { enableHighAccuracy: false, maximumAge: 120000, timeout: 8000 }
    );
  }

  function handleSelect(listing: RankedListing) {
    setSelectedId(listing.id);
  }

  return (
    <main className="min-h-screen p-0 md:p-4">
      <div className="grid min-h-screen gap-3 md:grid-cols-[minmax(0,1fr)_430px]">
        <div className="relative grid min-h-0 gap-3">
          <TopBar locationLabel={locationLabel} onUseLocation={handleUseLocation} />
          <MapView listings={listings} selectedId={selected?.id ?? null} onSelect={handleSelect} />
        </div>

        <aside className="hidden min-h-0 grid-rows-[auto_1fr] gap-3 md:grid">
          <FiltersPanel filters={filters} onChange={setFilters} />
          <ListingSidebar listings={listings} selectedId={selected?.id ?? null} onSelect={handleSelect} />
        </aside>

        <section className="glass fixed inset-x-0 bottom-0 z-40 max-h-[48vh] overflow-y-auto rounded-t-lg p-3 md:hidden">
          <FiltersPanel filters={filters} onChange={setFilters} />
          <div className="mt-3">
            {selected ? (
              <ListingCard listing={selected} selected />
            ) : (
              <div className="rounded-lg border border-white/10 p-4 text-sm text-frost/65">No listing selected</div>
            )}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {listings.slice(0, 6).map((listing) => (
              <button
                key={listing.id}
                type="button"
                onClick={() => handleSelect(listing)}
                className="rounded-md border border-white/10 px-3 py-2 text-left text-xs text-frost/75"
              >
                {listing.area}<br />
                <span className="text-cyan">{listing.estimatedMonthlyNok?.toLocaleString("nb-NO") ?? "No price"} NOK</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
