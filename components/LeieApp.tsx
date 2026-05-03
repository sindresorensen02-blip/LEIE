"use client";

import { useMemo, useState } from "react";
import { applyListingQuery } from "@/lib/filtering";
import { rankListings } from "@/lib/ranking";
import { distanceKm } from "@/lib/distance";
import { BERGEN_SENTRUM } from "@/lib/neighborhoods";
import type { ListingFilters, ListingSort, RankedListing } from "@/lib/types";
import { APP_VERSION } from "@/lib/version";
import { ClosedPanelPreview } from "./ClosedPanelPreview";
import { FiltersPanel } from "./FiltersPanel";
import { ListingsPanel } from "./ListingsPanel";
import { MapView } from "./MapView";
import { TopBar } from "./TopBar";

const defaultFilters: ListingFilters = {
  propertyType: "all",
  source: "all",
  includeShortTerm: true,
  sort: "cheapest",
  lat: BERGEN_SENTRUM.latitude,
  lng: BERGEN_SENTRUM.longitude
};

export function LeieApp({ initialListings }: { initialListings: RankedListing[] }) {
  const [filters, setFilters] = useState<ListingFilters>(defaultFilters);
  const [selectedId, setSelectedId] = useState(initialListings[0]?.id ?? null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [listingsOpen, setListingsOpen] = useState(true);

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
      ? [...ranked].sort(
          (a, b) => (a.distanceKm ?? Number.POSITIVE_INFINITY) - (b.distanceKm ?? Number.POSITIVE_INFINITY)
        )
      : ranked;
  }, [initialListings, filters]);

  const selected = listings.find((listing) => listing.id === selectedId) ?? listings[0] ?? null;
  const sort = filters.sort ?? "cheapest";

  function handleSelect(listing: RankedListing) {
    setSelectedId(listing.id);
    setListingsOpen(true);
  }

  function handleSortChange(nextSort: ListingSort) {
    setFilters((current) => ({ ...current, sort: nextSort }));
  }

  function handleResetFilters() {
    setFilters(defaultFilters);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-snow text-navy">
      <h1 className="sr-only">Bergen rental discovery</h1>
      <MapView listings={listings} selectedId={selected?.id ?? null} onSelect={handleSelect} />

      <div className="pointer-events-none fixed right-3 top-3 z-50 md:right-5 md:top-4">
        <span className="rounded-full border border-ice bg-white/80 px-2 py-0.5 font-mono text-[11px] text-muted shadow-card backdrop-blur">
          v{APP_VERSION}
        </span>
      </div>

      <div className="pointer-events-none absolute inset-x-3 top-3 z-40 md:inset-x-4 md:top-4">
        <div className="pointer-events-auto mx-auto max-w-3xl pr-16 md:pr-20">
          <TopBar
            filtersOpen={filtersOpen}
            listingsOpen={listingsOpen}
            listingCount={listings.length}
            onToggleFilters={() => setFiltersOpen((open) => !open)}
            onToggleListings={() => setListingsOpen((open) => !open)}
          />
          {filtersOpen && (
            <div className="mt-2 max-h-[52vh] overflow-y-auto">
              <FiltersPanel filters={filters} onChange={setFilters} />
            </div>
          )}
        </div>
      </div>

      <section className="pointer-events-none fixed inset-x-3 bottom-3 z-40 md:hidden">
        <div className="pointer-events-auto mx-auto max-w-6xl">
          {!listingsOpen && selected && (
            <ClosedPanelPreview
              selected={selected}
              onOpen={() => setListingsOpen(true)}
              variant="mobile"
            />
          )}
          {listingsOpen && (
            <ListingsPanel
              listings={listings}
              selected={selected}
              sort={sort}
              onSortChange={handleSortChange}
              onSelect={handleSelect}
              onClose={() => setListingsOpen(false)}
              onResetFilters={handleResetFilters}
              variant="mobile"
            />
          )}
        </div>
      </section>

      <aside className="pointer-events-none fixed bottom-4 right-4 top-20 z-30 hidden w-[460px] md:block xl:w-[540px]">
        <div className="pointer-events-auto h-full">
          {!listingsOpen && selected && (
            <ClosedPanelPreview
              selected={selected}
              onOpen={() => setListingsOpen(true)}
              variant="desktop"
            />
          )}
          {listingsOpen && (
            <ListingsPanel
              listings={listings}
              selected={selected}
              sort={sort}
              onSortChange={handleSortChange}
              onSelect={handleSelect}
              onClose={() => setListingsOpen(false)}
              onResetFilters={handleResetFilters}
              variant="desktop"
            />
          )}
        </div>
      </aside>
    </main>
  );
}
