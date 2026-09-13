import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LcarsButton } from '../components/lcars/LcarsButton';
import { sounds } from '../audio/soundEngine';
import {
  Dir,
  SIZE,
  WIN_TILE,
  canMove,
  hasWon,
  isLost,
  move,
  newBoard,
  spawnTile,
} from '../services/merge2048';

const STORAGE_KEY = 'lcars_2048';
const SWIPE_MIN = 28;

interface SavedGame {
  board: number[];
  score: number;
  best: number;
  won: boolean;
  keepPlaying: boolean;
}

function loadGame(): SavedGame | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SavedGame;
    if (!Array.isArray(data.board) || data.board.length !== SIZE * SIZE) return null;
    return data;
  } catch {
    return null;
  }
}

function tileStyle(value: number): { bg: string; fg: string } {
  switch (value) {
    case 2: return { bg: '#666666', fg: '#000000' };
    case 4: return { bg: '#99CCFF', fg: '#000000' };
    case 8: return { bg: '#336699', fg: '#FFFFFF' };
    case 16: return { bg: '#CC99CC', fg: '#000000' };
    case 32: return { bg: '#FF9900', fg: '#000000' };
    case 64: return { bg: '#FFCC00', fg: '#000000' };
    case 128: return { bg: '#FF5500', fg: '#000000' };
    case 256: return { bg: '#FF6666', fg: '#000000' };
    case 512: return { bg: '#CC0000', fg: '#FFFFFF' };
    case 1024: return { bg: '#FFB347', fg: '#000000' };
    default: return { bg: '#99CCFF', fg: '#000000' };
  }
}

