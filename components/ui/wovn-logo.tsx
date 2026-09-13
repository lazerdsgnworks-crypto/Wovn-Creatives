import React from "react";

interface WovnLogoProps {
  className?: string;
  variant?: "auto" | "light" | "dark";
  fill?: string;
}

export function WovnLogo({ className = "h-6 w-auto", fill }: WovnLogoProps) {
  return (
    <svg
      viewBox="0 0 520 100"
      className={className}
      fill={fill || "currentColor"}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="WOVN"
    >
      {/* W */}
      <path d="M 18 18 L 46 82 L 68 34 L 90 82 L 118 18 L 100 18 L 79 64 L 62 25 L 52 25 L 35 64 L 18 18 Z" />
      {/* Stadium / Capsule O with matching geometric stroke */}
      <rect
        x="138"
        y="18"
        width="132"
        height="64"
        rx="32"
        ry="32"
        fill="none"
        stroke={fill || "currentColor"}
        strokeWidth="11.5"
      />
      {/* V */}
      <path d="M 295 18 L 327 82 L 345 82 L 377 18 L 359 18 L 336 65 L 313 18 Z" />
      {/* N */}
      <path d="M 400 18 L 400 82 L 416 82 L 416 38 L 454 82 L 468 82 L 468 18 L 452 18 L 452 62 L 414 18 Z" />
    </svg>
  );
}

export default WovnLogo;
