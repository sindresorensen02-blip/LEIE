"use client";

import { SlidersHorizontal } from "lucide-react";
import {
  propertyTypeLabels,
  sourceLabels,
  type ListingFilters,
  type PropertyType,
  type RentalSource
} from "@/lib/types";

const propertyTypeOptions: Array<PropertyType | "all"> = [
  "all",
  "room",
  "shared_room",
  "studio",
  "apartment",
  "house"
];
const sourceOptions: Array<RentalSource | "all"> = [
  "all",
  "finn",
  "airbnb",
  "hybel",
  "utleiemegleren",
  "heimstaden"
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-muted">{label}</span>
      {children}
    </label>
  );
}

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
        <Field label="Max monthly">
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
        </Field>
        <Field label="Type">
          <select
            className="field"
            value={filters.propertyType ?? "all"}
            onChange={(event) => onChange({ ...filters, propertyType: event.target.value as PropertyType | "all" })}
          >
            {propertyTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type === "all" ? "All types" : propertyTypeLabels[type]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Source">
          <select
            className="field"
            value={filters.source ?? "all"}
            onChange={(event) => onChange({ ...filters, source: event.target.value as RentalSource | "all" })}
          >
            {sourceOptions.map((source) => (
              <option key={source} value={source}>
                {source === "all" ? "All sources" : sourceLabels[source]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Min size">
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
        </Field>
        <Field label="Min bedrooms">
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
        </Field>
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
