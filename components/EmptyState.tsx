"use client";

import { SearchX } from "lucide-react";

export function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="grid place-items-center px-6 py-10 text-center">
      <div className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-snow text-muted">
        <SearchX size={18} aria-hidden />
      </div>
      <p className="text-sm font-semibold text-navy">No listings match your filters</p>
      <p className="mt-1 max-w-xs text-xs text-muted">
        Try widening the price range, removing the source restriction, or including short-term stays.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="btn-secondary mt-4 !px-3 !py-1.5 text-xs"
      >
        Reset filters
      </button>
    </div>
  );
}
