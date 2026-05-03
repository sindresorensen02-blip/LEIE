"use client";

const ACCENT = "#0B6FF3";
const MUTED_STRONG = "#475569";

export function Pill({
  label,
  active,
  onClick,
  accent = ACCENT
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  accent?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 28,
        padding: "0 11px",
        borderRadius: 20,
        border: `1.5px solid ${active ? accent : "rgba(221,231,239,0.9)"}`,
        background: active ? `${accent}18` : "rgba(255,255,255,0.78)",
        color: active ? accent : MUTED_STRONG,
        fontSize: 11.5,
        fontWeight: 600,
        cursor: "pointer",
        flexShrink: 0,
        whiteSpace: "nowrap",
        transition: "all 130ms ease",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)"
      }}
    >
      {label}
    </button>
  );
}
