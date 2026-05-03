"use client";

import { useMemo, useState } from "react";
import { applyListingQuery } from "@/lib/filtering";
import { rankListings } from "@/lib/ranking";
import { distanceKm, isNearBergen } from "@/lib/distance";
import { BERGEN_SENTRUM } from "@/lib/neighborhoods";
import type { ListingFilters, RankedListing } from "@/lib/types";
import { APP_VERSION } from "@/lib/version";
import { FiltersPanel } from "./FiltersPanel";
import { ListingCard } from "./ListingCard";
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

  function handleUseLocation() {
    if (!navigator.geolocation) {
      setLocationLabel("Using Bergen Sentrum as default");
      setFilters((current) => ({
        ...current,
        sort: "closest",
        lat: BERGEN_SENTRUM.latitude,
        lng: BERGEN_SENTRUM.longitude
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (!isNearBergen(latitude, longitude)) {
          setLocationLabel("Using Bergen Sentrum as default");
          setFilters((current) => ({
            ...current,
            sort: "closest",
            lat: BERGEN_SENTRUM.latitude,
            lng: BERGEN_SENTRUM.longitude
          }));
          return;
        }
        setLocationLabel("Using your location");
        setFilters((current) => ({ ...current, sort: "closest", lat: latitude, lng: longitude }));
      },
      () => {
        setLocationLabel("Using Bergen Sentrum as default");
        setFilters((current) => ({
          ...current,
          sort: "closest",
          lat: BERGEN_SENTRUM.latitude,
          lng: BERGEN_SENTRUM.longitude
        }));
      },
      { enableHighAccuracy: false, maximumAge: 120000, timeout: 8000 }
    );
  }

  function handleSelect(listing: RankedListing) {
    setSelectedId(listing.id);
    setListingsOpen(true);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink">
      <MapView listings={listings} selectedId={selected?.id ?? null} onSelect={handleSelect} />

      <div className="pointer-events-none fixed right-3 top-3 z-50 md:right-5 md:top-4">
        <span className="rounded-full border border-white/15 bg-ink/70 px-2 py-0.5 font-mono text-[11px] text-frost/70 backdrop-blur">
          v{APP_VERSION}
        </span>
      </div>

      <div className="pointer-events-none absolute inset-x-3 top-3 z-40 md:inset-x-6 md:top-5">
        <div className="pointer-events-auto mx-auto max-w-6xl">
          <TopBar
            locationLabel={locationLabel}
            onUseLocation={handleUseLocation}
            filtersOpen={filtersOpen}
            listingsOpen={listingsOpen}
            listingCount={listings.length}
            onToggleFilters={() => setFiltersOpen((open) => !open)}
            onToggleListings={() => setListingsOpen((open) => !open)}
          />
          {filtersOpen && (
            <div className="mt-3 max-h-[52vh] overflow-y-auto rounded-lg">
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
              className="glass flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm text-frost transition hover:border-cyan/40 md:max-w-xl"
            >
              <span>
                <span className="mb-1 inline-flex rounded-full border border-emerald-300/30 bg-emerald-400/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-200">
                  Quick pick
                </span>
                <span className="block font-semibold text-cyan">{selected.title}</span>
                <span className="text-xs text-frost/65">
                  {selected.area} · {selected.estimatedMonthlyNok?.toLocaleString("nb-NO") ?? "No price"} NOK ·{" "}
                  {selected.marketSignal === "under_market"
                    ? "under market"
                    : selected.marketSignal === "market_price"
                      ? "around market"
                      : selected.marketSignal === "above_market"
                        ? "above market"
                        : "market pending"}
                </span>
              </span>
              <span className="rounded-full border border-cyan/30 px-3 py-1 text-xs text-cyan">Open</span>
            </button>
          )}

          {listingsOpen && (
            <div className="glass max-h-[46vh] overflow-hidden rounded-lg">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div>
                  <div className="text-sm font-semibold text-frost">Quick deal deck</div>
                  <div className="text-xs text-frost/55">
                    Green is below local market, yellow is fair, red is expensive.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setListingsOpen(false)}
                  className="rounded-md border border-white/10 px-3 py-2 text-xs text-frost/70 transition hover:border-cyan/40 hover:text-cyan"
                >
                  Hide
                </button>
              </div>
              <div className="grid max-h-[36vh] gap-3 overflow-y-auto p-3 md:grid-cols-2 xl:grid-cols-3">
                {selected && (
                  <div className="md:col-span-2 xl:col-span-1">
                    <ListingCard listing={selected} selected />
                  </div>
                )}
                {listings
                  .filter((listing) => listing.id !== selected?.id)
                  .slice(0, 11)
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

      <aside className="pointer-events-none fixed bottom-5 right-5 top-32 z-30 hidden w-[410px] md:block xl:w-[450px]">
        <div className="pointer-events-auto h-full">
          {!listingsOpen && selected && (
            <button
              type="button"
              onClick={() => setListingsOpen(true)}
              className="glass flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm text-frost transition hover:border-cyan/40"
            >
              <span>
                <span className="block font-semibold text-cyan">{selected.title}</span>
                <span className="text-xs text-frost/65">
                  {selected.area} · {selected.estimatedMonthlyNok?.toLocaleString("nb-NO") ?? "No price"} NOK
                </span>
              </span>
              <span className="rounded-full border border-cyan/30 px-3 py-1 text-xs text-cyan">Panel</span>
            </button>
          )}

          {listingsOpen && (
            <div className="glass flex h-full flex-col overflow-hidden rounded-lg">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div>
                  <div className="text-sm font-semibold text-frost">Quick deal deck</div>
                  <div className="text-xs text-frost/55">Click pins or cards. Map stays fully interactive.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setListingsOpen(false)}
                  className="rounded-md border border-white/10 px-3 py-2 text-xs text-frost/70 transition hover:border-cyan/40 hover:text-cyan"
                >
                  Hide
                </button>
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
