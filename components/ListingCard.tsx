"use client";

import clsx from "clsx";
import { ArrowUpRight, BedDouble, CalendarDays, House, Maximize2, TrendingDown, Zap } from "lucide-react";
import { formatNok } from "@/lib/price";
import { formatKwhPrice, getNeighborhoodElectricityPrice } from "@/lib/electricity";
import { propertyTypeLabels, sourceLabels, type RankedListing } from "@/lib/types";

const marketCopy = {
  under_market: {
    label: "Below market",
    className: "border-brand-teal/25 bg-brand-teal/10 text-brand-teal"
  },
  market_price: {
    label: "Around market",
    className: "border-ice bg-snow text-muted"
  },
  above_market: {
    label: "Above market",
    className: "border-error/30 bg-error/10 text-error"
  },
  unknown: {
    label: "Market pending",
    className: "border-ice bg-snow text-muted"
  }
};

const accuracyCopy = {
  exact: "Exact coordinates",
  address_geocoded: "Address geocoded",
  approximate_area: "Approximate area"
};

export function ListingCard({
  listing,
  selected,
  onSelect
}: {
  listing: RankedListing;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const signal = marketCopy[listing.marketSignal ?? "unknown"];
  const marketDelta =
    listing.marketDeltaPercent == null
      ? null
      : `${listing.marketDeltaPercent > 0 ? "+" : ""}${Math.round(listing.marketDeltaPercent)}%`;
  const electricityPrice = getNeighborhoodElectricityPrice(listing.area);
  const isCheapest = listing.badges.includes("Cheapest");
  const isGoodValue = listing.badges.includes("Good value");

  return (
    <article
      className={clsx(
        "rounded-2xl border bg-white p-4 transition",
        selected
          ? "border-brand-blue/60 shadow-card-hover ring-1 ring-brand-blue/20"
          : "border-ice shadow-card hover:border-ice-strong hover:shadow-card-hover focus-within:border-brand-blue/50"
      )}
      onClick={onSelect}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold leading-snug text-navy">{listing.title}</h3>
          <p className="mt-0.5 text-xs text-muted">
            {listing.area} · {sourceLabels[listing.source]}
          </p>
        </div>
        <a
          href={listing.listingUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-ice p-2 text-brand-blue transition hover:border-brand-blue/40 hover:bg-brand-blue/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/30"
          aria-label="Open original listing"
          onClick={(event) => event.stopPropagation()}
        >
          <ArrowUpRight size={15} />
        </a>
      </div>

      <div className="mb-3">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-2xl font-semibold tracking-tight text-navy">
            {formatNok(listing.estimatedMonthlyNok)}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full border border-amber/30 bg-amber/10 px-2 py-0.5 text-[11px] font-medium text-amber"
            title="Average Bergen (NO5 zone) electricity price"
          >
            <Zap size={11} />
            {formatKwhPrice(electricityPrice)}
          </span>
        </div>
        <div className="mt-0.5 text-xs text-muted">
          {listing.priceNightlyNok
            ? `${formatNok(listing.priceNightlyNok)} nightly · estimated monthly`
            : `${formatNok(listing.priceMonthlyNok)} monthly`}
        </div>
      </div>

      <div className={clsx("mb-3 rounded-xl border px-3 py-2 text-xs", signal.className)}>
        <div className="flex items-center gap-1.5 font-semibold">
          {listing.marketSignal === "under_market" && <TrendingDown size={12} aria-hidden />}
          {signal.label}
        </div>
        <div className="mt-0.5 opacity-90">
          {listing.marketPriceNok != null
            ? `${marketDelta} vs ${listing.area} median (${formatNok(listing.marketPriceNok)})`
            : "Area market estimate pending"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-1.5 text-xs text-navy/85">
        <span className="flex items-center gap-2">
          <House size={14} className="text-muted" />
          {propertyTypeLabels[listing.propertyType]}
        </span>
        <span className="flex items-center gap-2">
          <Maximize2 size={14} className="text-muted" />
          {listing.sizeM2 ?? "?"} m²
        </span>
        <span className="flex items-center gap-2">
          <BedDouble size={14} className="text-muted" />
          {listing.bedrooms ?? 0} bedrooms
        </span>
        <span className="flex items-center gap-2">
          <CalendarDays size={14} className="text-muted" />
          {listing.availableFrom ?? "Ask"}
        </span>
      </div>

      <div className="mt-3 rounded-lg border border-ice bg-snow px-3 py-1.5 text-[11px] text-muted">
        {accuracyCopy[listing.locationAccuracy]}
        {listing.locationAccuracy === "approximate_area" && " · pin uses neighborhood centroid"}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {isCheapest && (
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-teal/12 px-2 py-1 text-[11px] font-semibold text-brand-teal">
            Cheapest
          </span>
        )}
        {isGoodValue && !isCheapest && (
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-teal/12 px-2 py-1 text-[11px] font-semibold text-brand-teal">
            Good value
          </span>
        )}
        {listing.badges
          .filter((badge) => badge !== "Cheapest" && badge !== "Good value")
          .map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-ice px-2 py-1 text-[11px] text-navy/70"
            >
              {badge}
            </span>
          ))}
        {listing.distanceKm != null && (
          <span className="rounded-full border border-ice px-2 py-1 text-[11px] text-muted">
            {listing.distanceKm.toFixed(1)} km
          </span>
        )}
      </div>
    </article>
  );
}
