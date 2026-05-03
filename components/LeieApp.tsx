"use client";

import { useMemo, useState } from "react";
import { applyListingQuery } from "@/lib/filtering";
import { calculateTotalMonthlyCost, type TotalMonthlyCost } from "@/lib/totalCost";
import type { ListingFilters, ListingSort, RankedListing } from "@/lib/types";
import { BottomSheet, type SheetSort } from "./mobile/BottomSheet";
import { DEFAULT_FILTERS, FiltersDrawer } from "./mobile/FiltersDrawer";
import { MobileTopBar } from "./mobile/MobileTopBar";
import { MapView } from "./MapView";

const ACCENT = "#0B6FF3";
const TEAL = "#00C7A7";
const ERROR_COLOR = "#EF4444";

function sheetSortToListingSort(sort: SheetSort): ListingSort {
  if (sort === "largest") return "largest";
  return "cheapest";
}

export function LeieApp({ initialListings }: { initialListings: RankedListing[] }) {
  const [filters, setFilters] = useState<ListingFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SheetSort>("cheapest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(initialListings[0]?.id ?? null);

  const totalCosts = useMemo(() => {
    const map = new Map<string, TotalMonthlyCost>();
    for (const listing of initialListings) {
      map.set(listing.id, calculateTotalMonthlyCost(listing, { includeInternet: true }));
    }
    return map;
  }, [initialListings]);

  const cheapestTotalId = useMemo(() => {
    let cheapest: { id: string; total: number } | null = null;
    for (const [id, tc] of totalCosts) {
      if (cheapest == null || tc.totalNok < cheapest.total) {
        cheapest = { id, total: tc.totalNok };
      }
    }
    return cheapest?.id ?? null;
  }, [totalCosts]);

  const filtered = useMemo<RankedListing[]>(() => {
    const queried = applyListingQuery(initialListings, {
      ...filters,
      sort: sheetSortToListingSort(sort)
    });
    const byId = new Map(initialListings.map((l) => [l.id, l]));
    const base = queried
      .map((listing) => byId.get(listing.id))
      .filter((l): l is RankedListing => l != null);
    if (sort === "total") {
      return [...base].sort((a, b) => {
        const ta = totalCosts.get(a.id)?.totalNok ?? Number.POSITIVE_INFINITY;
        const tb = totalCosts.get(b.id)?.totalNok ?? Number.POSITIVE_INFINITY;
        return ta - tb;
      });
    }
    return base;
  }, [initialListings, filters, sort, totalCosts]);

  const selected = useMemo(
    () => filtered.find((l) => l.id === selectedId) ?? filtered[0] ?? null,
    [filtered, selectedId]
  );

  const filtersActive =
    (filters.propertyType ?? "all") !== "all" ||
    (filters.source ?? "all") !== "all" ||
    filters.maxPrice != null ||
    filters.includeShortTerm === false;

  return (
    <main
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        background: "#F7FAFC",
        fontFamily: '"DM Sans", ui-sans-serif, system-ui, sans-serif'
      }}
    >
      <MapView
        listings={filtered}
        selectedId={selected?.id ?? null}
        cheapestTotalId={cheapestTotalId}
        onSelect={(l) => setSelectedId(l.id)}
      />

      <MobileTopBar
        count={filtered.length}
        total={initialListings.length}
        onFilter={() => setFiltersOpen(true)}
        filtersActive={filtersActive}
        filters={filters}
        onFilterChange={setFilters}
        accent={ACCENT}
        teal={TEAL}
      />

      <BottomSheet
        listings={filtered}
        totalCosts={totalCosts}
        cheapestTotalId={cheapestTotalId}
        selected={selected}
        onSelect={(l) => setSelectedId(l.id)}
        onReset={() => setFilters(DEFAULT_FILTERS)}
        sort={sort}
        onSortChange={setSort}
        accent={ACCENT}
        teal={TEAL}
        error={ERROR_COLOR}
        defaultSnap="half"
      />

      {filtersOpen && (
        <FiltersDrawer
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          filters={filters}
          onChange={setFilters}
          accent={ACCENT}
        />
      )}
    </main>
  );
}
