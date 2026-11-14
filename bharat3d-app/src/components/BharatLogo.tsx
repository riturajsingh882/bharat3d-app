import React from 'react';

interface BharatLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const BharatLogo: React.FC<BharatLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = ''
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Fresh New Spatial Network Emblem */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          viewBox="0 0 36 28"
          className={`${isSm ? 'w-6 h-5' : isLg ? 'w-10 h-8' : 'w-8 h-6'} text-[#C9A227]`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dual Connected Nodes & Coordinate Axes inspired by VISTA.IO & Spatial GIS */}
          <path
            d="M8 14H28"
            stroke="#C9A227"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M18 4V24"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray="2 2"
            opacity="0.8"
          />
          <path
            d="M10 8L18 4L26 8L18 12L10 8Z"
            stroke="#C9A227"
            strokeWidth="1.8"
            fill="#C9A227"
            fillOpacity="0.15"
          />
          <circle cx="8" cy="14" r="4" fill="#C9A227" />
          <circle cx="28" cy="14" r="4" fill="#C9A227" />
          <circle cx="18" cy="4" r="2.5" fill="#FFFFFF" />
          <circle cx="18" cy="24" r="2.5" fill="#FFFFFF" />
          <circle cx="18" cy="14" r="2" fill="#FFFFFF" />
        </svg>

        {/* Subtle Ambient Coral Glow */}
        <div className="absolute inset-0 bg-[#C9A227]/20 blur-md rounded-full pointer-events-none" />
      </div>

      {/* Brand Name Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2 leading-none">
          <span className={`font-serif font-bold tracking-normal text-white ${isSm ? 'text-base' : isLg ? 'text-2xl' : 'text-lg'}`}>
            BHARAT
          </span>
          <span className="font-sans font-bold text-[#C9A227] text-xs px-2 py-0.5 rounded bg-[#C9A227]/20 border border-[#C9A227]/40 tracking-wider shadow-[0_0_10px_rgba(201,162,39,0.25)]">
            3D
          </span>
        </div>
        {showSubtitle && (
          <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400 mt-1">
            Cartographic Atlas of India
          </span>
        )}
      </div>
    </div>
  );
};
