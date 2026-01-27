import { describe, it, expect } from 'vitest';
import { BoardState } from '^/shared/types';
import { getAvailableMoves } from './get-available-moves';

describe('getAvailableMoves', () => {
  const initialBoard: BoardState[][] = [
    [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
    [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
    [BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL],
    [BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.EMPTY, BoardState.BALL, BoardState.BALL, BoardState.BALL],
    [BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL],
    [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
    [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
  ];

  it('should return empty array for invalid coordinates', () => {
    const result = getAvailableMoves(initialBoard, { row: -1, col: 0 });
    expect(result).toEqual([]);
  });

  it('should return empty array when selected cell is not a ball', () => {
    const result = getAvailableMoves(initialBoard, { row: 3, col: 3 });
    expect(result).toEqual([]);
  });

  it('should return available moves for a ball with valid moves', () => {
    const result = getAvailableMoves(initialBoard, { row: 3, col: 1 });
    expect(result.length).toBeGreaterThan(0);
    expect(result).toContainEqual({ row: 3, col: 3 });
  });

  it('should return empty array for a ball with no valid moves', () => {
    const board: BoardState[][] = [
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
      [BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL],
      [BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.EMPTY, BoardState.BALL, BoardState.BALL, BoardState.BALL],
      [BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL],
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
    ];
    // 0,2 위치의 구슬은 이동할 수 없음 (위로는 범위 밖, 아래로는 중간에 구슬이 없음)
    const result = getAvailableMoves(board, { row: 0, col: 2 });
    expect(result).toEqual([]);
  });
});
