import { BoardState } from '^/shared/types';

export type GameResult = 'MAVERICK_END' | 'KOISHI_END' | 'YASUO_END' | null;

export function getGameResult(board: BoardState[][]): GameResult {
  let ballCount = 0;
  let ballPosition: { row: number; col: number } | null = null;

  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 7; col++) {
      if (board[row][col] === BoardState.BALL) {
        ballCount++;
        ballPosition = { row, col };
      }
    }
  }

  if (ballCount === 1 && ballPosition) {
    // 정중앙은 (3, 3)
    if (ballPosition.row === 3 && ballPosition.col === 3) {
      return 'MAVERICK_END';
    } else {
      return 'KOISHI_END';
    }
  }

  if (ballCount > 1) {
    return 'YASUO_END';
  }

  return null;
}
