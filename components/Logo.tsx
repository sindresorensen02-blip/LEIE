import clsx from "clsx";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 360 100"
      fill="none"
      role="img"
      aria-label="LEIE"
      className={clsx("block h-auto w-[110px] select-none md:w-[140px]", className)}
    >
      <defs>
        <linearGradient
          id="leie-logo-grad"
          x1="0"
          y1="50"
          x2="360"
          y2="50"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#0B6FF3" />
          <stop offset="0.55" stopColor="#05B6E8" />
          <stop offset="1" stopColor="#00C7A7" />
        </linearGradient>
      </defs>

      <path
        d="M14 86 V46 L48 16 L82 46 V86"
        stroke="url(#leie-logo-grad)"
        strokeWidth={9}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      <g transform="translate(34 46)">
        <path d="M2 6 H22 L30 14 V40 H2 Z" fill="url(#leie-logo-grad)" />
        <circle cx={22} cy={14} r={2.6} fill="#FFFFFF" />
        <path
          d="M16 20 V32 M10 26 L16 32 L22 26"
          stroke="#FFFFFF"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      <g
        stroke="url(#leie-logo-grad)"
        strokeWidth={13}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M120 24 V78 H156" />
        <path d="M210 24 H174 V78 H210" />
        <path d="M174 51 H204" />
        <path d="M232 24 V78" />
        <path d="M290 24 H254 V78 H290" />
        <path d="M254 51 H284" />
      </g>
    </svg>
  );
}
