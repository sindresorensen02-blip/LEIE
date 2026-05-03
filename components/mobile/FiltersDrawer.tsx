"use client";

import { NO } from "@/lib/copy";
import type { ListingFilters, PropertyType, RentalSource } from "@/lib/types";

const NAVY = "#102033";
const MUTED = "#64748B";

const sel: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1.5px solid #e2e8f0",
  borderRadius: 10,
  background: "#fff",
  color: NAVY,
  fontSize: 13,
  outline: "none",
  appearance: "none",
  WebkitAppearance: "none"
};

export const DEFAULT_FILTERS: ListingFilters = {
  propertyType: "all",
  source: "all",
  maxPrice: null,
  includeShortTerm: true,
  sort: "cheapest"
};

export function FiltersDrawer({
  open,
  onClose,
  filters,
  onChange,
  accent
}: {
  open: boolean;
  onClose: () => void;
  filters: ListingFilters;
  onChange: (filters: ListingFilters) => void;
  accent: string;
}) {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 60,
          background: "rgba(16,32,51,0.38)",
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 260ms ease"
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 70,
          background: "#fff",
          borderRadius: "22px 22px 0 0",
          boxShadow: "0 -6px 36px rgba(16,32,51,0.16)",
          transform: open ? "translateY(0)" : "translateY(105%)",
          transition: "transform 320ms cubic-bezier(0.32,0.72,0,1)",
          maxHeight: "76%",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#e2e8f0" }} />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 20px 14px"
          }}
        >
          <span style={{ fontSize: 17, fontWeight: 700, color: NAVY }}>{NO.filters}</span>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: MUTED,
              fontSize: 22,
              lineHeight: 1,
              padding: 4
            }}
            aria-label="Lukk"
          >
            ×
          </button>
        </div>
        <div style={{ overflowY: "auto", padding: "0 20px 40px", flex: 1 }}>
          <Section label={NO.propertyType}>
            <select
              style={sel}
              value={filters.propertyType ?? "all"}
              onChange={(event) =>
                onChange({ ...filters, propertyType: event.target.value as PropertyType | "all" })
              }
            >
              <option value="all">{NO.allTypes}</option>
              <option value="room">{NO.room}</option>
              <option value="shared_room">{NO.sharedRoom}</option>
              <option value="studio">{NO.studio}</option>
              <option value="apartment">{NO.apartment}</option>
              <option value="house">{NO.house}</option>
            </select>
          </Section>

          <Section label={NO.source}>
            <select
              style={sel}
              value={filters.source ?? "all"}
              onChange={(event) =>
                onChange({ ...filters, source: event.target.value as RentalSource | "all" })
              }
            >
              <option value="all">{NO.allSources}</option>
              <option value="finn">FINN.no</option>
              <option value="airbnb">Airbnb</option>
              <option value="hybel">Hybel.no</option>
              <option value="utleiemegleren">Utleiemegleren</option>
              <option value="heimstaden">Heimstaden</option>
            </select>
          </Section>

          <Section label={NO.maxMonthly}>
            <input
              type="number"
              placeholder={NO.noLimit}
              min={0}
              style={sel}
              value={filters.maxPrice ?? ""}
              onChange={(event) =>
                onChange({
                  ...filters,
                  maxPrice: event.target.value ? Number(event.target.value) : null
                })
              }
            />
          </Section>

          <div
            onClick={() =>
              onChange({ ...filters, includeShortTerm: !(filters.includeShortTerm !== false) })
            }
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 14px",
              background: "#f8fafc",
              borderRadius: 12,
              marginBottom: 10,
              cursor: "pointer",
              border: "1.5px solid #e8f0f6"
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 500, color: "#334155" }}>
              {NO.includeShortTerm}
            </span>
            <div
              style={{
                width: 42,
                height: 24,
                borderRadius: 12,
                position: "relative",
                background: filters.includeShortTerm !== false ? accent : "#cbd5e1",
                transition: "background 160ms"
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 2,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "#fff",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                  left: filters.includeShortTerm !== false ? 20 : 2,
                  transition: "left 160ms"
                }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => onChange({ ...DEFAULT_FILTERS })}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 12,
              border: "1.5px solid #e2e8f0",
              background: "#fff",
              color: MUTED,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              marginTop: 4
            }}
          >
            {NO.resetFilters}
          </button>
        </div>
      </div>
    </>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: MUTED,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 7
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}
