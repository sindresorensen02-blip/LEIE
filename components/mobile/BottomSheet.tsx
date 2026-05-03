"use client";

import { useEffect, useRef, useState } from "react";
import { NO } from "@/lib/copy";
import type { TotalMonthlyCost } from "@/lib/totalCost";
import type { ListingSort, RankedListing } from "@/lib/types";
import { CompactCard } from "./CompactCard";
import { ExpandedCard } from "./ExpandedCard";
import { Pill } from "./Pill";

const NAVY = "#102033";
const MUTED = "#64748B";

type SnapKey = "peek" | "half" | "full";
const SNAP_FRACTION: Record<SnapKey, number> = { peek: 0.895, half: 0.48, full: 0.11 };

export type SheetSort = "cheapest" | "largest" | "total";

export function BottomSheet({
  listings,
  totalCosts,
  cheapestTotalId,
  selected,
  onSelect,
  onReset,
  sort,
  onSortChange,
  accent,
  teal,
  error,
  defaultSnap = "half",
  cardRadius = 11
}: {
  listings: RankedListing[];
  totalCosts: Map<string, TotalMonthlyCost>;
  cheapestTotalId: string | null;
  selected: RankedListing | null;
  onSelect: (listing: RankedListing) => void;
  onReset: () => void;
  sort: SheetSort;
  onSortChange: (sort: SheetSort) => void;
  accent: string;
  teal: string;
  error: string;
  defaultSnap?: SnapKey;
  cardRadius?: number;
}) {
  const [snap, setSnap] = useState<SnapKey>(defaultSnap);
  const [dragY, setDragY] = useState<number | null>(null);
  const [deviceH, setDeviceH] = useState(844);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const startRef = useRef<{ y: number; snap: SnapKey } | null>(null);

  useEffect(() => {
    setSnap(defaultSnap);
  }, [defaultSnap]);

  useEffect(() => {
    const node = sheetRef.current?.parentElement;
    if (!node) return;
    const updateH = () => setDeviceH(node.clientHeight || window.innerHeight);
    updateH();
    const observer = new ResizeObserver(updateH);
    observer.observe(node);
    window.addEventListener("resize", updateH);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateH);
    };
  }, []);

  const topPx = dragY != null ? dragY : SNAP_FRACTION[snap] * deviceH;
  const isCollapsed = snap === "peek";

  function pointerStart(clientY: number) {
    dragging.current = true;
    startRef.current = { y: clientY, snap };
  }
  function pointerMove(clientY: number) {
    if (!dragging.current || !startRef.current) return;
    const dy = clientY - startRef.current.y;
    const base = SNAP_FRACTION[startRef.current.snap] * deviceH;
    setDragY(
      Math.max(SNAP_FRACTION.full * deviceH - 8, Math.min(SNAP_FRACTION.peek * deviceH + 8, base + dy))
    );
  }
  function pointerEnd() {
    if (!dragging.current) return;
    dragging.current = false;
    const finalY = dragY ?? SNAP_FRACTION[snap] * deviceH;
    setDragY(null);
    const nearest = (Object.entries(SNAP_FRACTION) as Array<[SnapKey, number]>).sort(
      (a, b) => Math.abs(finalY - a[1] * deviceH) - Math.abs(finalY - b[1] * deviceH)
    )[0][0];
    setSnap(nearest);
    startRef.current = null;
  }

  const sortOpts: Array<[string, SheetSort]> = [
    [NO.cheapest, "cheapest"],
    [NO.largest, "largest"],
    [NO.totalCostSortLabel, "total"]
  ];

  return (
    <div
      ref={sheetRef}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        top: `${topPx}px`,
        background: "#fff",
        borderRadius: snap === "full" ? "20px 20px 0 0" : "22px 22px 0 0",
        boxShadow: "0 -4px 30px rgba(16,32,51,0.13)",
        transition: dragging.current
          ? "none"
          : "top 330ms cubic-bezier(0.32,0.72,0,1), border-radius 200ms",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 20,
        touchAction: "none"
      }}
    >
      <div
        onMouseDown={(event) => {
          pointerStart(event.clientY);
          const move = (e2: MouseEvent) => pointerMove(e2.clientY);
          const up = () => {
            pointerEnd();
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
          };
          window.addEventListener("mousemove", move);
          window.addEventListener("mouseup", up);
        }}
        onTouchStart={(event) => pointerStart(event.touches[0].clientY)}
        onTouchMove={(event) => pointerMove(event.touches[0].clientY)}
        onTouchEnd={pointerEnd}
        style={{ padding: "10px 0 4px", cursor: "row-resize", userSelect: "none", flexShrink: 0 }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "#dde7ef", margin: "0 auto" }} />
      </div>

      <div
        style={{
          padding: "2px 14px 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          flexShrink: 0,
          borderBottom: "1px solid #f1f5f9"
        }}
      >
        <div>
          <span style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>{listings.length}</span>
          <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: 5 }}>{NO.listings}</span>
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {sortOpts.map(([l, v]) => (
            <Pill key={v} label={l} active={sort === v} onClick={() => onSortChange(v)} accent={accent} />
          ))}
        </div>
      </div>

      {!isCollapsed && (
        <div style={{ display: "flex", gap: 14, padding: "7px 14px 7px", flexShrink: 0 }}>
          {(
            [
              [teal, NO.belowMarket],
              [MUTED, NO.aroundMarket],
              [error, NO.aboveMarket]
            ] as Array<[string, string]>
          ).map(([col, lbl]) => (
            <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10.5, color: MUTED }}>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: col,
                  display: "block",
                  flexShrink: 0
                }}
              />
              {lbl}
            </div>
          ))}
        </div>
      )}

      {!isCollapsed && (
        <div style={{ flex: 1, overflowY: "auto", padding: "6px 13px 40px", WebkitOverflowScrolling: "touch" }}>
          {listings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>🔍</div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#475569", marginBottom: 6 }}>
                {NO.noMatches}
              </p>
              <p style={{ fontSize: 12, color: MUTED, marginBottom: 16 }}>{NO.tryWider}</p>
              <button
                type="button"
                onClick={onReset}
                style={{
                  padding: "8px 20px",
                  borderRadius: 10,
                  border: "1.5px solid #e2e8f0",
                  background: "#fff",
                  color: MUTED,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                {NO.reset}
              </button>
            </div>
          ) : (
            <>
              {selected && totalCosts.get(selected.id) && (
                <ExpandedCard
                  listing={selected}
                  totalCost={totalCosts.get(selected.id) as TotalMonthlyCost}
                  cheapestTotalId={cheapestTotalId}
                  accent={accent}
                  teal={teal}
                  error={error}
                  cardRadius={cardRadius}
                />
              )}
              {listings
                .filter((l) => l.id !== selected?.id)
                .map((listing) => {
                  const tc = totalCosts.get(listing.id);
                  if (!tc) return null;
                  return (
                    <CompactCard
                      key={listing.id}
                      listing={listing}
                      totalCost={tc}
                      onSelect={(l2) => {
                        onSelect(l2);
                        setSnap("half");
                      }}
                      cardRadius={cardRadius}
                    />
                  );
                })}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// re-export type so consumers know the shape
export type { ListingSort };
