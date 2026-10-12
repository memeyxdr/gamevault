import React from 'react';

interface PumpkinIconProps {
  className?: string;
}

export const PumpkinIcon: React.FC<PumpkinIconProps> = ({ className = 'h-5 w-5' }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} shrink-0 drop-shadow-[0_0_8px_rgba(249,115,22,0.45)] select-none`}
      aria-label="Halloween Pumpkin"
    >
      {/* Pumpkin Stem */}
      <path
        d="M12 2C12.3 3.2 12.8 4.2 13.5 4.8C13.2 5 12.8 5.1 12.4 5.2C11.8 4.2 11.5 3.1 11.6 2.2C11.6 2.1 11.8 2 12 2Z"
        fill="#84cc16"
        stroke="#4d7c0f"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Pumpkin Body - Outer Base Glow */}
      <ellipse
        cx="12"
        cy="14"
        rx="9.5"
        ry="7.5"
        fill="#ea580c"
      />
      {/* Pumpkin Ridges / Lobes */}
      <ellipse
        cx="8.5"
        cy="14"
        rx="5.5"
        ry="7.2"
        fill="#f97316"
      />
      <ellipse
        cx="15.5"
        cy="14"
        rx="5.5"
        ry="7.2"
        fill="#f97316"
      />
      <ellipse
        cx="12"
        cy="14"
        rx="4.2"
        ry="7.5"
        fill="#fb923c"
      />

      {/* Carved Left Eye (Glowing Candlelight) */}
      <polygon
        points="8,11.5 10,13.2 7.2,13.5"
        fill="#fef08a"
        stroke="#7c2d12"
        strokeWidth="0.4"
      />
      {/* Carved Right Eye (Glowing Candlelight) */}
      <polygon
        points="16,11.5 16.8,13.5 14,13.2"
        fill="#fef08a"
        stroke="#7c2d12"
        strokeWidth="0.4"
      />
      {/* Carved Nose */}
      <polygon
        points="12,13.5 12.8,14.7 11.2,14.7"
        fill="#fef08a"
        stroke="#7c2d12"
        strokeWidth="0.3"
      />
      {/* Carved Jack-o'-Lantern Toothy Grin */}
      <path
        d="M7 16.2 C8.2 16.8 9.5 17.5 12 17.5 C14.5 17.5 15.8 16.8 17 16.2 C16.5 17.2 15.5 18.8 12 18.8 C8.5 18.8 7.5 17.2 7 16.2 Z"
        fill="#fef08a"
        stroke="#7c2d12"
        strokeWidth="0.4"
      />
      {/* Carved Teeth Details */}
      <rect x="9.5" y="16.3" width="1.2" height="1" fill="#ea580c" rx="0.2" />
      <rect x="13.3" y="16.3" width="1.2" height="1" fill="#ea580c" rx="0.2" />
      <rect x="11.4" y="17.8" width="1.2" height="1" fill="#ea580c" rx="0.2" />
    </svg>
  );
};
