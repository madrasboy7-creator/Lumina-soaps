import React from 'react';

interface LuminaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const LuminaLogo: React.FC<LuminaLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const dimensionMap = {
    sm: { circle: 38, text: 'text-lg', subtext: 'text-[9px]' },
    md: { circle: 50, text: 'text-2xl', subtext: 'text-[10px]' },
    lg: { circle: 72, text: 'text-3xl', subtext: 'text-xs' },
    xl: { circle: 110, text: 'text-4xl', subtext: 'text-sm' },
  };

  const dim = dimensionMap[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Emblem SVG */}
      <div
        className="relative flex-shrink-0 transition-transform duration-300 hover:scale-105"
        style={{ width: dim.circle, height: dim.circle }}
      >
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Circular badge */}
          <circle cx="250" cy="250" r="236" fill="#FAF7EF" stroke="#2D4A2D" strokeWidth="6" />
          <circle cx="250" cy="250" r="220" fill="none" stroke="#5E7D5B" strokeWidth="1.8" strokeOpacity="0.8" />

          {/* Golden Sunburst rays */}
          <g transform="translate(250, 150)">
            <path d="M -46 8 A 48 48 0 0 1 46 8" fill="none" stroke="#D39832" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="0" y1="-48" x2="0" y2="-66" stroke="#D39832" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="-24" y1="-42" x2="-35" y2="-57" stroke="#D39832" strokeWidth="3" strokeLinecap="round" />
            <line x1="24" y1="-42" x2="35" y2="-57" stroke="#D39832" strokeWidth="3" strokeLinecap="round" />
            <line x1="-42" y1="-26" x2="-58" y2="-36" stroke="#D39832" strokeWidth="3" strokeLinecap="round" />
            <line x1="42" y1="-26" x2="58" y2="-36" stroke="#D39832" strokeWidth="3" strokeLinecap="round" />
            <line x1="-52" y1="-6" x2="-70" y2="-10" stroke="#D39832" strokeWidth="3" strokeLinecap="round" />
            <line x1="52" y1="-6" x2="70" y2="-10" stroke="#D39832" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Monogram L with botanical leaves */}
          <g transform="translate(210, 134)">
            {/* Serif L */}
            <path
              d="M 20 12 C 20 6, 26 3, 42 3 L 42 16 C 36 16, 34 20, 34 28 L 34 108 C 34 118, 40 120, 52 120 C 70 120, 88 112, 98 90 C 99 88, 102 88, 103 90 C 103 96, 96 124, 40 124 C 18 124, 12 116, 12 104 L 12 28 C 12 20, 10 16, 4 16 L 4 3 C 16 3, 20 6, 20 12 Z"
              fill="#243F24"
            />
            {/* Leaves interwoven */}
            <path d="M 34 66 C 28 50, 40 38, 52 36 C 55 50, 46 64, 34 66 Z" fill="#4B6E44" />
            <path d="M 36 63 Q 44 52 50 38" stroke="#FAF7EF" strokeWidth="1.2" fill="none" opacity="0.8" />
            <path d="M 34 90 C 48 74, 80 48, 114 60 C 118 76, 88 104, 52 102 Z" fill="#385934" />
            <path d="M 40 90 Q 74 72 112 61" stroke="#FAF7EF" strokeWidth="1.6" fill="none" opacity="0.7" />
          </g>

          {/* LUMINA wordmark */}
          <text
            x="250"
            y="318"
            textAnchor="middle"
            fontFamily="'Cormorant Garamond', Georgia, serif"
            fontSize="64"
            fontWeight="700"
            fill="#233E23"
            letterSpacing="8"
          >
            LUMINA
          </text>

          {/* Divider line & leaves */}
          <g transform="translate(250, 340)">
            <line x1="-125" y1="0" x2="-22" y2="0" stroke="#2D4A2D" strokeWidth="2" />
            <line x1="22" y1="0" x2="125" y2="0" stroke="#2D4A2D" strokeWidth="2" />
            <path d="M -2 0 C -8 -9, -16 -7, -16 0 C -11 2, -6 2, -2 0 Z" fill="#3E5C3A" />
            <path d="M 2 0 C 8 -9, 16 -7, 16 0 C 11 2, 6 2, 2 0 Z" fill="#3E5C3A" />
          </g>

          {/* HOMEMADE SOAPS */}
          <text
            x="250"
            y="370"
            textAnchor="middle"
            fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            fontSize="18"
            fontWeight="700"
            fill="#2D4A2D"
            letterSpacing="7.5"
          >
            HOMEMADE SOAPS
          </text>

          {/* Tagline */}
          <text
            x="250"
            y="400"
            textAnchor="middle"
            fontFamily="'Cormorant Garamond', Georgia, serif"
            fontStyle="italic"
            fontSize="21"
            fontWeight="600"
            fill="#476045"
            letterSpacing="1.8"
          >
            Pure Care • Natural Glow
          </text>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-serif tracking-widest font-bold text-[#1e351e] uppercase leading-none ${dim.text}`}
            >
              Lumina
            </span>
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#e8efe6] text-[#335532] font-semibold">
              Artisan
            </span>
          </div>
          <span className={`text-[#526a50] tracking-widest uppercase font-semibold ${dim.subtext}`}>
            Homemade Cold-Process Soaps
          </span>
        </div>
      )}
    </div>
  );
};
