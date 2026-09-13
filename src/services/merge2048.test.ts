import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  canMove,
  emptyBoard,
  hasWon,
  isLost,
  move,
  spawnTile,
} from './merge2048.ts';

test('2 and 2 slide together into 4', () => {
  const board = emptyBoard();
  board[0] = 2;
  board[1] = 2;
  const result = move(board, 'left');
  assert.deepEqual(result.board.slice(0, 4), [4, 0, 0, 0]);
  assert.equal(result.score, 4);
  assert.equal(result.moved, true);
  assert.equal(result.merged, true);
});

test('a tile merges at most once per move', () => {
  const board = emptyBoard();
  board[0] = 2;
  board[1] = 2;
  board[2] = 2;
  const result = move(board, 'left');
  assert.deepEqual(result.board.slice(0, 4), [4, 2, 0, 0]);
  assert.equal(result.score, 4);
});

test('four 2s become two 4s, not an 8', () => {
  const board = emptyBoard();
  board[0] = 2;
  board[1] = 2;
  board[2] = 2;
  board[3] = 2;
  const result = move(board, 'left');
  assert.deepEqual(result.board.slice(0, 4), [4, 4, 0, 0]);
  assert.equal(result.score, 8);
});

test('right slide packs to the right edge', () => {
  const board = emptyBoard();
  board[0] = 2;
  board[2] = 2;
  const result = move(board, 'right');
  assert.deepEqual(result.board.slice(0, 4), [0, 0, 0, 4]);
});

test('up slide merges a column', () => {
  const board = emptyBoard();
  board[0] = 4;
  board[4] = 4;
  const result = move(board, 'up');
  assert.equal(result.board[0], 8);
  assert.equal(result.board[4], 0);
  assert.equal(result.score, 8);
});

test('blocked board reports no move', () => {
  const board = emptyBoard();
  board[0] = 2;
  board[1] = 4;
  const result = move(board, 'left');
  assert.equal(result.moved, false);
  assert.equal(result.score, 0);
  assert.deepEqual(result.board, board);
});

test('2048 tile counts as a win', () => {
  const board = emptyBoard();
  board[0] = 2048;
  assert.equal(hasWon(board), true);
  assert.equal(hasWon(emptyBoard()), false);
});

test('full board with a merge still has a move', () => {
  const board = [
    2, 4, 8, 16,
    2, 32, 64, 128,
    256, 512, 1024, 8,
    16, 32, 64, 128,
  ];
  assert.equal(canMove(board), true);
  assert.equal(isLost(board), false);
});

test('full board with no merges is lost', () => {
  const board = [
    2, 4, 8, 16,
    4, 8, 16, 32,
    8, 16, 32, 64,
    16, 32, 64, 128,
  ];
  assert.equal(canMove(board), false);
  assert.equal(isLost(board), true);
});

test('spawn fills an empty cell with 2 or 4', () => {
  const board = emptyBoard();
  let n = 0;
  const next = spawnTile(board, () => {
    n += 1;
    return 0;
  });
  assert.equal(next.filter((v) => v !== 0).length, 1);
  assert.ok(next.includes(2) || next.includes(4));
  assert.ok(n >= 1);
});
