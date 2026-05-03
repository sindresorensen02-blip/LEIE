"use client";

import { ChevronDown, ChevronUp, PanelBottom, SlidersHorizontal } from "lucide-react";
import { Logo } from "./Logo";

export function TopBar({
  filtersOpen,
  listingsOpen,
  listingCount,
  onToggleFilters,
  onToggleListings
}: {
  filtersOpen: boolean;
  listingsOpen: boolean;
  listingCount: number;
  onToggleFilters: () => void;
  onToggleListings: () => void;
}) {
  return (
    <header className="glass z-30 flex items-center justify-between gap-3 rounded-lg px-3 py-2">
      <Logo className="h-8 w-auto md:h-9" />
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onToggleFilters}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 bg-white/10 px-2.5 py-1.5 text-xs font-medium text-frost transition hover:border-cyan/40 hover:bg-cyan/10"
        >
          <SlidersHorizontal size={14} className="text-cyan" />
          Filters
          {filtersOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <button
          type="button"
          onClick={onToggleListings}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 bg-white/10 px-2.5 py-1.5 text-xs font-medium text-frost transition hover:border-cyan/40 hover:bg-cyan/10"
        >
          <PanelBottom size={14} className="text-cyan" />
          {listingCount} listings
          {listingsOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>
    </header>
  );
}
