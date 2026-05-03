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
    <header className="surface-translucent flex items-center justify-between gap-3 px-3 py-2 md:px-4 md:py-2.5">
      <Logo />
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onToggleFilters}
          aria-expanded={filtersOpen}
          className="btn-secondary !px-2.5 !py-1.5 text-xs"
        >
          <SlidersHorizontal size={14} className="text-brand-blue" />
          <span className="hidden sm:inline">Filters</span>
          {filtersOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <button
          type="button"
          onClick={onToggleListings}
          aria-expanded={listingsOpen}
          className="btn-secondary !px-2.5 !py-1.5 text-xs"
        >
          <PanelBottom size={14} className="text-brand-blue" />
          <span className="font-semibold text-navy">{listingCount}</span>
          <span className="hidden sm:inline">listings</span>
          {listingsOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>
    </header>
  );
}
