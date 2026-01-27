import { describe, it, expect } from 'vitest';
import { BoardState } from '^/shared/types';
import { isValidMove } from './is-valid-move';

describe('isValidMove', () => {
  const initialBoard: BoardState[][] = [
    [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
    [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
    [BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL],
    [BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.EMPTY, BoardState.BALL, BoardState.BALL, BoardState.BALL],
    [BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL],
    [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
    [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
  ];

  it('should return true for valid horizontal move', () => {
    // 3,1에서 3,3으로 이동 (중간에 3,2에 구슬이 있음)
    const result = isValidMove(initialBoard, { row: 3, col: 1 }, { row: 3, col: 3 });
    expect(result).toBe(true);
  });

  it('should return true for valid vertical move', () => {
    // 1,3에서 3,3으로 이동 (중간에 2,3에 구슬이 있음)
    const result = isValidMove(initialBoard, { row: 1, col: 3 }, { row: 3, col: 3 });
    expect(result).toBe(true);
  });

  it('should return false when orig is out of bounds', () => {
    const result = isValidMove(initialBoard, { row: -1, col: 0 }, { row: 1, col: 0 });
    expect(result).toBe(false);
  });

  it('should return false when dest is out of bounds', () => {
    const result = isValidMove(initialBoard, { row: 0, col: 0 }, { row: 7, col: 0 });
    expect(result).toBe(false);
  });

  it('should return false when move is not exactly 2 cells away', () => {
    const result = isValidMove(initialBoard, { row: 3, col: 1 }, { row: 3, col: 2 });
    expect(result).toBe(false);
  });

  it('should return false when orig does not have a ball', () => {
    const result = isValidMove(initialBoard, { row: 3, col: 3 }, { row: 3, col: 5 });
    expect(result).toBe(false);
  });

  it('should return false when dest is not empty', () => {
    const result = isValidMove(initialBoard, { row: 3, col: 1 }, { row: 3, col: 4 });
    expect(result).toBe(false);
  });

  it('should return false when middle cell does not have a ball', () => {
    const board: BoardState[][] = [
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
      [BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL],
      [BoardState.BALL, BoardState.BALL, BoardState.EMPTY, BoardState.EMPTY, BoardState.BALL, BoardState.BALL, BoardState.BALL],
      [BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL],
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
    ];
    const result = isValidMove(board, { row: 3, col: 1 }, { row: 3, col: 3 });
    expect(result).toBe(false);
  });
});
