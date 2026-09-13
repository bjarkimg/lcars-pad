import React, { useRef, useState, useEffect } from 'react';
import { LCARS_COLORS, LcarsColor } from '../../theme/lcarsPalette';
import { sounds } from '../../audio/soundEngine';

export interface LcarsSliderProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  color?: LcarsColor;
  code?: string;
  formatValue?: (val: number) => string;
  showNudgeButtons?: boolean;
  disabled?: boolean;
  className?: string;
}

export const LcarsSlider: React.FC<LcarsSliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '%',
  color = 'gold',
  code,
  formatValue,
  showNudgeButtons = true,
  disabled = false,
  className = ''
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const lastSoundValue = useRef<number>(value);

  const col = LCARS_COLORS[color] || LCARS_COLORS.gold;
  const clamped = Math.min(max, Math.max(min, value));
  const percent = ((clamped - min) / (max - min)) * 100;

  const updateFromPosition = (clientX: number) => {
    if (!trackRef.current || disabled) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawVal = min + ratio * (max - min);
    const stepped = Math.round((rawVal - min) / step) * step + min;
    const finalVal = Math.min(max, Math.max(min, Number(stepped.toFixed(2))));

    if (finalVal !== clamped) {
      // Audio pip on step transition
      const diff = Math.abs(finalVal - lastSoundValue.current);
      const soundThreshold = (max - min) * 0.04;
      if (diff >= soundThreshold) {
        sounds.playSoftTap();
        lastSoundValue.current = finalVal;
      }
      onChange(finalVal);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromPosition(e.clientX);
    sounds.playSoftTap();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging && !disabled) {
      updateFromPosition(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignored
      }
    }
  };

  const nudge = (direction: -1 | 1) => {
    if (disabled) return;
    sounds.playSoftTap();
    const nextVal = Math.min(max, Math.max(min, Number((clamped + direction * step).toFixed(2))));
    onChange(nextVal);
  };

  const displayVal = formatValue ? formatValue(clamped) : `${Math.round(clamped)}${unit}`;

  return (
    <div className={`flex flex-col space-y-1.5 my-2 select-none ${disabled ? 'opacity-50' : ''} ${className}`}>
      {/* Header Info */}
      <div className="flex justify-between items-center text-xs">
        <span className="font-lcars font-bold uppercase tracking-wider text-zinc-300">
          {label}
        </span>
        <div className="flex items-center space-x-1.5">
          {code && (
            <span className="font-mono-tech text-zinc-500 text-[10px]">
              {code} //
            </span>
          )}
          <span 
            className={`font-mono-tech font-bold text-sm transition-colors ${
              isDragging ? 'text-white' : ''
            }`}
            style={{ color: isDragging ? '#FFFFFF' : col.hex }}
          >
            {displayVal}
          </span>
        </div>
      </div>

      {/* Interactive Slider Track */}
      <div className="flex items-center space-x-2">
        {showNudgeButtons && (
          <button
            type="button"
            disabled={disabled || clamped <= min}
            onClick={() => nudge(-1)}
            className="w-7 h-7 flex items-center justify-center bg-zinc-900 active:bg-zinc-800 rounded-l-full border border-zinc-800 font-mono-tech font-bold text-xs text-zinc-300 active:scale-95 transition-transform cursor-pointer"
          >
            -
          </button>
        )}

        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`
            relative flex-1 h-6 bg-zinc-950 rounded-sm overflow-hidden flex items-center p-0.5 border cursor-ew-resize touch-none transition-all
            ${isDragging ? 'border-amber-400 shadow-[0_0_12px_rgba(255,153,0,0.4)]' : 'border-zinc-800'}
          `}
        >
          {/* Segmented Background Graduations */}
          <div className="absolute inset-0 flex justify-between px-2 pointer-events-none opacity-25">
            {[...Array(20)].map((_, i) => (
              <span key={i} className="w-[1px] h-full bg-zinc-600" />
            ))}
          </div>

          {/* Active Fill Bar */}
          <div
            className="h-full rounded-xs transition-all duration-75 relative"
            style={{
              width: `${percent}%`,
              backgroundColor: col.hex
            }}
          >
            {/* Sliding Thumb Handle */}
            <div 
              className="absolute right-0 top-0 bottom-0 w-3 bg-white/90 rounded-r-xs shadow-md"
            />
          </div>
        </div>

        {showNudgeButtons && (
          <button
            type="button"
            disabled={disabled || clamped >= max}
            onClick={() => nudge(1)}
            className="w-7 h-7 flex items-center justify-center bg-zinc-900 active:bg-zinc-800 rounded-r-full border border-zinc-800 font-mono-tech font-bold text-xs text-zinc-300 active:scale-95 transition-transform cursor-pointer"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
};
