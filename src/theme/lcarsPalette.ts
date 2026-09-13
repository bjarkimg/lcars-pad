export type LcarsColor = 
  | 'gold' 
  | 'lilac' 
  | 'salmon' 
  | 'blue' 
  | 'ice' 
  | 'amber' 
  | 'red' 
  | 'orange' 
  | 'darkBlue'
  | 'gray';

export const LCARS_COLORS: Record<LcarsColor, { bg: string; text: string; hex: string; hover: string }> = {
  gold: {
    bg: 'bg-[#FF9900]',
    text: 'text-[#FF9900]',
    hex: '#FF9900',
    hover: 'hover:bg-[#FFB347]'
  },
  lilac: {
    bg: 'bg-[#CC99CC]',
    text: 'text-[#CC99CC]',
    hex: '#CC99CC',
    hover: 'hover:bg-[#D8B4D8]'
  },
  salmon: {
    bg: 'bg-[#FF6666]',
    text: 'text-[#FF6666]',
    hex: '#FF6666',
    hover: 'hover:bg-[#FF8585]'
  },
  blue: {
    bg: 'bg-[#336699]',
    text: 'text-[#336699]',
    hex: '#336699',
    hover: 'hover:bg-[#4D7EA8]'
  },
  ice: {
    bg: 'bg-[#99CCFF]',
    text: 'text-[#99CCFF]',
    hex: '#99CCFF',
    hover: 'hover:bg-[#B8DCFF]'
  },
  amber: {
    bg: 'bg-[#FFCC00]',
    text: 'text-[#FFCC00]',
    hex: '#FFCC00',
    hover: 'hover:bg-[#FFE066]'
  },
  red: {
    bg: 'bg-[#CC0000]',
    text: 'text-[#CC0000]',
    hex: '#CC0000',
    hover: 'hover:bg-[#FF3333]'
  },
  orange: {
    bg: 'bg-[#FF5500]',
    text: 'text-[#FF5500]',
    hex: '#FF5500',
    hover: 'hover:bg-[#FF7733]'
  },
  darkBlue: {
    bg: 'bg-[#1A365D]',
    text: 'text-[#1A365D]',
    hex: '#1A365D',
    hover: 'hover:bg-[#2A4365]'
  },
  gray: {
    bg: 'bg-[#666666]',
    text: 'text-[#666666]',
    hex: '#666666',
    hover: 'hover:bg-[#888888]'
  }
};

export type AlertLevel = 'normal' | 'yellow' | 'red';
