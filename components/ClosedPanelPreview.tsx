"use client";

import type { RankedListing } from "@/lib/types";

const marketLabel: Record<NonNullable<RankedListing["marketSignal"]>, string> = {
  under_market: "below market",
  market_price: "around market",
  above_market: "above market",
  unknown: "market pending"
};

export function ClosedPanelPreview({
  selected,
  onOpen,
  variant
}: {
  selected: RankedListing;
  onOpen: () => void;
  variant: "mobile" | "desktop";
}) {
  const isMobile = variant === "mobile";
  const price = selected.estimatedMonthlyNok?.toLocaleString("nb-NO") ?? "No price";

  return (
    <button
      type="button"
      onClick={onOpen}
      className="surface flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition hover:border-brand-blue/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/30"
    >
      <span className="min-w-0">
        {isMobile && (
          <span className="mb-1 inline-flex rounded-full bg-brand-teal/12 px-2 py-0.5 text-[11px] font-semibold text-brand-teal">
            Quick pick
          </span>
        )}
        <span className="block truncate font-semibold text-navy">{selected.title}</span>
        <span className="text-xs text-muted">
          {selected.area} · {price} NOK
          {isMobile && selected.marketSignal && ` · ${marketLabel[selected.marketSignal]}`}
        </span>
      </span>
      <span className="shrink-0 rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-medium text-brand-blue">
        {isMobile ? "Open" : "Open panel"}
      </span>
    </button>
  );
}
