export type Difficulty = 'easy' | 'medium' | 'hard';

export const DIFFICULTY_HOLES: Record<Difficulty, number> = {
  easy: 40,
  medium: 50,
  hard: 58,
};

export function idx(row: number, col: number): number {
  return row * 9 + col;
}

export function rowCol(i: number): [number, number] {
  return [Math.floor(i / 9), i % 9];
}

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function isPlacementValid(board: number[], pos: number, n: number): boolean {
  if (n < 1 || n > 9) return false;
  const [r, c] = rowCol(pos);
  for (let i = 0; i < 9; i++) {
    if (i !== c && board[idx(r, i)] === n) return false;
    if (i !== r && board[idx(i, c)] === n) return false;
  }
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let dr = 0; dr < 3; dr++) {
    for (let dc = 0; dc < 3; dc++) {
      const p = idx(br + dr, bc + dc);
      if (p !== pos && board[p] === n) return false;
    }
  }
  return true;
}

function findEmpty(board: number[]): number {
  return board.findIndex((v) => v === 0);
}

function countSolutions(board: number[], limit = 2): number {
  const pos = findEmpty(board);
  if (pos === -1) return 1;
  let found = 0;
  for (const n of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
    if (!isPlacementValid(board, pos, n)) continue;
    board[pos] = n;
    found += countSolutions(board, limit);
    board[pos] = 0;
    if (found >= limit) return found;
  }
  return found;
}

function fillBoard(board: number[]): boolean {
  const pos = findEmpty(board);
  if (pos === -1) return true;
  for (const n of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
    if (!isPlacementValid(board, pos, n)) continue;
    board[pos] = n;
    if (fillBoard(board)) return true;
    board[pos] = 0;
  }
  return false;
}

export function generatePuzzle(difficulty: Difficulty): {
  puzzle: number[];
  solution: number[];
} {
  const solution = Array(81).fill(0);
  fillBoard(solution);

  const puzzle = [...solution];
  const order = shuffle([...Array(81).keys()]);
  let removed = 0;
  const target = DIFFICULTY_HOLES[difficulty];

  for (const pos of order) {
    if (removed >= target) break;
    const saved = puzzle[pos];
    puzzle[pos] = 0;
    const copy = [...puzzle];
    if (countSolutions(copy, 2) !== 1) {
      puzzle[pos] = saved;
    } else {
      removed++;
    }
  }

  return { puzzle, solution };
}

export function conflictsAt(board: number[], pos: number): boolean {
  const n = board[pos];
  if (n === 0) return false;
  return !isPlacementValid(board, pos, n);
}

/** User-entered digit that is not the puzzle solution, even if it does not clash in row/col/box. */
export function isWrongEntry(
  board: number[],
  solution: number[],
  pos: number,
  given: boolean,
): boolean {
  if (given || board[pos] === 0) return false;
  return board[pos] !== solution[pos];
}

export function isBadCell(
  board: number[],
  solution: number[],
  pos: number,
  given: boolean,
): boolean {
  return conflictsAt(board, pos) || isWrongEntry(board, solution, pos, given);
}

export function isComplete(board: number[], solution: number[]): boolean {
  return board.every((n, i) => n === solution[i]);
}

export function givenMask(puzzle: number[]): boolean[] {
  return puzzle.map((n) => n !== 0);
}
