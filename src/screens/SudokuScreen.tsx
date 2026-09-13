import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { LcarsButton } from '../components/lcars/LcarsButton';
import { sounds } from '../audio/soundEngine';
import {
  Difficulty,
  generatePuzzle,
  givenMask,
  isBadCell,
  isComplete,
} from '../services/sudoku';

const STORAGE_KEY = 'lcars_sudoku';

interface SavedGame {
  puzzle: number[];
  solution: number[];
  grid: number[];
  notes: number[][];
  difficulty: Difficulty;
  selected: number | null;
}

const emptyNotes = (): number[][] => Array.from({ length: 81 }, () => []);

function loadGame(): SavedGame | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SavedGame;
    if (!Array.isArray(data.puzzle) || data.puzzle.length !== 81) return null;
    return data;
  } catch {
    return null;
  }
}

function boxClass(row: number, col: number): string {
  const thickR = col === 2 || col === 5 ? 'border-r-2 border-r-[#FF9900]' : 'border-r border-r-zinc-800';
  const thickB = row === 2 || row === 5 ? 'border-b-2 border-b-[#FF9900]' : 'border-b border-b-zinc-800';
  const left = col === 0 ? 'border-l-2 border-l-[#FF9900]' : '';
  const top = row === 0 ? 'border-t-2 border-t-[#FF9900]' : '';
  return `${left} ${top} ${thickR} ${thickB}`;
}

