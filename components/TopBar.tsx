"use client";

import { LocateFixed, Search } from "lucide-react";

export function TopBar({
  locationLabel,
  onUseLocation
}: {
  locationLabel: string;
  onUseLocation: () => void;
}) {
  return (
    <header className="glass z-30 mx-3 mt-3 rounded-lg px-4 py-3 md:mx-0 md:mt-0">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-cyan/80">Leie Bergen MVP</div>
          <h1 className="text-2xl font-semibold text-frost md:text-3xl">Cheapest rentals near you</h1>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-frost/70">
            <Search size={15} className="text-cyan" />
            {locationLabel}
          </div>
          <button
            type="button"
            onClick={onUseLocation}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan/35 bg-cyan/10 px-3 py-2 text-sm font-medium text-cyan transition hover:bg-cyan/20"
          >
            <LocateFixed size={16} />
            Cheapest near me
          </button>
        </div>
      </div>
    </header>
  );
}
