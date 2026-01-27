import { describe, it, expect } from 'vitest';
import { BoardState } from '^/shared/types';
import { hasAnyMovableBall } from './has-any-movable-ball';

describe('hasAnyMovableBall', () => {
  it('should return true when there are movable balls', () => {
    const board: BoardState[][] = [
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
      [BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL],
      [BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.EMPTY, BoardState.BALL, BoardState.BALL, BoardState.BALL],
      [BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.BALL],
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.BALL, BoardState.BALL, BoardState.BALL, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
    ];
    const result = hasAnyMovableBall(board);
    expect(result).toBe(true);
  });

  it('should return false when there are no movable balls', () => {
    const board: BoardState[][] = [
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
      [BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY],
      [BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.BALL, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY],
      [BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY],
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
      [BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE, BoardState.EMPTY, BoardState.EMPTY, BoardState.EMPTY, BoardState.NOT_APPLICABLE, BoardState.NOT_APPLICABLE],
    ];
    const result = hasAnyMovableBall(board);
    expect(result).toBe(false);
  });
});