export const Merge2048Screen: React.FC = () => {
  const [initial] = useState<SavedGame>(() => {
    const saved = loadGame();
    if (saved) return saved;
    return { board: newBoard(), score: 0, best: 0, won: false, keepPlaying: false };
  });

  const [board, setBoard] = useState<number[]>(initial.board);
  const [score, setScore] = useState(initial.score);
  const [best, setBest] = useState(initial.best);
  const [won, setWon] = useState(initial.won);
  const [keepPlaying, setKeepPlaying] = useState(initial.keepPlaying);
  const [status, setStatus] = useState('WARP MERGE ONLINE');
  const pointer = useRef<{ x: number; y: number } | null>(null);

  const lost = isLost(board);
  const showWin = won && !keepPlaying;

  useEffect(() => {
    const payload: SavedGame = { board, score, best, won, keepPlaying };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [board, score, best, won, keepPlaying]);

  const applyMove = useCallback(
    (dir: Dir) => {
      if (showWin || lost) return;
      const result = move(board, dir);
      if (!result.moved) return;

      const next = spawnTile(result.board);
      const nextScore = score + result.score;
      setBoard(next);
      setScore(nextScore);
      if (nextScore > best) setBest(nextScore);

      if (!won && hasWon(next)) {
        setWon(true);
        setStatus(`MISSION ACCOMPLISHED // ${WIN_TILE}`);
        sounds.playTouch('done_lcars_4');
        return;
      }

      if (isLost(next)) {
        setStatus('GRID LOCKED // NO MOVES');
        sounds.playTouch('err_lcars_6');
        return;
      }

      if (result.merged) {
        setStatus(`MERGE // +${result.score}`);
        sounds.playTouch();
      } else {
        setStatus(`SLIDE ${dir.toUpperCase()}`);
        sounds.playTouch('beep_soft');
      }
    },
    [board, score, best, won, showWin, lost],
  );

  const reset = () => {
    setBoard(newBoard());
    setScore(0);
    setWon(false);
    setKeepPlaying(false);
    setStatus('NEW GRID READY');
    sounds.playTouch('start_lcars_3');
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        a: 'left',
        s: 'down',
        d: 'right',
      };
      const dir = map[e.key] ?? map[e.key.toLowerCase()];
      if (!dir) return;
      e.preventDefault();
      applyMove(dir);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [applyMove]);

  const onPointerDown = (e: React.PointerEvent) => {
    pointer.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const start = pointer.current;
    pointer.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_MIN) return;
    if (Math.abs(dx) > Math.abs(dy)) applyMove(dx > 0 ? 'right' : 'left');
    else applyMove(dy > 0 ? 'down' : 'up');
  };

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden gap-2 p-0.5">
      <div className="flex items-center justify-between gap-2 px-2 py-1.5 bg-zinc-900/80 border-l-4 border-[#FFCC00] rounded-r-md shrink-0 min-w-0">
        <div className="min-w-0">
          <span className="font-lcars text-sm sm:text-base font-bold text-[#FFCC00] tracking-wider block truncate">
            2048 {won ? '// SOLVED' : lost ? '// LOCKED' : ''}
          </span>
          <span className="font-mono-tech text-[10px] text-zinc-400 truncate block">
            SCORE {score} // BEST {best} // {status}
          </span>
        </div>
      </div>

      <div className="@container flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden">
        <div
          className="aspect-square w-[min(100cqw,100cqh)] h-[min(100cqw,100cqh)] max-w-full max-h-full relative touch-none"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => { pointer.current = null; }}
        >
          <div className="grid grid-cols-4 grid-rows-4 gap-1 w-full h-full bg-black p-1 border-2 border-[#FFCC00]">
            {board.map((value, i) => {
              const style = value === 0 ? null : tileStyle(value);
              return (
                <div
                  key={i}
                  className="flex items-center justify-center min-w-0 min-h-0 rounded-sm font-lcars font-bold"
                  style={{
                    backgroundColor: style?.bg ?? '#111111',
                    color: style?.fg ?? '#333333',
                    fontSize: value >= 1024
                      ? 'clamp(0.85rem,8cqi,2.4rem)'
                      : 'clamp(1.1rem,11cqi,3.2rem)',
                    boxShadow: value >= WIN_TILE
                      ? 'inset 0 0 0 2px #FFCC00, inset 0 0 12px rgba(153,204,255,0.7)'
                      : undefined,
                  }}
                >
                  {value || ''}
                </div>
              );
            })}
          </div>

          {(showWin || lost) && (
            <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-2 p-3">
              <span className="font-lcars text-lg font-bold text-[#FFCC00] tracking-wider">
                {showWin ? 'PROGRAM COMPLETE' : 'NEGATIVE'}
              </span>
              <span className="font-mono-tech text-xs text-zinc-400">
                {showWin ? `${WIN_TILE} TILE STABILIZED` : 'NO LEGAL SLIDES REMAIN'}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 grid grid-cols-3 gap-0.5 max-w-[280px] mx-auto w-full">
        <div />
        <LcarsButton color="gold" pill="both" className="!px-1 !py-2 text-sm" soundType="none" onClick={() => applyMove('up')}>
          ▲
        </LcarsButton>
        <div />
        <LcarsButton color="gold" pill="left" className="!px-1 !py-2 text-sm" soundType="none" onClick={() => applyMove('left')}>
          ◀
        </LcarsButton>
        <LcarsButton color="gold" pill="none" className="!px-1 !py-2 text-sm" soundType="none" onClick={() => applyMove('down')}>
          ▼
        </LcarsButton>
        <LcarsButton color="gold" pill="right" className="!px-1 !py-2 text-sm" soundType="none" onClick={() => applyMove('right')}>
          ▶
        </LcarsButton>
      </div>

      <div className="shrink-0 grid grid-cols-2 gap-0.5">
        {showWin ? (
          <LcarsButton
            color="ice"
            pill="left"
            className="!px-1 !py-1.5 text-[10px]"
            soundType="none"
            onClick={() => {
              setKeepPlaying(true);
              setStatus('CONTINUE // OPEN GRID');
              sounds.playAcknowledge();
            }}
          >
            CONTINUE
          </LcarsButton>
        ) : (
          <LcarsButton color="gray" pill="left" className="!px-1 !py-1.5 text-[10px]" disabled>
            {lost ? 'LOCKED' : canMove(board) ? 'SLIDE' : 'READY'}
          </LcarsButton>
        )}
        <LcarsButton color="amber" pill="right" className="!px-1 !py-1.5 text-[10px]" soundType="none" onClick={reset}>
          NEW GRID
        </LcarsButton>
      </div>
    </div>
  );
};
