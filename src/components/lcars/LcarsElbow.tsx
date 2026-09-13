import React from 'react';
import { LCARS_COLORS, LcarsColor } from '../../theme/lcarsPalette';

interface LcarsElbowProps {
  color?: LcarsColor;
  title?: string;
  code?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  barHeight?: number;
  columnWidth?: number;
  className?: string;
  children?: React.ReactNode;
}

export const LcarsElbow: React.FC<LcarsElbowProps> = ({
  color = 'gold',
  title = 'STARFLEET COMMAND',
  code = 'LCARS-47',
  position = 'top-left',
  barHeight = 40,
  columnWidth = 140,
  className = '',
  children
}) => {
  const colorDef = LCARS_COLORS[color] || LCARS_COLORS.gold;

  if (position === 'top-left') {
    return (
      <div className={`flex flex-col w-full ${className}`}>
        {/* Horizontal top bar with curve */}
        <div className="flex items-center w-full" style={{ height: `${barHeight}px` }}>
          {/* Curved Elbow Header */}
          <div 
            className="flex items-center justify-between px-4 h-full rounded-tl-3xl text-black font-lcars font-bold text-base sm:text-lg tracking-wider shrink-0"
            style={{ 
              width: `${columnWidth}px`, 
              backgroundColor: colorDef.hex 
            }}
          >
            <span className="truncate">{title}</span>
          </div>

          {/* Spacer / Cutout Gap */}
          <div className="w-3 h-full bg-black shrink-0" />

          {/* Top connecting bar */}
          <div 
            className="flex-1 h-full flex items-center justify-between px-4 text-black font-mono-tech text-xs sm:text-sm font-bold tracking-widest rounded-r-sm"
            style={{ backgroundColor: colorDef.hex }}
          >
            <span className="hidden sm:inline">SYS-DIAGNOSTIC // 47-B</span>
            <span className="font-bold">{code}</span>
          </div>
        </div>

        {/* Vertical Column & Content */}
        <div className="flex flex-1 w-full">
          {/* Left Vertical Bar */}
          <div 
            className="flex flex-col justify-between py-2 shrink-0 rounded-bl-sm"
            style={{ 
              width: `${columnWidth}px`, 
              backgroundColor: colorDef.hex 
            }}
          >
            <div className="px-3 py-1 text-black font-mono-tech text-[11px] font-bold opacity-85">
              SEC-01
            </div>
            <div className="px-3 py-1 text-black font-mono-tech text-[11px] font-bold opacity-85 text-right">
              9402
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-3 sm:p-5 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    );
  }

  // Default fallback for top bar
  return (
    <div className={`flex items-center w-full ${className}`} style={{ height: `${barHeight}px` }}>
      <div 
        className="flex items-center px-4 h-full rounded-l-full text-black font-lcars font-bold text-base"
        style={{ width: `${columnWidth}px`, backgroundColor: colorDef.hex }}
      >
        <span>{title}</span>
      </div>
      <div className="w-2 h-full bg-black" />
      <div 
        className="flex-1 h-full rounded-r-full flex items-center justify-end px-4 text-black font-mono-tech text-xs font-bold"
        style={{ backgroundColor: colorDef.hex }}
      >
        <span>{code}</span>
      </div>
    </div>
  );
};
