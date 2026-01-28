import { BoardState } from '^/shared/types';

import { getAvailableMoves } from './get-available-moves';

export function hasAnyMovableBall(board: BoardState[][]): boolean {
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 7; col++) {
      if (board[row][col] === BoardState.BALL) {
        const availableMoves = getAvailableMoves(board, { row, col });
        if (availableMoves.length > 0) {
          return true;
        }
      }
    }
  }

  return false;
}
