"use client";

import clsx from "clsx";
import { EmptyState } from "./EmptyState";
import { ListingCard } from "./ListingCard";
import type { ListingSort, RankedListing } from "@/lib/types";

const sortLabels: Record<ListingSort, string> = {
  cheapest: "Cheapest",
  newest: "Newest",
  largest: "Largest",
  closest: "Closest"
};

const variantStyles = {
  mobile: {
    container: "surface max-h-[58vh] overflow-hidden",
    list: "grid max-h-[48vh] gap-3 overflow-y-auto p-3 sm:grid-cols-2",
    selectedSpan: "sm:col-span-2",
    tagline: "Teal = below market · gray = fair · red = above market",
    sliceTo: 14
  },
  desktop: {
    container: "surface flex h-full flex-col overflow-hidden",
    list: "grid gap-3 overflow-y-auto p-3",
    selectedSpan: "",
    tagline: "Click pins or cards. Map stays interactive.",
    sliceTo: undefined
  }
} as const;

export function ListingsPanel({
  listings,
  selected,
  sort,
  onSortChange,
  onSelect,
  onClose,
  onResetFilters,
  variant
}: {
  listings: RankedListing[];
  selected: RankedListing | null;
  sort: ListingSort;
  onSortChange: (sort: ListingSort) => void;
  onSelect: (listing: RankedListing) => void;
  onClose: () => void;
  onResetFilters: () => void;
  variant: "mobile" | "desktop";
}) {
  const styles = variantStyles[variant];
  const others = listings.filter((listing) => listing.id !== selected?.id);
  const visibleOthers = styles.sliceTo ? others.slice(0, styles.sliceTo) : others;
  const isEmpty = listings.length === 0;

  return (
    <div className={styles.container}>
      <div className="flex items-center justify-between gap-2 border-b border-ice px-3 py-2">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-navy">{listings.length} listings</div>
          <div className="truncate text-[11px] text-muted">{styles.tagline}</div>
        </div>
        <div className="flex items-center gap-2">
          <select
            aria-label="Sort listings"
            className="field !py-1 !text-xs"
            value={sort}
            onChange={(event) => onSortChange(event.target.value as ListingSort)}
          >
            {(Object.keys(sortLabels) as ListingSort[]).map((value) => (
              <option key={value} value={value}>
                {sortLabels[value]}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-ice px-2 py-1 text-xs text-muted transition hover:border-brand-blue/40 hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/30"
          >
            Hide
          </button>
        </div>
      </div>

      {isEmpty ? (
        <EmptyState onReset={onResetFilters} />
      ) : (
        <div className={styles.list}>
          {selected && (
            <div className={clsx(styles.selectedSpan)}>
              <ListingCard listing={selected} selected />
            </div>
          )}
          {visibleOthers.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              selected={selected?.id === listing.id}
              onSelect={() => onSelect(listing)}
            />
          ))}
          {styles.sliceTo && others.length > styles.sliceTo && (
            <p className="text-center text-[11px] text-muted sm:col-span-2">
              Showing {styles.sliceTo} of {others.length} other matches. Filter to narrow further.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
