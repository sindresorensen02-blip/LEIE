"use client";

import { useState } from "react";
import { NO } from "@/lib/copy";
import type { TotalMonthlyCost } from "@/lib/totalCost";

const NAVY = "#102033";
const MUTED = "#64748B";
const MUTED_STRONG = "#475569";
const ICE = "#DDE7EF";

export function CostBreakdown({
  tc,
  accent,
  teal
}: {
  tc: TotalMonthlyCost;
  accent: string;
  teal: string;
}) {
  const [open, setOpen] = useState(false);

  const confColor: Record<TotalMonthlyCost["confidence"], string> = {
    high: teal,
    medium: "#F59E0B",
    low: MUTED
  };
  const confLabel = NO.confidence[tc.confidence];
  const confCol = confColor[tc.confidence];

  const rows = [
    { label: NO.rent, amount: tc.rentNok, always: true },
    { label: NO.electricity, amount: tc.electricityNok, always: true },
    { label: NO.internet, amount: tc.internetNok, always: tc.internetNok > 0 },
    { label: NO.transport, amount: tc.transportNok, always: tc.transportNok > 0 }
  ].filter((r) => r.always);

  return (
    <div
      style={{
        background: "#f8fafc",
        borderRadius: 12,
        border: "1px solid #e8f0f6",
        marginBottom: 13,
        overflow: "hidden"
      }}
    >
      <div
        style={{
          padding: "12px 14px 10px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 8
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: MUTED,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 3
            }}
          >
            {NO.totalCost}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: NAVY, letterSpacing: "-0.5px" }}>
              {tc.totalNok.toLocaleString("nb-NO")}
            </span>
            <span style={{ fontSize: 12, color: MUTED, fontWeight: 500 }}>{NO.nokPerMonth}</span>
          </div>
          <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>
            {NO.rent}: <strong style={{ color: NAVY }}>{tc.rentNok.toLocaleString("nb-NO")}</strong> NOK
          </div>
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            background: `${confCol}18`,
            color: confCol,
            border: `1px solid ${confCol}30`,
            borderRadius: 20,
            padding: "3px 9px",
            fontSize: 10,
            fontWeight: 700,
            flexShrink: 0,
            marginTop: 2
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: confCol,
              display: "block"
            }}
          />
          {confLabel}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "7px 14px",
          background: "none",
          border: "none",
          borderTop: "1px solid #e8f0f6",
          cursor: "pointer",
          fontSize: 11.5,
          fontWeight: 600,
          color: accent
        }}
      >
        {open ? NO.hideBreakdown : NO.showBreakdown}
        <svg
          width={12}
          height={12}
          viewBox="0 0 12 12"
          fill="none"
          stroke={accent}
          strokeWidth={2}
          strokeLinecap="round"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 200ms"
          }}
        >
          <path d="M2 4l4 4 4-4" />
        </svg>
      </button>

      {open && (
        <div style={{ padding: "4px 14px 12px", borderTop: "1px solid #f1f5f9" }}>
          {rows.map((r) => (
            <div
              key={r.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "5px 0",
                borderBottom: "1px solid #f1f5f9",
                fontSize: 12,
                color: NAVY
              }}
            >
              <span style={{ color: MUTED }}>{r.label}</span>
              <span style={{ fontWeight: 600 }}>{r.amount.toLocaleString("nb-NO")} NOK</span>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "7px 0 2px",
              fontSize: 13,
              fontWeight: 700,
              color: NAVY
            }}
          >
            <span>Totalt</span>
            <span style={{ color: accent }}>{tc.totalNok.toLocaleString("nb-NO")} NOK</span>
          </div>
          <div
            style={{
              marginTop: 8,
              padding: "8px 10px",
              background: "#fff",
              borderRadius: 8,
              border: "1px solid #e8f0f6"
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: MUTED,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 5
              }}
            >
              {NO.assumptions}
            </div>
            {tc.assumptions.map((a, i) => (
              <div
                key={i}
                style={{
                  fontSize: 10.5,
                  color: MUTED_STRONG,
                  lineHeight: 1.5,
                  paddingLeft: 10,
                  position: "relative",
                  marginBottom: 2
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "0.4em",
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: ICE,
                    display: "block"
                  }}
                />
                {a}
              </div>
            ))}
            <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 6, lineHeight: 1.5 }}>
              {NO.totalCostNote}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
