import { describe, it, expect } from 'vitest';
import { BoardState } from '^/shared/types';
import { getGameResult } from './get-game-result';

describe('getGameResult', () => {
  it('should return MAVERICK_END when one ball is at center', () => {
    const board: BoardState[][] = [
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
      [BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY],
      [BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.BALL, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY],
      [BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY],
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
    ];
    const result = getGameResult(board);
    expect(result).toBe('MAVERICK_END');
  });

  it('should return KOISHI_END when one ball is not at center', () => {
    const board: BoardState[][] = [
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
      [BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY],
      [BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY],
      [BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY],
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.BALL, BoardState.EMPTY, BoardState.EMPTY, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
    ];
    const result = getGameResult(board);
    expect(result).toBe('KOISHI_END');
  });

  it('should return YASUO_END when multiple balls remain', () => {
    const board: BoardState[][] = [
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
      [BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY],
      [BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY],
      [BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY],
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.BALL, BoardState.BALL, BoardState.EMPTY, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
    ];
    const result = getGameResult(board);
    expect(result).toBe('YASUO_END');
  });

  it('should return null when no balls remain', () => {
    const board: BoardState[][] = [
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
      [BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY],
      [BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY],
      [BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY],
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
    ];
    const result = getGameResult(board);
    expect(result).toBe(null);
  });
});
