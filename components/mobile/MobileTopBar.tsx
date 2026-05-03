"use client";

import { NO } from "@/lib/copy";
import type { ListingFilters, PropertyType } from "@/lib/types";
import { Logo } from "./Logo";
import { Pill } from "./Pill";

const MUTED = "#64748B";
const MUTED_STRONG = "#475569";

export function MobileTopBar({
  count,
  total,
  onFilter,
  filtersActive,
  filters,
  onFilterChange,
  accent,
  teal
}: {
  count: number;
  total: number;
  onFilter: () => void;
  filtersActive: boolean;
  filters: ListingFilters;
  onFilterChange: (filters: ListingFilters) => void;
  accent: string;
  teal: string;
}) {
  const typeOpts: Array<[PropertyType | "all", string]> = [
    ["all", NO.all],
    ["room", NO.room],
    ["studio", NO.studio],
    ["apartment", NO.apt],
    ["house", NO.house]
  ];
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        background: "rgba(247,250,252,0.84)",
        backdropFilter: "saturate(180%) blur(18px)",
        WebkitBackdropFilter: "saturate(180%) blur(18px)",
        borderBottom: "1px solid rgba(221,231,239,0.6)"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 16px 8px",
          paddingTop: "max(16px, env(safe-area-inset-top))"
        }}
      >
        <Logo a1={accent} a2={teal} />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: MUTED }}>
            {count}/{total}
          </span>
          <button
            type="button"
            onClick={onFilter}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              height: 30,
              padding: "0 12px",
              borderRadius: 20,
              border: `1.5px solid ${filtersActive ? accent : "rgba(221,231,239,0.9)"}`,
              background: filtersActive ? `${accent}15` : "rgba(255,255,255,0.78)",
              color: filtersActive ? accent : MUTED_STRONG,
              fontSize: 11.5,
              fontWeight: 600,
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              transition: "all 130ms"
            }}
          >
            <svg
              width={13}
              height={13}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
            >
              <line x1={4} y1={6} x2={20} y2={6} />
              <line x1={8} y1={12} x2={16} y2={12} />
              <line x1={11} y1={18} x2={13} y2={18} />
            </svg>
            {NO.filters}
            {filtersActive && (
              <span
                style={{
                  background: accent,
                  color: "#fff",
                  borderRadius: "50%",
                  width: 14,
                  height: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
                  fontWeight: 800
                }}
              >
                !
              </span>
            )}
          </button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 6,
          padding: "0 14px 10px",
          overflowX: "auto",
          scrollbarWidth: "none"
        }}
      >
        {typeOpts.map(([v, l]) => (
          <Pill
            key={v}
            label={l}
            active={(filters.propertyType ?? "all") === v}
            onClick={() => onFilterChange({ ...filters, propertyType: v })}
            accent={accent}
          />
        ))}
      </div>
    </div>
  );
}
