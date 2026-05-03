"use client";

import type { MarketSignal } from "@/lib/types";
import { NO } from "@/lib/copy";

const MUTED = "#64748B";

export function SignalChip({
  signal,
  delta,
  teal,
  error
}: {
  signal: MarketSignal | undefined;
  delta: number | null | undefined;
  teal: string;
  error: string;
}) {
  const cfg: Record<MarketSignal, { label: string; bg: string; col: string; border: string; icon: string }> = {
    under_market: { label: NO.belowMarket, bg: `${teal}18`, col: teal, border: `${teal}30`, icon: "↓" },
    market_price: { label: NO.aroundMarket, bg: "#f1f5f9", col: MUTED, border: "#e2e8f0", icon: "→" },
    above_market: { label: NO.aboveMarket, bg: `${error}14`, col: error, border: `${error}35`, icon: "↑" },
    unknown: { label: NO.aroundMarket, bg: "#f1f5f9", col: MUTED, border: "#e2e8f0", icon: "→" }
  };
  const c = cfg[signal ?? "unknown"];
  const sign = delta != null && delta > 0 ? "+" : "";
  const deltaText = delta != null ? ` ${sign}${Math.round(delta)}%` : "";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        background: c.bg,
        color: c.col,
        border: `1px solid ${c.border}`,
        borderRadius: 20,
        padding: "3px 8px",
        fontSize: 10.5,
        fontWeight: 700,
        whiteSpace: "nowrap"
      }}
    >
      {c.icon} {c.label}
      {deltaText}
    </span>
  );
}
