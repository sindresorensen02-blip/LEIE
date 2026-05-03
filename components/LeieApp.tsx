"use client";

import { useMemo, useState } from "react";
import { applyListingQuery } from "@/lib/filtering";
import { rankListings } from "@/lib/ranking";
import { distanceKm } from "@/lib/distance";
import { BERGEN_SENTRUM } from "@/lib/neighborhoods";
import type { ListingFilters, ListingSort, RankedListing } from "@/lib/types";
import { APP_VERSION } from "@/lib/version";
import { FiltersPanel } from "./FiltersPanel";
import { ListingCard } from "./ListingCard";
import { MapView } from "./MapView";
import { TopBar } from "./TopBar";

const sortLabels: Record<ListingSort, string> = {
  cheapest: "Cheapest",
  newest: "Newest",
  largest: "Largest",
  closest: "Closest"
};

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

  function handleSelect(listing: RankedListing) {
    setSelectedId(listing.id);
    setListingsOpen(true);
  }

  function handleSortChange(sort: ListingSort) {
    setFilters((current) => ({ ...current, sort }));
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-snow text-navy">
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
            <button
              type="button"
              onClick={() => setListingsOpen(true)}
              className="surface flex w-full items-center justify-between px-4 py-3 text-left text-sm transition hover:border-brand-blue/40 md:max-w-xl"
            >
              <span className="min-w-0">
                <span className="mb-1 inline-flex rounded-full bg-brand-teal/12 px-2 py-0.5 text-[11px] font-semibold text-brand-teal">
                  Quick pick
                </span>
                <span className="block truncate font-semibold text-navy">{selected.title}</span>
                <span className="text-xs text-muted">
                  {selected.area} · {selected.estimatedMonthlyNok?.toLocaleString("nb-NO") ?? "No price"} NOK ·{" "}
                  {selected.marketSignal === "under_market"
                    ? "below market"
                    : selected.marketSignal === "market_price"
                      ? "around market"
                      : selected.marketSignal === "above_market"
                        ? "above market"
                        : "market pending"}
                </span>
              </span>
              <span className="ml-2 shrink-0 rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-medium text-brand-blue">
                Open
              </span>
            </button>
          )}

          {listingsOpen && (
            <div className="surface max-h-[58vh] overflow-hidden">
              <div className="flex items-center justify-between gap-2 border-b border-ice px-3 py-2">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-navy">{listings.length} listings</div>
                  <div className="truncate text-[11px] text-muted">
                    Teal = below market · gray = fair · red = above market
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    aria-label="Sort listings"
                    className="field !py-1 !text-xs"
                    value={filters.sort ?? "cheapest"}
                    onChange={(event) => handleSortChange(event.target.value as ListingSort)}
                  >
                    {(Object.keys(sortLabels) as ListingSort[]).map((sort) => (
                      <option key={sort} value={sort}>
                        {sortLabels[sort]}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setListingsOpen(false)}
                    className="rounded-lg border border-ice px-2 py-1 text-xs text-muted transition hover:border-brand-blue/40 hover:text-brand-blue"
                  >
                    Hide
                  </button>
                </div>
              </div>
              <div className="grid max-h-[48vh] gap-3 overflow-y-auto p-3 sm:grid-cols-2">
                {selected && (
                  <div className="sm:col-span-2">
                    <ListingCard listing={selected} selected />
                  </div>
                )}
                {listings
                  .filter((listing) => listing.id !== selected?.id)
                  .slice(0, 14)
                  .map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      selected={selected?.id === listing.id}
                      onSelect={() => handleSelect(listing)}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <aside className="pointer-events-none fixed bottom-4 right-4 top-20 z-30 hidden w-[460px] md:block xl:w-[540px]">
        <div className="pointer-events-auto h-full">
          {!listingsOpen && selected && (
            <button
              type="button"
              onClick={() => setListingsOpen(true)}
              className="surface flex w-full items-center justify-between px-4 py-3 text-left text-sm transition hover:border-brand-blue/40"
            >
              <span className="min-w-0">
                <span className="block truncate font-semibold text-navy">{selected.title}</span>
                <span className="text-xs text-muted">
                  {selected.area} · {selected.estimatedMonthlyNok?.toLocaleString("nb-NO") ?? "No price"} NOK
                </span>
              </span>
              <span className="ml-2 shrink-0 rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-medium text-brand-blue">
                Open panel
              </span>
            </button>
          )}

          {listingsOpen && (
            <div className="surface flex h-full flex-col overflow-hidden">
              <div className="flex items-center justify-between gap-2 border-b border-ice px-3 py-2">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-navy">{listings.length} listings</div>
                  <div className="truncate text-[11px] text-muted">
                    Click pins or cards. Map stays interactive.
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    aria-label="Sort listings"
                    className="field !py-1 !text-xs"
                    value={filters.sort ?? "cheapest"}
                    onChange={(event) => handleSortChange(event.target.value as ListingSort)}
                  >
                    {(Object.keys(sortLabels) as ListingSort[]).map((sort) => (
                      <option key={sort} value={sort}>
                        {sortLabels[sort]}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setListingsOpen(false)}
                    className="rounded-lg border border-ice px-2 py-1 text-xs text-muted transition hover:border-brand-blue/40 hover:text-brand-blue"
                  >
                    Hide
                  </button>
                </div>
              </div>
              <div className="grid gap-3 overflow-y-auto p-3">
                {selected && <ListingCard listing={selected} selected />}
                {listings
                  .filter((listing) => listing.id !== selected?.id)
                  .map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      selected={selected?.id === listing.id}
                      onSelect={() => handleSelect(listing)}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </main>
  );
}
