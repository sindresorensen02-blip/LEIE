"use client";

export function IOSDevice({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: 390,
        height: 844,
        borderRadius: 48,
        overflow: "hidden",
        position: "relative",
        background: "#000",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,.06), 0 30px 80px rgba(0,0,0,.5), 0 0 0 10px #1a1a1a, 0 0 0 11px #2a2a2a",
        flexShrink: 0
      }}
    >
      {/* Dynamic Island */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          width: 120,
          height: 34,
          borderRadius: 20,
          background: "#000",
          zIndex: 100
        }}
      />
      {/* Status bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 54,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "18px 28px 0",
          pointerEvents: "none"
        }}
      >
        <span
          style={{
            fontFamily: "-apple-system,system-ui",
            fontSize: 16,
            fontWeight: 600,
            color: "#fff",
            letterSpacing: "-0.3px"
          }}
        >
          9:41
        </span>
        <div style={{ display: "flex", gap: 7, alignItems: "center", paddingTop: 2 }}>
          <svg width={18} height={12} viewBox="0 0 18 12">
            {[0, 1, 2, 3].map((i) => (
              <rect
                key={i}
                x={i * 4.5}
                y={12 - (i + 1) * 3}
                width={3.2}
                height={(i + 1) * 3}
                rx={0.7}
                fill="rgba(255,255,255,0.9)"
              />
            ))}
          </svg>
          <svg width={16} height={12} viewBox="0 0 16 12">
            <path
              d="M8 9.5c-.7 0-1.2.5-1.2 1.2s.5 1.2 1.2 1.2 1.2-.5 1.2-1.2-.5-1.2-1.2-1.2z"
              fill="rgba(255,255,255,0.9)"
            />
            <path
              d="M4.2 7.2C5.2 6.1 6.5 5.5 8 5.5s2.8.6 3.8 1.7l1-1C11.5 4.8 9.9 4 8 4S4.5 4.8 3.2 6.2l1 1z"
              fill="rgba(255,255,255,0.9)"
            />
            <path
              d="M1.2 4.2C2.8 2.5 5.3 1.5 8 1.5s5.2 1 6.8 2.7l1-1C14 1.3 11.2 0 8 0S2 1.3.2 3.2l1 1z"
              fill="rgba(255,255,255,0.9)"
            />
          </svg>
          <svg width={26} height={12} viewBox="0 0 26 12">
            <rect
              x={0.5}
              y={0.5}
              width={22}
              height={11}
              rx={3}
              stroke="rgba(255,255,255,0.45)"
              fill="none"
            />
            <rect x={2} y={2} width={18} height={8} rx={1.5} fill="rgba(255,255,255,0.9)" />
            <path d="M24 4v4c.8-.4 1.2-1.1 1.2-2s-.4-1.6-1.2-2z" fill="rgba(255,255,255,0.4)" />
          </svg>
        </div>
      </div>
      {/* Home indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          left: "50%",
          transform: "translateX(-50%)",
          width: 134,
          height: 5,
          borderRadius: 3,
          background: "rgba(255,255,255,0.3)",
          zIndex: 100,
          pointerEvents: "none"
        }}
      />
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>{children}</div>
    </div>
  );
}
