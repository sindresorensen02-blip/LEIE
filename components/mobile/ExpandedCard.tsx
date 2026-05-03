"use client";

import { NO, propertyTypeLabelsNo, sourceLabelsNo } from "@/lib/copy";
import type { TotalMonthlyCost } from "@/lib/totalCost";
import type { RankedListing } from "@/lib/types";
import { CostBreakdown } from "./CostBreakdown";
import { SignalChip } from "./SignalChip";

const NAVY = "#102033";
const MUTED = "#64748B";

function listingBadgeLabel(badge: string): string {
  switch (badge) {
    case "Cheapest":
      return NO.cheapestBadge;
    case "Good value":
      return NO.goodValue;
    case "Under market":
      return NO.underMarketBadge;
    case "Short-term":
      return NO.shortTerm;
    case "Available now":
      return NO.availableNow;
    case "Room":
      return NO.room;
    case "Market price":
      return NO.aroundMarket;
    case "Above market":
      return NO.aboveMarket;
    default:
      return badge;
  }
}

export function ExpandedCard({
  listing,
  totalCost,
  cheapestTotalId,
  accent,
  teal,
  error,
  cardRadius = 14
}: {
  listing: RankedListing;
  totalCost: TotalMonthlyCost;
  cheapestTotalId: string | null;
  accent: string;
  teal: string;
  error: string;
  cardRadius?: number;
}) {
  const image = listing.images[0] ?? null;
  const monthly = listing.estimatedMonthlyNok ?? listing.priceMonthlyNok ?? 0;

  const designBadges: string[] = [];
  if (listing.id === cheapestTotalId) designBadges.push(NO.cheapestTotal);
  if (listing.badges.includes("Under market") && listing.id !== cheapestTotalId) {
    designBadges.push(NO.underMarketBadge);
  }
  if (listing.badges.includes("Short-term")) designBadges.push(NO.shortTerm);
  if (listing.badges.includes("Cheapest") && listing.id !== cheapestTotalId) {
    designBadges.push(NO.cheapestBadge);
  }
  if (designBadges.length === 0) {
    listing.badges.slice(0, 2).forEach((b) => {
      const lbl = listingBadgeLabel(b);
      if (!designBadges.includes(lbl)) designBadges.push(lbl);
    });
  }

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: Math.max(cardRadius, 14),
        border: "1.5px solid #e2e8f0",
        boxShadow: "0 4px 20px rgba(16,32,51,0.10)",
        overflow: "hidden",
        marginBottom: 14
      }}
    >
      <div style={{ position: "relative", height: 156, overflow: "hidden", background: "#f1f5f9" }}>
        {image && (
          <img
            src={image}
            alt={listing.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(event) => {
              (event.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, transparent 30%, rgba(16,32,51,0.65) 100%)"
          }}
        />
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 5, flexWrap: "wrap" }}>
          {designBadges.map((b) => (
            <span
              key={b}
              style={{
                background: `linear-gradient(135deg, ${accent}, ${teal})`,
                color: "#fff",
                fontSize: 9.5,
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: 20
              }}
            >
              {b}
            </span>
          ))}
        </div>
        <div style={{ position: "absolute", bottom: 10, left: 12 }}>
          <div
            style={{
              fontSize: 9.5,
              color: "rgba(255,255,255,0.72)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 1
            }}
          >
            {NO.totalCostShort}
          </div>
          <span style={{ fontSize: 21, fontWeight: 800, color: "#fff", textShadow: "0 1px 6px rgba(0,0,0,0.45)" }}>
            {totalCost.totalNok.toLocaleString("nb-NO")}{" "}
            <span style={{ fontSize: 12, fontWeight: 500 }}>{NO.nokPerMonth}</span>
          </span>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", marginTop: 1 }}>
            {NO.rent}: {monthly.toLocaleString("nb-NO")} NOK
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 10, right: 12 }}>
          <SignalChip signal={listing.marketSignal} delta={listing.marketDeltaPercent} teal={teal} error={error} />
        </div>
      </div>

      <div style={{ padding: "14px 16px" }}>
        <div style={{ fontSize: 14.5, fontWeight: 700, color: NAVY, marginBottom: 2, lineHeight: 1.3 }}>
          {listing.title}
        </div>
        <div style={{ fontSize: 12, color: MUTED, marginBottom: 12 }}>
          {[listing.address, listing.area].filter(Boolean).join(" · ") || "Bergen"}
        </div>

        <CostBreakdown tc={totalCost} accent={accent} teal={teal} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px 14px", marginBottom: 13 }}>
          {(
            [
              ["🏠", propertyTypeLabelsNo[listing.propertyType]],
              ["📐", listing.sizeM2 ? `${listing.sizeM2} m²` : "?"],
              [
                "🛏",
                `${listing.bedrooms ?? 0} ${listing.bedrooms === 1 ? NO.bedroom : NO.bedrooms}`
              ],
              ["📅", `${NO.from} ${listing.availableFrom ?? "TBC"}`],
              [
                "🔑",
                listing.depositNok
                  ? `${listing.depositNok.toLocaleString("nb-NO")} ${NO.deposit}`
                  : NO.noDeposit
              ],
              ["📌", sourceLabelsNo[listing.source]]
            ] as Array<[string, string]>
          ).map(([icon, val]) => (
            <div key={`${icon}-${val}`} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#334155" }}>
              <span style={{ fontSize: 12, width: 16 }}>{icon}</span>
              <span>{val}</span>
            </div>
          ))}
        </div>

        {listing.marketPriceNok != null && listing.area && (
          <div
            style={{
              background: "#f8fafc",
              borderRadius: 10,
              padding: "9px 11px",
              border: "1px solid #e8f0f6",
              marginBottom: 13
            }}
          >
            <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.5 }}>
              {NO.areaMedian} ({listing.area}):{" "}
              <strong style={{ color: NAVY }}>
                {listing.marketPriceNok.toLocaleString("nb-NO")} {NO.nokPerMonth}
              </strong>
              {" — "}
              {listing.marketDeltaPercent != null && listing.marketDeltaPercent < 0 ? (
                <span style={{ color: teal, fontWeight: 600 }}>
                  {Math.abs(Math.round(listing.marketDeltaPercent))}% {NO.below}
                </span>
              ) : listing.marketDeltaPercent != null && listing.marketDeltaPercent > 0 ? (
                <span style={{ color: error, fontWeight: 600 }}>
                  {Math.round(listing.marketDeltaPercent)}% {NO.above}
                </span>
              ) : (
                <span style={{ color: MUTED }}>{NO.atMedian}</span>
              )}
            </div>
          </div>
        )}

        <a
          href={listing.listingUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            background: `linear-gradient(135deg, ${accent} 0%, ${teal} 100%)`,
            color: "#fff",
            borderRadius: 13,
            padding: "13px 16px",
            fontSize: 14,
            fontWeight: 700,
            textDecoration: "none",
            boxShadow: `0 4px 16px ${accent}38`
          }}
        >
          {NO.viewOn} {sourceLabelsNo[listing.source]}
          <svg
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth={2.5}
            strokeLinecap="round"
          >
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15,3 21,3 21,9" />
            <line x1={10} y1={14} x2={21} y2={3} />
          </svg>
        </a>
      </div>
    </div>
  );
}
