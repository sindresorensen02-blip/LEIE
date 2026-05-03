"use client";

import { useState } from "react";
import clsx from "clsx";

export function Logo({ className }: { className?: string }) {
  const [src, setSrc] = useState("/images/leie-logo.png");
  return (
    <img
      src={src}
      onError={() => setSrc("/images/leie-logo.svg")}
      alt="LEIE"
      className={clsx(
        "block h-auto w-[110px] select-none object-contain md:w-[140px]",
        className
      )}
      draggable={false}
    />
  );
}
