import { create } from 'zustand';

import { BoardState } from '^/shared/types';
import type { Coords, MoveHistory } from '^/shared/types';
import { INITIAL_BOARD } from '^/shared/constants/initial-board';
import { INITIAL_SELECTED } from '^/shared/constants/initial-selected';
import { isValidMove } from '^/features/game-logic';

interface GameStore {
  board: BoardState[][];
  history: MoveHistory[];
  undoCount: number;
  selected: Coords;
  move: (orig: Coords, dest: Coords) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  selectTile: (coords: Coords) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  board: INITIAL_BOARD.map((row) => [...row]),
  history: [],
  undoCount: 0,
  selected: INITIAL_SELECTED,

  move: (orig: Coords, dest: Coords) => {
    const { board, history, undoCount } = get();

    // 조건 체크
    if (!isValidMove(board, orig, dest)) {
      return;
    }

    // 보드 상태 업데이트
    const newBoard = board.map((row) => [...row]);

    // orig를 빈 공간으로
    newBoard[orig.row][orig.col] = BoardState.EMPTY;

    // dest를 구슬로
    newBoard[dest.row][dest.col] = BoardState.BALL;

    // 중간을 빈 공간으로
    const middleRow = (orig.row + dest.row) / 2;
    const middleCol = (orig.col + dest.col) / 2;
    newBoard[middleRow][middleCol] = BoardState.EMPTY;

    // history 업데이트
    const insertIndex = history.length - undoCount;
    const newHistory = [
      ...history.slice(0, insertIndex),
      { orig, dest },
      ...history.slice(insertIndex),
    ];

    set({
      board: newBoard,
      history: newHistory,
      undoCount: 0,
      selected: INITIAL_SELECTED,
    });
  },

  undo: () => {
    const { board, history, undoCount } = get();

    if (history.length === 0) {
      return;
    }

    const targetIndex = history.length - undoCount - 1;
    if (targetIndex < 0) {
      return;
    }

    const move = history[targetIndex];
    const { orig, dest } = move;

    // 보드 상태 되돌리기
    const newBoard = board.map((row) => [...row]);

    // dest에 있던 구슬을 orig로 되돌림
    newBoard[dest.row][dest.col] = BoardState.EMPTY;
    newBoard[orig.row][orig.col] = BoardState.BALL;

    // 중간에 구슬을 다시 되돌림
    const middleRow = (orig.row + dest.row) / 2;
    const middleCol = (orig.col + dest.col) / 2;
    newBoard[middleRow][middleCol] = BoardState.BALL;

    set({
      board: newBoard,
      undoCount: undoCount + 1,
      selected: INITIAL_SELECTED,
    });
  },

  redo: () => {
    const { board, history, undoCount } = get();

    if (undoCount === 0) {
      return;
    }

    const targetIndex = history.length - undoCount;
    const move = history[targetIndex];
    const { orig, dest } = move;

    // 보드 상태 다시 실행
    const newBoard = board.map((row) => [...row]);

    // orig에 있던 구슬을 dest로 이동
    newBoard[orig.row][orig.col] = BoardState.EMPTY;
    newBoard[dest.row][dest.col] = BoardState.BALL;

    // 중간을 빈 공간으로
    const middleRow = (orig.row + dest.row) / 2;
    const middleCol = (orig.col + dest.col) / 2;
    newBoard[middleRow][middleCol] = BoardState.EMPTY;

    set({
      board: newBoard,
      undoCount: undoCount - 1,
      selected: INITIAL_SELECTED,
    });
  },

  reset: () => {
    set({
      board: INITIAL_BOARD.map((row) => [...row]),
      history: [],
      undoCount: 0,
      selected: INITIAL_SELECTED,
    });
  },

  selectTile: (coords: Coords) => {
    const { board, selected } = get();

    // 같은 타일을 클릭하면 선택 해제
    if (selected.row === coords.row && selected.col === coords.col) {
      set({ selected: INITIAL_SELECTED });
      return;
    }

    // 구슬이 있는 타일만 선택 가능
    if (board[coords.row][coords.col] === BoardState.BALL) {
      set({ selected: coords });
    }
  },
}));