export const SudokuScreen: React.FC = () => {
  const [initial] = useState<SavedGame>(() => {
    const saved = loadGame();
    if (saved) return saved;
    const gen = generatePuzzle('easy');
    return {
      puzzle: gen.puzzle,
      solution: gen.solution,
      grid: [...gen.puzzle],
      notes: emptyNotes(),
      difficulty: 'easy',
      selected: null,
    };
  });

  const [puzzle, setPuzzle] = useState<number[]>(initial.puzzle);
  const [solution, setSolution] = useState<number[]>(initial.solution);
  const [grid, setGrid] = useState<number[]>(initial.grid);
  const [notes, setNotes] = useState<number[][]>(initial.notes ?? emptyNotes());
  const [difficulty, setDifficulty] = useState<Difficulty>(initial.difficulty);
  const [selected, setSelected] = useState<number | null>(initial.selected);
  const [noteMode, setNoteMode] = useState(false);
  const [status, setStatus] = useState('LOGIC GRID ONLINE');
  const [won, setWon] = useState(false);
  const [busy, setBusy] = useState(false);

  const givens = useMemo(() => givenMask(puzzle), [puzzle]);

  useEffect(() => {
    const payload: SavedGame = { puzzle, solution, grid, notes, difficulty, selected };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [puzzle, solution, grid, notes, difficulty, selected]);

  const selectedValue = selected !== null ? grid[selected] : 0;

  const newGame = (level: Difficulty) => {
    setBusy(true);
    setStatus(`GENERATING ${level.toUpperCase()} PUZZLE...`);
    window.setTimeout(() => {
      const gen = generatePuzzle(level);
      setPuzzle(gen.puzzle);
      setSolution(gen.solution);
      setGrid([...gen.puzzle]);
      setNotes(emptyNotes());
      setDifficulty(level);
      setSelected(null);
      setWon(false);
      setBusy(false);
      setStatus(`${level.toUpperCase()} GRID READY`);
      sounds.playAcknowledge();
    }, 40);
  };

  const placeNumber = useCallback(
    (n: number) => {
      if (selected === null || givens[selected] || won) return;
      if (noteMode) {
        sounds.playTouch();
        setNotes((prev) => {
          const next = prev.map((cell) => [...cell]);
          const cell = next[selected];
          next[selected] = cell.includes(n) ? cell.filter((v) => v !== n) : [...cell, n].sort();
          return next;
        });
        setGrid((prev) => {
          const next = [...prev];
          next[selected] = 0;
          return next;
        });
        return;
      }

      const clearing = grid[selected] === n;
      const next = [...grid];
      next[selected] = clearing ? 0 : n;
      setGrid(next);
      setNotes((prev) => {
        const copy = prev.map((cell) => [...cell]);
        copy[selected] = [];
        return copy;
      });

      if (isComplete(next, solution)) {
        setWon(true);
        setStatus('MISSION ACCOMPLISHED // PUZZLE COMPLETE');
        sounds.playTouch('done_lcars_4');
      } else if (next[selected] !== 0 && next[selected] !== solution[selected]) {
        setStatus('CONFLICT DETECTED');
        sounds.playTouch('err_lcars_6');
      } else if (clearing) {
        setStatus('CELL CLEARED');
        sounds.playTouch();
      } else {
        setStatus(`ENTRY ${n} CONFIRMED`);
        sounds.playAffirmative();
      }
    },
    [selected, givens, won, noteMode, solution, grid],
  );

  const clearCell = () => {
    if (selected === null || givens[selected] || won) return;
    setGrid((prev) => {
      const next = [...prev];
      next[selected] = 0;
      return next;
    });
    setNotes((prev) => {
      const next = prev.map((cell) => [...cell]);
      next[selected] = [];
      return next;
    });
    setStatus('CELL CLEARED');
  };

  const hint = () => {
    if (won) return;
    const empties = grid.map((n, i) => (n === 0 && !givens[i] ? i : -1)).filter((i) => i >= 0);
    const target = selected !== null && !givens[selected] && grid[selected] !== solution[selected]
      ? selected
      : empties[Math.floor(Math.random() * empties.length)];
    if (target === undefined) return;
    setSelected(target);
    setGrid((prev) => {
      const next = [...prev];
      next[target] = solution[target];
      if (isComplete(next, solution)) {
        setWon(true);
        setStatus('MISSION ACCOMPLISHED // PUZZLE COMPLETE');
        sounds.playTouch('done_lcars_4');
      } else {
        setStatus(`HINT // ${solution[target]}`);
        sounds.playAffirmative();
      }
      return next;
    });
    setNotes((prev) => {
      const next = prev.map((cell) => [...cell]);
      next[target] = [];
      return next;
    });
  };

  const remaining = grid.filter((n) => n === 0).length;

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden gap-2 p-0.5">
      <div className="flex items-center justify-between gap-2 px-2 py-1.5 bg-zinc-900/80 border-l-4 border-[#99CCFF] rounded-r-md shrink-0 min-w-0">
        <div className="min-w-0">
          <span className="font-lcars text-sm sm:text-base font-bold text-[#99CCFF] tracking-wider block truncate">
            SUDOKU {won ? '// SOLVED' : ''}
          </span>
          <span className="font-mono-tech text-[10px] text-zinc-400 truncate block">
            {difficulty.toUpperCase()} // {remaining} OPEN // {status}
          </span>
        </div>
      </div>

      <div className="@container flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden">
        <div className="aspect-square w-[min(100cqw,100cqh)] h-[min(100cqw,100cqh)] max-w-full max-h-full">
          <div className="grid grid-cols-9 grid-rows-9 w-full h-full bg-black border-2 border-[#FF9900]">
            {grid.map((value, i) => {
              const [row, col] = [Math.floor(i / 9), i % 9];
              const isGiven = givens[i];
              const isSel = selected === i;
              const conflict = isBadCell(grid, solution, i, isGiven);
              const same = selectedValue !== 0 && value === selectedValue;
              const [sr, sc] = selected !== null ? [Math.floor(selected / 9), selected % 9] : [-1, -1];
              const inLine = selected !== null && (row === sr || col === sc);
              const inBox =
                selected !== null &&
                Math.floor(row / 3) === Math.floor(sr / 3) &&
                Math.floor(col / 3) === Math.floor(sc / 3);

              let color = 'text-[#FF9900]';
              if (!isGiven) color = conflict ? 'text-[#FF6666]' : 'text-[#99CCFF]';
              if (isGiven) color = 'text-[#FFCC00]';

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setSelected(i);
                    sounds.playTouch();
                  }}
                  className={`
                    relative z-0 flex items-center justify-center min-w-0 min-h-0
                    text-[clamp(0.8rem,4.6cqi,2.4rem)] font-lcars font-bold
                    ${boxClass(row, col)}
                    ${isSel ? 'bg-[#FF9900]/40' : same ? 'bg-[#99CCFF]/30' : inBox || inLine ? 'bg-[#FF9900]/10' : 'bg-black'}
                  `}
                  style={
                    isSel
                      ? { boxShadow: 'inset 0 0 0 2px #FFCC00, inset 0 0 10px rgba(255,153,0,0.55)' }
                      : same
                        ? { boxShadow: 'inset 0 0 0 2px #99CCFF, inset 0 0 12px rgba(153,204,255,0.55)' }
                        : undefined
                  }
                >
                  {value !== 0 ? (
                    <span className={color}>{value}</span>
                  ) : notes[i]?.length ? (
                    <span className="grid grid-cols-3 w-full h-full p-px text-[clamp(0.4rem,1.6cqi,0.9rem)] font-mono-tech text-zinc-500 leading-none">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                        <span key={n} className="flex items-center justify-center">
                          {notes[i].includes(n) ? n : ''}
                        </span>
                      ))}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="shrink-0 grid grid-cols-9 gap-0.5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <LcarsButton
            key={n}
            color={selectedValue === n ? 'gold' : 'gray'}
            pill="both"
            className="!px-0 !py-1.5 min-w-0 text-sm"
            soundType="none"
            onClick={() => placeNumber(n)}
          >
            {n}
          </LcarsButton>
        ))}
      </div>

      <div className="shrink-0 grid grid-cols-6 gap-0.5">
        <LcarsButton color="salmon" pill="left" className="!px-1 !py-1.5 text-[10px] min-w-0" onClick={clearCell}>
          CLR
        </LcarsButton>
        <LcarsButton
          color={noteMode ? 'ice' : 'gray'}
          pill="none"
          className="!px-1 !py-1.5 text-[10px] min-w-0"
          onClick={() => setNoteMode((v) => !v)}
        >
          {noteMode ? 'NOTE*' : 'NOTE'}
        </LcarsButton>
        <LcarsButton
          color="amber"
          pill="none"
          className="!px-1 !py-1.5 text-[10px] min-w-0"
          onClick={hint}
          disabled={won || busy}
        >
          HINT
        </LcarsButton>
        {(['easy', 'medium', 'hard'] as Difficulty[]).map((level, i) => (
          <LcarsButton
            key={level}
            color={difficulty === level ? 'ice' : 'gray'}
            pill={i === 2 ? 'right' : 'none'}
            className="!px-1 !py-1.5 text-[10px] min-w-0"
            disabled={busy}
            onClick={() => newGame(level)}
          >
            {level === 'easy' ? 'EZ' : level === 'medium' ? 'MED' : 'HRD'}
          </LcarsButton>
        ))}
      </div>
    </div>
  );
};
