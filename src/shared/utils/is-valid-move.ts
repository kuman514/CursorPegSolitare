import { BoardState } from '../types';
import type { Coords } from '../types';

export function isValidMove(
  board: BoardState[][],
  orig: Coords,
  dest: Coords,
): boolean {
  // 좌표 범위 체크
  if (
    orig.row < 0 ||
    orig.row >= 7 ||
    orig.col < 0 ||
    orig.col >= 7 ||
    dest.row < 0 ||
    dest.row >= 7 ||
    dest.col < 0 ||
    dest.col >= 7
  ) {
    return false;
  }

  // 같은 행이면서 열이 2칸 차이나거나, 같은 열이면서 행이 2칸 차이나야 함
  const isSameRow =
    orig.row === dest.row && Math.abs(orig.col - dest.col) === 2;
  const isSameCol =
    orig.col === dest.col && Math.abs(orig.row - dest.row) === 2;

  if (!isSameRow && !isSameCol) {
    return false;
  }

  // orig에 구슬이 있어야 함
  if (board[orig.row][orig.col] !== BoardState.BALL) {
    return false;
  }

  // dest가 빈 공간이어야 함
  if (board[dest.row][dest.col] !== BoardState.EMPTY) {
    return false;
  }

  // orig와 dest 사이의 한 칸에 구슬이 있어야 함
  const middleRow = (orig.row + dest.row) / 2;
  const middleCol = (orig.col + dest.col) / 2;

  if (board[middleRow][middleCol] !== BoardState.BALL) {
    return false;
  }

  return true;
}
