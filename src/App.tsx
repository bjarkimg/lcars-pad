import React, { useEffect, useState } from 'react';
import { StardateClock } from './components/lcars/StardateClock';
import { LcarsButton } from './components/lcars/LcarsButton';
import { HarnessScreen } from './screens/HarnessScreen';
import { SudokuScreen } from './screens/SudokuScreen';
import { Merge2048Screen } from './screens/Merge2048Screen';
import { AlertLevel, LCARS_COLORS } from './theme/lcarsPalette';
import { sounds } from './audio/soundEngine';

type ActiveTab = 'sudoku' | 'merge' | 'harness';

export const App: React.FC = () => {
  const getInitialTab = (): ActiveTab => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (['sudoku', 'merge', 'harness'].includes(hash)) return hash as ActiveTab;
    const tab = new URLSearchParams(window.location.search).get('tab')?.toLowerCase();
    if (tab && ['sudoku', 'merge', 'harness'].includes(tab)) return tab as ActiveTab;
    return 'sudoku';
  };

  const [activeTab, setActiveTab] = useState<ActiveTab>(getInitialTab);
  const [alertLevel, setAlertLevel] = useState<AlertLevel>('normal');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const syncTab = () => setActiveTab(getInitialTab());
    window.addEventListener('hashchange', syncTab);
    window.addEventListener('popstate', syncTab);
    return () => {
      window.removeEventListener('hashchange', syncTab);
      window.removeEventListener('popstate', syncTab);
    };
  }, []);

  useEffect(() => {
    const syncFs = () => {
      const doc = document as Document & { webkitFullscreenElement?: Element | null };
      setIsFullscreen(Boolean(document.fullscreenElement || doc.webkitFullscreenElement));
    };
    syncFs();
    document.addEventListener('fullscreenchange', syncFs);
    document.addEventListener('webkitfullscreenchange', syncFs);
    return () => {
      document.removeEventListener('fullscreenchange', syncFs);
      document.removeEventListener('webkitfullscreenchange', syncFs);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      const doc = document as Document & {
        webkitFullscreenElement?: Element | null;
        webkitExitFullscreen?: () => void;
      };
      const el = document.documentElement as HTMLElement & {
        webkitRequestFullscreen?: () => void;
      };
      const active = document.fullscreenElement || doc.webkitFullscreenElement;
      if (!active) {
        if (el.requestFullscreen) await el.requestFullscreen();
        else el.webkitRequestFullscreen?.();
      } else if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else {
        doc.webkitExitFullscreen?.();
      }
      sounds.playAcknowledge();
    } catch (err) {
      console.warn('Fullscreen toggle failed:', err);
      sounds.playError();
    }
  };

  const navItems: { id: ActiveTab; label: string; code: string; color: keyof typeof LCARS_COLORS }[] = [
    { id: 'sudoku', label: 'SUDOKU', code: 'SDK-06', color: 'ice' },
    { id: 'merge', label: '2048', code: 'MRG-08', color: 'amber' },
    { id: 'harness', label: 'AUDIO HARNESS', code: 'CFG-07', color: 'gold' },
  ];

  const handleTabSwitch = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  const primaryElbowColor = alertLevel === 'red' ? '#CC0000' : '#FF9900';
  const secondaryBarColor = alertLevel === 'red' ? '#990000' : '#CC99CC';

  return (
    <div className={`flex flex-col h-full min-h-0 w-full bg-black text-white overflow-hidden select-none font-lcars ${alertLevel === 'red' ? 'border-2 border-red-800' : ''}`}>
      <header className="flex items-center h-12 sm:h-14 w-full bg-black shrink-0 px-2 sm:px-4 pt-1 gap-2">
        <div
          className="flex items-center justify-between px-3 sm:px-5 h-10 sm:h-11 rounded-tl-2xl rounded-bl-sm text-black font-bold text-sm sm:text-base tracking-wider shrink-0"
          style={{ width: '135px', backgroundColor: primaryElbowColor }}
        >
          <span className="truncate">LCARS PAD</span>
          <span className="font-mono-tech text-[10px] sm:text-xs">PADD</span>
        </div>
        <div
          className="hidden sm:flex flex-1 h-10 sm:h-11 items-center justify-between px-4 text-black font-mono-tech text-xs font-bold rounded-sm"
          style={{ backgroundColor: secondaryBarColor }}
        >
          <span>PERSONAL ACCESS DISPLAY DEVICE // FOLD 8 ULTRA</span>
          <span>SYS 09-247</span>
        </div>
        <div className="sm:hidden flex-1" />
        <div className="shrink-0">
          <StardateClock />
        </div>
      </header>

      <div className="flex flex-1 w-full min-h-0 overflow-hidden p-1 sm:p-2 gap-1.5 sm:gap-3">
        <nav className="flex flex-col justify-between w-30 sm:w-44 bg-black/40 shrink-0 space-y-2 min-h-0">
          <div className="flex flex-col space-y-1.5 sm:space-y-2 overflow-y-auto min-h-0">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <LcarsButton
                  key={item.id}
                  color={item.color}
                  pill="left"
                  variant={isActive ? 'solid' : 'outline'}
                  code={item.code}
                  className="w-full py-2.5 sm:py-3 text-xs sm:text-sm"
                  soundType="menu"
                  onClick={() => handleTabSwitch(item.id)}
                >
                  {item.label}
                </LcarsButton>
              );
            })}
            <LcarsButton
              color="ice"
              pill="left"
              variant={isFullscreen ? 'solid' : 'outline'}
              code="FS"
              className="w-full py-2.5 sm:py-3 text-xs sm:text-sm"
              soundType="menu"
              onClick={() => void toggleFullscreen()}
            >
              {isFullscreen ? 'EXIT FULL' : 'FULLSCREEN'}
            </LcarsButton>
          </div>
          <div className="flex flex-col space-y-1.5 pt-2 border-t border-zinc-800">
            <span className="font-mono-tech text-[9px] sm:text-[10px] text-zinc-500 px-1">ALERT MODE</span>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => {
                  setAlertLevel('normal');
                  sounds.stopRedAlert();
                  sounds.playAcknowledge();
                }}
                className={`py-1 px-0.5 rounded-xs font-mono-tech text-[9px] sm:text-[10px] font-bold text-center cursor-pointer ${
                  alertLevel === 'normal' ? 'bg-[#99CCFF] text-black' : 'bg-zinc-900 text-[#99CCFF]'
                }`}
              >
                NORM
              </button>
              <button
                onClick={() => {
                  setAlertLevel('yellow');
                  sounds.playYellowAlert();
                }}
                className={`py-1 px-0.5 rounded-xs font-mono-tech text-[9px] sm:text-[10px] font-bold text-center cursor-pointer ${
                  alertLevel === 'yellow' ? 'bg-[#FFCC00] text-black font-extrabold' : 'bg-zinc-900 text-[#FFCC00]'
                }`}
              >
                YEL
              </button>
              <button
                onClick={() => {
                  if (alertLevel === 'red') {
                    setAlertLevel('normal');
                    sounds.stopRedAlert();
                    sounds.playAcknowledge();
                  } else {
                    setAlertLevel('red');
                    sounds.playRedAlert();
                  }
                }}
                className={`py-1 px-0.5 rounded-xs font-mono-tech text-[9px] sm:text-[10px] font-bold text-center cursor-pointer ${
                  alertLevel === 'red' ? 'bg-[#CC0000] text-black animate-pulse font-extrabold' : 'bg-zinc-900 text-[#FF6666]'
                }`}
              >
                RED
              </button>
            </div>
          </div>
        </nav>

        <main className="flex-1 h-full min-h-0 overflow-y-auto overflow-x-hidden bg-black/90 rounded-md border border-zinc-800/80 p-1.5 sm:p-2.5">
          {activeTab === 'sudoku' && <SudokuScreen />}
          {activeTab === 'merge' && <Merge2048Screen />}
          {activeTab === 'harness' && <HarnessScreen />}
        </main>
      </div>

      <footer className="flex items-center h-8 sm:h-9 w-full bg-black shrink-0 px-2 sm:px-4 pb-1 gap-2">
        <div
          className="h-full rounded-bl-2xl rounded-tl-sm px-3 flex items-center text-black font-mono-tech text-[10px] font-bold shrink-0"
          style={{ width: '150px', backgroundColor: secondaryBarColor }}
        >
          PADD MK-8
        </div>
        <div
          className="flex-1 h-full rounded-sm px-4 flex items-center justify-between text-black font-mono-tech text-[10px] font-bold"
          style={{ backgroundColor: primaryElbowColor }}
        >
          <span className="hidden sm:inline">FOLD 8 ULTRA // COVER 22:9 · INNER 9:10</span>
          <span>ONLINE // READY</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
