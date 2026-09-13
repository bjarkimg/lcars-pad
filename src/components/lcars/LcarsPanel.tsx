import React from 'react';
import { LCARS_COLORS, LcarsColor } from '../../theme/lcarsPalette';

interface LcarsPanelProps {
  title?: string;
  code?: string;
  color?: LcarsColor;
  headerColor?: LcarsColor;
  children: React.ReactNode;
  className?: string;
}

export const LcarsPanel: React.FC<LcarsPanelProps> = ({
  title,
  code,
  color = 'gold',
  headerColor = 'ice',
  children,
  className = ''
}) => {
  const borderCol = LCARS_COLORS[color] || LCARS_COLORS.gold;
  const headCol = LCARS_COLORS[headerColor] || LCARS_COLORS.ice;

  return (
    <div className={`flex flex-col bg-black/60 border-l-4 rounded-r-md p-3 sm:p-4 ${className}`} style={{ borderColor: borderCol.hex }}>
      {(title || code) && (
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-800">
          {title && (
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: headCol.hex }} />
              <h3 className="font-lcars text-base sm:text-lg font-bold tracking-wider" style={{ color: headCol.hex }}>
                {title}
              </h3>
            </div>
          )}
          {code && (
            <span className="font-mono-tech text-xs opacity-60 text-zinc-400">
              {code}
            </span>
          )}
        </div>
      )}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

interface LcarsMeterProps {
  label: string;
  value: number; // 0 - 100
  color?: LcarsColor;
  code?: string;
}

export const LcarsMeter: React.FC<LcarsMeterProps> = ({
  label,
  value,
  color = 'gold',
  code
}) => {
  const col = LCARS_COLORS[color] || LCARS_COLORS.gold;
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="flex flex-col space-y-1 my-2">
      <div className="flex justify-between items-center text-xs">
        <span className="font-lcars font-bold uppercase tracking-wider text-zinc-300">
          {label}
        </span>
        <span className="font-mono-tech font-bold" style={{ color: col.hex }}>
          {code ? `${code} // ` : ''}{Math.round(clamped)}%
        </span>
      </div>
      <div className="h-4 w-full bg-zinc-900 rounded-sm overflow-hidden flex p-0.5 border border-zinc-800">
        <div 
          className="h-full rounded-xs transition-all duration-300"
          style={{ 
            width: `${clamped}%`, 
            backgroundColor: col.hex 
          }} 
        />
      </div>
    </div>
  );
};
