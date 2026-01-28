import { BoardState } from '^/shared/types';
import type { Coords } from '^/shared/types';
import { useGameStore } from '^/entities/game-store/game-store';
import { getAvailableMoves } from '^/features/game-logic';
import styles from './tile-button.module.css';

interface TileButtonProps {
  row: number;
  col: number;
}

export function TileButton({ row, col }: TileButtonProps) {
  const board = useGameStore((state) => state.board);
  const selected = useGameStore((state) => state.selected);
  const move = useGameStore((state) => state.move);
  const selectTile = useGameStore((state) => state.selectTile);

  const boardState = board[row][col];
  const isSelected = selected.row === row && selected.col === col;
  const availableMoves = getAvailableMoves(board, selected);
  const isAvailableMove = availableMoves.some(
    (move) => move.row === row && move.col === col,
  );

  const handleClick = () => {
    switch (boardState) {
      case BoardState.BALL:
        selectTile({ row, col });
        break;
      case BoardState.EMPTY:
        if (isAvailableMove) {
          move(selected, { row, col });
        }
        break;
    }
  };

  switch (boardState) {
    case BoardState.BALL:
      return (
        <button
          className={`${styles.tile} ${styles.ball} ${
            isSelected ? styles.selected : ''
          }`}
          onClick={handleClick}
        >
          <div className={styles.ballCircle} />
        </button>
      );
    case BoardState.EMPTY:
      return (
        <button
          className={`${styles.tile} ${styles.empty} ${
            isAvailableMove ? styles.availableMove : ''
          }`}
          onClick={handleClick}
        >
          {/* 빈 내용 */}
        </button>
      );
    case BoardState.NOT_APPLICABLE:
      return (
        <button className={styles.tile} disabled>
          {/* 빈 내용 */}
        </button>
      );
    default:
      return null;
  }

  return null;
}
