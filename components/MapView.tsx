"use client";

import { latLngToImagePoint } from "@/lib/mapCalibration";
import type { RankedListing } from "@/lib/types";
import { RentalPin } from "./RentalPin";

export function MapView({
  listings,
  selectedId,
  onSelect
}: {
  listings: RankedListing[];
  selectedId: string | null;
  onSelect: (listing: RankedListing) => void;
}) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-ink">
      <img
        src="/images/bergen-leie-map.png"
        alt="Futuristic Bergen map background for Leie"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/10 via-transparent to-ink/55" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(4,6,11,0.5))]" />

      {listings
        .filter((listing) => listing.latitude != null && listing.longitude != null)
        .map((listing) => {
          const point = latLngToImagePoint(listing.latitude as number, listing.longitude as number);
          return (
            <RentalPin
              key={listing.id}
              listing={listing}
              selected={selectedId === listing.id}
              onSelect={() => onSelect(listing)}
              style={{ left: `${point.xPercent}%`, top: `${point.yPercent}%` }}
            />
          );
        })}

      <div className="glass absolute bottom-24 left-4 max-w-[280px] rounded-lg p-3 text-xs text-frost/80 md:bottom-5">
        <div className="mb-2 font-semibold text-cyan">Market price signal</div>
        <div className="grid gap-1.5">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)]" />
            Under area market
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-yellow-300 shadow-[0_0_18px_rgba(250,204,21,0.7)]" />
            Around market
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-400 shadow-[0_0_18px_rgba(248,113,113,0.7)]" />
            Above market
          </div>
        </div>
      </div>
    </section>
  );
}
