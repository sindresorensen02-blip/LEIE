"use client";

import { NO } from "@/lib/copy";
import { sourceLabelsNo } from "@/lib/copy";
import type { TotalMonthlyCost } from "@/lib/totalCost";
import type { RankedListing } from "@/lib/types";

const NAVY = "#102033";
const MUTED = "#64748B";

export function CompactCard({
  listing,
  totalCost,
  onSelect,
  cardRadius = 11
}: {
  listing: RankedListing;
  totalCost: TotalMonthlyCost;
  onSelect: (listing: RankedListing) => void;
  cardRadius?: number;
}) {
  const image = listing.images[0] ?? null;
  const monthly = listing.estimatedMonthlyNok ?? listing.priceMonthlyNok ?? 0;
  return (
    <div
      onClick={() => onSelect(listing)}
      style={{
        background: "#fff",
        borderRadius: cardRadius,
        border: "1.5px solid #e8f0f6",
        boxShadow: "0 1px 4px rgba(16,32,51,0.06)",
        padding: "11px 13px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 11,
        transition: "all 150ms ease",
        marginBottom: 8
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          overflow: "hidden",
          flexShrink: 0,
          background: "#f1f5f9"
        }}
      >
        {image && (
          <img
            src={image}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            loading="lazy"
            onError={(event) => {
              (event.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 12.5,
            fontWeight: 600,
            color: NAVY,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginBottom: 2
          }}
        >
          {listing.title}
        </div>
        <div style={{ fontSize: 11, color: MUTED }}>
          {listing.area ?? "Bergen"} · {sourceLabelsNo[listing.source]}
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 700, color: NAVY, lineHeight: 1.2 }}>
          {totalCost.totalNok.toLocaleString("nb-NO")}
        </div>
        <div style={{ fontSize: 9.5, color: "#94a3b8", marginTop: 1 }}>{NO.totalCostShort}</div>
        <div style={{ fontSize: 9.5, color: "#b0bec5", marginTop: 1 }}>
          {NO.rent}: {monthly.toLocaleString("nb-NO")}
        </div>
      </div>
    </div>
  );
}
