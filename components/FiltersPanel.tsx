"use client";

import { SlidersHorizontal } from "lucide-react";
import type { ListingFilters, PropertyType, RentalSource } from "@/lib/types";

const propertyTypes: Array<PropertyType | "all"> = ["all", "room", "shared_room", "studio", "apartment", "house"];
const sources: Array<RentalSource | "all"> = ["all", "finn", "airbnb", "hybel", "utleiemegleren", "heimstaden"];

export function FiltersPanel({
  filters,
  onChange
}: {
  filters: ListingFilters;
  onChange: (filters: ListingFilters) => void;
}) {
  return (
    <section className="surface p-4">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-navy">
        <SlidersHorizontal size={16} className="text-brand-blue" />
        Filters
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs md:grid-cols-1 xl:grid-cols-2">
        <label>
          <span className="mb-1 block text-muted">Max monthly</span>
          <input
            className="field"
            type="number"
            min={0}
            placeholder="Any"
            value={filters.maxPrice ?? ""}
            onChange={(event) =>
              onChange({ ...filters, maxPrice: event.target.value ? Number(event.target.value) : null })
            }
          />
        </label>
        <label>
          <span className="mb-1 block text-muted">Type</span>
          <select
            className="field"
            value={filters.propertyType ?? "all"}
            onChange={(event) => onChange({ ...filters, propertyType: event.target.value as PropertyType | "all" })}
          >
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type.replace("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="mb-1 block text-muted">Source</span>
          <select
            className="field"
            value={filters.source ?? "all"}
            onChange={(event) => onChange({ ...filters, source: event.target.value as RentalSource | "all" })}
          >
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="mb-1 block text-muted">Min size</span>
          <input
            className="field"
            type="number"
            min={0}
            placeholder="m²"
            value={filters.minSize ?? ""}
            onChange={(event) =>
              onChange({ ...filters, minSize: event.target.value ? Number(event.target.value) : null })
            }
          />
        </label>
        <label>
          <span className="mb-1 block text-muted">Min bedrooms</span>
          <input
            className="field"
            type="number"
            min={0}
            placeholder="0"
            value={filters.minBedrooms ?? ""}
            onChange={(event) =>
              onChange({ ...filters, minBedrooms: event.target.value ? Number(event.target.value) : null })
            }
          />
        </label>
      </div>

      <div className="mt-4 grid gap-2 text-xs text-navy/85">
        <label className="flex items-center justify-between gap-3 rounded-lg border border-ice bg-white px-3 py-2">
          Available now
          <input
            type="checkbox"
            className="accent-brand-blue"
            checked={Boolean(filters.onlyAvailableNow)}
            onChange={(event) => onChange({ ...filters, onlyAvailableNow: event.target.checked })}
          />
        </label>
        <label className="flex items-center justify-between gap-3 rounded-lg border border-ice bg-white px-3 py-2">
          Include short-term
          <input
            type="checkbox"
            className="accent-brand-blue"
            checked={filters.includeShortTerm !== false}
            onChange={(event) => onChange({ ...filters, includeShortTerm: event.target.checked })}
          />
        </label>
      </div>
    </section>
  );
}
