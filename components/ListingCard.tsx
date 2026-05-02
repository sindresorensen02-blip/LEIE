"use client";

import clsx from "clsx";
import { ArrowUpRight, BedDouble, CalendarDays, House, Maximize2 } from "lucide-react";
import { formatNok } from "@/lib/price";
import { propertyTypeLabels, sourceLabels, type RankedListing } from "@/lib/types";

export function ListingCard({
  listing,
  selected,
  onSelect
}: {
  listing: RankedListing;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <article
      className={clsx(
        "rounded-lg border p-4 transition",
        selected
          ? "border-cyan/70 bg-cyan/10 shadow-glow"
          : "border-white/10 bg-white/[0.045] hover:border-cyan/40 hover:bg-white/[0.07]"
      )}
      onClick={onSelect}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold leading-snug text-frost">{listing.title}</h3>
          <p className="mt-1 text-xs text-frost/60">{listing.area} · {sourceLabels[listing.source]}</p>
        </div>
        <a
          href={listing.listingUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-cyan/25 p-2 text-cyan hover:bg-cyan/10"
          aria-label="Open original listing"
          onClick={(event) => event.stopPropagation()}
        >
          <ArrowUpRight size={15} />
        </a>
      </div>

      <div className="mb-3">
        <div className="text-xl font-semibold text-cyan">{formatNok(listing.estimatedMonthlyNok)}</div>
        <div className="text-xs text-frost/55">
          {listing.priceNightlyNok
            ? `${formatNok(listing.priceNightlyNok)} nightly · estimated monthly`
            : `${formatNok(listing.priceMonthlyNok)} monthly`}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-frost/72">
        <span className="flex items-center gap-2"><House size={14} />{propertyTypeLabels[listing.propertyType]}</span>
        <span className="flex items-center gap-2"><Maximize2 size={14} />{listing.sizeM2 ?? "?"} m²</span>
        <span className="flex items-center gap-2"><BedDouble size={14} />{listing.bedrooms ?? 0} bedrooms</span>
        <span className="flex items-center gap-2"><CalendarDays size={14} />{listing.availableFrom ?? "Ask"}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {listing.badges.map((badge) => (
          <span key={badge} className="rounded-full border border-cyan/25 px-2 py-1 text-[11px] text-cyan">
            {badge}
          </span>
        ))}
        {listing.distanceKm != null && (
          <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] text-frost/65">
            {listing.distanceKm.toFixed(1)} km
          </span>
        )}
      </div>
    </article>
  );
}
