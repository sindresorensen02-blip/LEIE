"use client";

import { ChevronDown, ChevronUp, LocateFixed, PanelBottom, Search, SlidersHorizontal } from "lucide-react";

export function TopBar({
  locationLabel,
  onUseLocation,
  filtersOpen,
  listingsOpen,
  listingCount,
  onToggleFilters,
  onToggleListings
}: {
  locationLabel: string;
  onUseLocation: () => void;
  filtersOpen: boolean;
  listingsOpen: boolean;
  listingCount: number;
  onToggleFilters: () => void;
  onToggleListings: () => void;
}) {
  return (
    <header className="glass z-30 rounded-lg px-4 py-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/images/bergen-leie-map.png"
            alt=""
            className="h-14 w-10 rounded-md border border-cyan/25 object-cover shadow-glow"
          />
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-cyan/80">Leie for iOS</div>
            <h1 className="text-2xl font-semibold text-frost md:text-3xl">Leie</h1>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-frost/70">
            <Search size={15} className="text-cyan" />
            {locationLabel}
          </div>
          <button
            type="button"
            onClick={onUseLocation}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan/35 bg-cyan/10 px-3 py-2 text-sm font-medium text-cyan transition hover:bg-cyan/20"
          >
            <LocateFixed size={16} />
            Cheapest near me
          </button>
          <button
            type="button"
            onClick={onToggleFilters}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-frost transition hover:border-cyan/40 hover:bg-cyan/10"
          >
            <SlidersHorizontal size={16} className="text-cyan" />
            Filters
            {filtersOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button
            type="button"
            onClick={onToggleListings}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-frost transition hover:border-cyan/40 hover:bg-cyan/10"
          >
            <PanelBottom size={16} className="text-cyan" />
            {listingCount} listings
            {listingsOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}
