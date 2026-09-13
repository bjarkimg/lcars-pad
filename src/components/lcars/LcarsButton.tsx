import React from 'react';
import { LCARS_COLORS, LcarsColor } from '../../theme/lcarsPalette';
import { sounds } from '../../audio/soundEngine';

interface LcarsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: LcarsColor;
  code?: string;
  pill?: 'left' | 'right' | 'both' | 'none';
  variant?: 'solid' | 'outline' | 'subtle';
  soundType?: 'touch' | 'menu' | 'ack' | 'affirm' | 'error' | 'none';
  soundVariant?: number;
  wrap?: boolean;
}

export const LcarsButton: React.FC<LcarsButtonProps> = ({
  children,
  color = 'gold',
  code,
  pill = 'both',
  variant = 'solid',
  soundType = 'touch',
  soundVariant,
  wrap = false,
  onClick,
  className = '',
  disabled = false,
  ...props
}) => {
  const colorDef = LCARS_COLORS[color] || LCARS_COLORS.gold;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Direct immediate synchronous tactile pulse on user gesture
    if (sounds.getHaptics() && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(28);
      } catch {
        // Ignored
      }
    }

    if (disabled) {
      sounds.playError();
      return;
    }

    switch (soundType) {
      case 'none':
        break;
      case 'menu':
        sounds.playMenuTap();
        break;
      case 'ack':
        sounds.playAcknowledge();
        break;
      case 'affirm':
        sounds.playAffirmative();
        break;
      case 'error':
        sounds.playError();
        break;
      case 'touch':
      default:
        sounds.playTouch(typeof soundVariant === 'number' ? undefined : soundVariant);
        break;
    }

    if (onClick) {
      onClick(e);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    // Immediate physical touch contact haptic pulse (0ms latency before click)
    if (sounds.getHaptics() && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(35);
      } catch {
        // Ignored
      }
    }
    if (props.onPointerDown) {
      props.onPointerDown(e);
    }
  };

  const pillClass = 
    pill === 'left' ? 'rounded-l-full' :
    pill === 'right' ? 'rounded-r-full' :
    pill === 'both' ? 'rounded-full' : 'rounded-sm';

  const variantClass = 
    variant === 'solid' 
      ? `${colorDef.bg} text-black font-bold tracking-wider` 
      : variant === 'outline'
      ? `border-2 border-[${colorDef.hex}] ${colorDef.text} bg-transparent`
      : `bg-[${colorDef.hex}]/20 ${colorDef.text} border border-[${colorDef.hex}]/50`;

  return (
    <button
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative flex items-center px-2.5 sm:px-3.5 py-1.5 sm:py-2 
        text-xs sm:text-sm uppercase transition-all duration-75 
        active:scale-[0.97] active:brightness-125
        ${code ? 'justify-between' : 'justify-center'}
        ${pillClass}
        ${variantClass}
        ${colorDef.hover}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      <span className={`font-lcars font-bold leading-tight min-w-0 ${wrap ? 'whitespace-normal break-words' : 'truncate'} ${code ? 'text-left flex-1' : 'text-center w-full'}`}>{children}</span>
      {code && (
        <span className="font-mono-tech text-[9px] sm:text-[11px] opacity-75 ml-1.5 shrink-0">
          {code}
        </span>
      )}
    </button>
  );
};
