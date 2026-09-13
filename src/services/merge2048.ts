export type Dir = 'up' | 'down' | 'left' | 'right';

export const SIZE = 4;
export const WIN_TILE = 2048;

export function idx(row: number, col: number): number {
  return row * SIZE + col;
}

export function emptyBoard(): number[] {
  return Array(SIZE * SIZE).fill(0);
}

export interface MoveResult {
  board: number[];
  score: number;
  moved: boolean;
  merged: boolean;
  maxTile: number;
}

function lineTowardStart(values: number[]): { line: number[]; score: number; merged: boolean } {
  const tiles = values.filter((n) => n !== 0);
  const out: number[] = [];
  let score = 0;
  let merged = false;
  for (let i = 0; i < tiles.length; i++) {
    if (i + 1 < tiles.length && tiles[i] === tiles[i + 1]) {
      const next = tiles[i] * 2;
      out.push(next);
      score += next;
      merged = true;
      i += 1;
    } else {
      out.push(tiles[i]);
    }
  }
  while (out.length < SIZE) out.push(0);
  return { line: out, score, merged };
}

function readLine(board: number[], dir: Dir, i: number): number[] {
  const line: number[] = [];
  for (let k = 0; k < SIZE; k++) {
    if (dir === 'left') line.push(board[idx(i, k)]);
    else if (dir === 'right') line.push(board[idx(i, SIZE - 1 - k)]);
    else if (dir === 'up') line.push(board[idx(k, i)]);
    else line.push(board[idx(SIZE - 1 - k, i)]);
  }
  return line;
}

function writeLine(board: number[], dir: Dir, i: number, line: number[]): void {
  for (let k = 0; k < SIZE; k++) {
    if (dir === 'left') board[idx(i, k)] = line[k];
    else if (dir === 'right') board[idx(i, SIZE - 1 - k)] = line[k];
    else if (dir === 'up') board[idx(k, i)] = line[k];
    else board[idx(SIZE - 1 - k, i)] = line[k];
  }
}

export function move(board: number[], dir: Dir): MoveResult {
  const next = [...board];
  let score = 0;
  let merged = false;
  for (let i = 0; i < SIZE; i++) {
    const before = readLine(next, dir, i);
    const result = lineTowardStart(before);
    writeLine(next, dir, i, result.line);
    score += result.score;
    if (result.merged) merged = true;
  }
  const moved = next.some((v, i) => v !== board[i]);
  return {
    board: next,
    score,
    moved,
    merged,
    maxTile: Math.max(0, ...next),
  };
}

export function emptyCells(board: number[]): number[] {
  return board.map((v, i) => (v === 0 ? i : -1)).filter((i) => i >= 0);
}

export function spawnTile(
  board: number[],
  rand: () => number = Math.random,
): number[] {
  const spots = emptyCells(board);
  if (spots.length === 0) return board;
  const pos = spots[Math.floor(rand() * spots.length)];
  const next = [...board];
  next[pos] = rand() < 0.9 ? 2 : 4;
  return next;
}

export function newBoard(rand: () => number = Math.random): number[] {
  return spawnTile(spawnTile(emptyBoard(), rand), rand);
}

export function hasWon(board: number[]): boolean {
  return board.some((n) => n >= WIN_TILE);
}

export function canMove(board: number[]): boolean {
  if (emptyCells(board).length > 0) return true;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const v = board[idx(r, c)];
      if (c + 1 < SIZE && board[idx(r, c + 1)] === v) return true;
      if (r + 1 < SIZE && board[idx(r + 1, c)] === v) return true;
    }
  }
  return false;
}

export function isLost(board: number[]): boolean {
  return !canMove(board);
}
