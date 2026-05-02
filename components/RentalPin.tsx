"use client";

import clsx from "clsx";
import { Home } from "lucide-react";
import type { RankedListing } from "@/lib/types";

const signalStyles = {
  under_market: {
    pin: "border-emerald-200/80 bg-emerald-400 text-ink shadow-[0_0_34px_rgba(52,211,153,0.82)] hover:bg-emerald-300",
    ring: "ring-emerald-300"
  },
  market_price: {
    pin: "border-yellow-200/80 bg-yellow-300 text-ink shadow-[0_0_32px_rgba(250,204,21,0.76)] hover:bg-yellow-200",
    ring: "ring-yellow-300"
  },
  above_market: {
    pin: "border-red-200/80 bg-red-400 text-white shadow-[0_0_32px_rgba(248,113,113,0.78)] hover:bg-red-300",
    ring: "ring-red-300"
  },
  unknown: {
    pin: "border-cyan/70 bg-cyan/25 text-cyan shadow-glow hover:bg-cyan/35",
    ring: "ring-cyan"
  }
};

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
  const signal = signalStyles[listing.marketSignal ?? "unknown"];
  return (
    <button
      aria-label={listing.title}
      className={clsx(
        "absolute grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border transition duration-200",
        "hover:scale-110",
        signal.pin,
        cheapest && "ring-2 ring-offset-2 ring-offset-ink",
        cheapest && signal.ring,
        selected && "z-20 scale-125 ring-4 ring-offset-4 ring-offset-ink"
      )}
      style={style}
      onClick={onSelect}
      type="button"
    >
      <Home size={16} strokeWidth={2.5} />
      <span className={clsx("absolute h-12 w-12 rounded-full border opacity-45", signal.ring)} />
    </button>
  );
}
