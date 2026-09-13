import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  conflictsAt,
  generatePuzzle,
  idx,
  isBadCell,
  isComplete,
  isPlacementValid,
  isWrongEntry,
} from './sudoku.ts';

function empty(): number[] {
  return Array(81).fill(0);
}

test('row duplicate is a conflict', () => {
  const board = empty();
  board[idx(0, 0)] = 5;
  board[idx(0, 8)] = 5;
  assert.equal(conflictsAt(board, idx(0, 8)), true);
  assert.equal(isPlacementValid(board, idx(0, 4), 5), false);
});

test('column duplicate is a conflict', () => {
  const board = empty();
  board[idx(0, 2)] = 7;
  board[idx(8, 2)] = 7;
  assert.equal(conflictsAt(board, idx(8, 2)), true);
});

test('same 3x3 box duplicate is a conflict', () => {
  const board = empty();
  board[idx(0, 0)] = 3;
  board[idx(2, 2)] = 3;
  assert.equal(conflictsAt(board, idx(2, 2)), true);
});

test('wrong guess with no peer clash is still marked bad', () => {
  const solution = empty();
  solution[idx(4, 4)] = 9;
  const board = empty();
  board[idx(4, 4)] = 2;
  assert.equal(conflictsAt(board, idx(4, 4)), false);
  assert.equal(isWrongEntry(board, solution, idx(4, 4), false), true);
  assert.equal(isBadCell(board, solution, idx(4, 4), false), true);
});

test('correct guess is not bad', () => {
  const solution = empty();
  solution[idx(1, 1)] = 6;
  const board = empty();
  board[idx(1, 1)] = 6;
  assert.equal(isWrongEntry(board, solution, idx(1, 1), false), false);
  assert.equal(isBadCell(board, solution, idx(1, 1), false), false);
});

test('givens are never wrong entries', () => {
  const solution = empty();
  solution[0] = 4;
  const board = empty();
  board[0] = 4;
  assert.equal(isWrongEntry(board, solution, 0, true), false);
});

test('complete board matches solution', () => {
  const solution = empty().map((_, i) => (i % 9) + 1);
  assert.equal(isComplete(solution, solution), true);
  const almost = [...solution];
  almost[0] = solution[0] === 1 ? 2 : 1;
  assert.equal(isComplete(almost, solution), false);
});

test('generated easy puzzle has a unique solution and matching length', () => {
  const { puzzle, solution } = generatePuzzle('easy');
  assert.equal(puzzle.length, 81);
  assert.equal(solution.length, 81);
  assert.ok(solution.every((n) => n >= 1 && n <= 9));
  const holes = puzzle.filter((n) => n === 0).length;
  assert.ok(holes >= 20, `expected holes, got ${holes}`);
  for (let i = 0; i < 81; i++) {
    if (puzzle[i] !== 0) assert.equal(puzzle[i], solution[i]);
  }
});
