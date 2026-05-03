"use client";

import type { RankedListing } from "@/lib/types";
import { ListingCard } from "./ListingCard";

export function ListingSidebar({
  listings,
  selectedId,
  onSelect
}: {
  listings: RankedListing[];
  selectedId: string | null;
  onSelect: (listing: RankedListing) => void;
}) {
  return (
    <section className="surface flex min-h-0 flex-1 flex-col">
      <div className="border-b border-ice p-4">
        <div className="text-sm font-semibold text-navy">{listings.length} Bergen rentals</div>
        <div className="text-xs text-muted">Ranked by estimated monthly cost</div>
      </div>
      <div className="grid gap-3 overflow-y-auto p-3">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            selected={selectedId === listing.id}
            onSelect={() => onSelect(listing)}
          />
        ))}
      </div>
    </section>
  );
}
