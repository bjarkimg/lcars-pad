import React from 'react';
import { FOLD_VIEWPORTS, readFrameParam } from '../foldViewports';

export const FoldShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = readFrameParam();
  if (!frame) {
    return <>{children}</>;
  }

  const vp = FOLD_VIEWPORTS[frame];
  return (
    <div className="w-full h-full min-h-[100dvh] bg-[#161616] flex flex-col items-center justify-center gap-2 p-3">
      <button
        type="button"
        className="font-mono-tech text-[10px] text-[#FFCC00] tracking-wider cursor-pointer bg-transparent border-0"
        onClick={() => {
          const url = new URL(window.location.href);
          url.searchParams.delete('frame');
          window.location.href = url.toString();
        }}
      >
        FOLD FRAME // {vp.label} {vp.width}×{vp.height} // {vp.ratio} // EXIT
      </button>
      <div
        className="relative overflow-hidden bg-black shrink-0"
        style={{
          width: vp.width,
          height: vp.height,
          boxShadow: '0 0 0 2px #FF9900, 0 0 24px rgba(255,153,0,0.25)',
        }}
      >
        <div className="w-full h-full overflow-hidden">{children}</div>
      </div>
    </div>
  );
};
