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
    <section className="glass flex min-h-0 flex-1 flex-col rounded-lg">
      <div className="border-b border-white/10 p-4">
        <div className="text-sm font-semibold text-frost">{listings.length} Bergen rentals</div>
        <div className="text-xs text-frost/55">Ranked by estimated monthly cost</div>
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
