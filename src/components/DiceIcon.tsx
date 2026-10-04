import React from 'react';

interface DiceIconProps {
  className?: string;
}

export const DiceIcon: React.FC<DiceIconProps> = ({ className = 'h-4 w-4' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="6"
        y="6"
        width="88"
        height="88"
        rx="20"
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth="8"
      />
      <circle cx="28" cy="28" r="9" fill="#000000" />
      <circle cx="72" cy="28" r="9" fill="#000000" />
      <circle cx="50" cy="50" r="9" fill="#000000" />
      <circle cx="28" cy="72" r="9" fill="#000000" />
      <circle cx="72" cy="72" r="9" fill="#000000" />
    </svg>
  );
};
