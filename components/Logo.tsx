"use client";

import { useState } from "react";
import clsx from "clsx";

export function Logo({ className }: { className?: string }) {
  const [src, setSrc] = useState("/images/leie-logo.png");
  return (
    <img
      src={src}
      onError={() => setSrc("/images/leie-logo.svg")}
      alt="Leie"
      className={clsx("select-none", className)}
      draggable={false}
    />
  );
}
