"use client";

import clsx from "clsx";
import { Home } from "lucide-react";
import type { RankedListing } from "@/lib/types";

export function RentalPin({
  listing,
  selected,
  onSelect,
  style
}: {
  listing: RankedListing;
  selected: boolean;
  onSelect: () => void;
  style: React.CSSProperties;
}) {
  const cheapest = listing.badges.includes("Cheapest");
  return (
    <button
      aria-label={listing.title}
      className={clsx(
        "absolute grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border transition duration-200",
        "bg-cyan/20 text-cyan shadow-glow hover:scale-110 hover:bg-cyan/30",
        cheapest && "ring-2 ring-cyan ring-offset-2 ring-offset-ink",
        selected && "z-20 scale-125 bg-cyan text-ink shadow-glow-strong"
      )}
      style={style}
      onClick={onSelect}
      type="button"
    >
      <Home size={16} strokeWidth={2.5} />
    </button>
  );
}
