import { BoardState } from '^/shared/types';
import type { Coords } from '^/shared/types';
import { isValidMove } from './is-valid-move';

export function getAvailableMoves(
  board: BoardState[][],
  selected: Coords,
): Coords[] {
  if (
    selected.row < 0 ||
    selected.row >= 7 ||
    selected.col < 0 ||
    selected.col >= 7
  ) {
    return [];
  }

  if (board[selected.row][selected.col] !== BoardState.BALL) {
    return [];
  }

  const moves: Coords[] = [];

  // 상하좌우 2칸 떨어진 위치들을 확인
  const directions = [
    { row: -2, col: 0 },
    { row: 2, col: 0 },
    { row: 0, col: -2 },
    { row: 0, col: 2 },
  ];

  for (const dir of directions) {
    const dest: Coords = {
      row: selected.row + dir.row,
      col: selected.col + dir.col,
    };

    if (isValidMove(board, selected, dest)) {
      moves.push(dest);
    }
  }

  return moves;
}
