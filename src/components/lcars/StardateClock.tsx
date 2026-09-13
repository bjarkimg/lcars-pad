import React, { useState, useEffect } from 'react';

// Calculates standard 24th Century Stardate (TNG style)
function calculateStardate(date: Date): string {
  const year = date.getUTCFullYear();
  // Reference epoch: 2323.0 = Stardate 00000.0
  const yearStart = new Date(Date.UTC(year, 0, 1)).getTime();
  const yearEnd = new Date(Date.UTC(year + 1, 0, 1)).getTime();
  const fraction = (date.getTime() - yearStart) / (yearEnd - yearStart);
  
  // TNG base offset ~40000 at 2364
  const stardateValue = (year - 2323) * 1000 + fraction * 1000 + 40000;
  return stardateValue.toFixed(1);
}

export const StardateClock: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const stardate = calculateStardate(time);
  const timeString = time.toLocaleTimeString([], { hour12: false });
  const dateString = time.toISOString().split('T')[0];

  return (
    <div className="flex items-center space-x-3 text-xs sm:text-sm font-mono-tech select-none">
      <div className="flex flex-col text-right">
        <span className="text-[#FFCC00] font-bold text-sm sm:text-base tracking-widest">
          SD {stardate}
        </span>
        <span className="text-zinc-400 text-[10px] sm:text-xs">
          {dateString} // {timeString}
        </span>
      </div>
      <div className="w-1.5 h-6 bg-[#FF9900] rounded-full animate-pulse" />
    </div>
  );
};
