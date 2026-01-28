import { describe, it, expect, beforeEach } from 'vitest';

import { BoardState } from '^/shared/types';
import { INITIAL_BOARD } from '^/shared/constants/initial-board';
import { INITIAL_SELECTED } from '^/shared/constants/initial-selected';

import { useGameStore } from './game-store';

describe('game-store', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  describe('initial state', () => {
    it('should have correct initial board', () => {
      const board = useGameStore.getState().board;
      expect(board).toEqual(INITIAL_BOARD.map((row) => [...row]));
    });

    it('should have empty history', () => {
      const history = useGameStore.getState().history;
      expect(history).toEqual([]);
    });

    it('should have undoCount of 0', () => {
      const undoCount = useGameStore.getState().undoCount;
      expect(undoCount).toBe(0);
    });

    it('should have initial selected', () => {
      const selected = useGameStore.getState().selected;
      expect(selected).toEqual(INITIAL_SELECTED);
    });
  });

  describe('move', () => {
    it('should move ball successfully', () => {
      // 3,1에서 3,3으로 이동 (중간에 3,2에 구슬이 있음)
      useGameStore.getState().move({ row: 3, col: 1 }, { row: 3, col: 3 });

      const newBoard = useGameStore.getState().board;
      expect(newBoard[3][1]).toBe(BoardState.EMPTY);
      expect(newBoard[3][2]).toBe(BoardState.EMPTY);
      expect(newBoard[3][3]).toBe(BoardState.BALL);
    });

    it('should not move if move is invalid', () => {
      const { move, board } = useGameStore.getState();
      const originalBoard = board.map((row) => [...row]);

      // 잘못된 이동 시도
      move({ row: 3, col: 3 }, { row: 3, col: 5 });

      const newBoard = useGameStore.getState().board;
      expect(newBoard).toEqual(originalBoard);
    });

    it('should update history after successful move', () => {
      const { move } = useGameStore.getState();

      move({ row: 3, col: 1 }, { row: 3, col: 3 });

      const history = useGameStore.getState().history;
      expect(history.length).toBe(1);
      expect(history[0]).toEqual({
        orig: { row: 3, col: 1 },
        dest: { row: 3, col: 3 },
      });
    });

    it('should reset undoCount and selected after move', () => {
      const { move, undo } = useGameStore.getState();

      move({ row: 3, col: 1 }, { row: 3, col: 3 });
      undo(); // undoCount가 1이 됨
      move({ row: 3, col: 5 }, { row: 3, col: 3 });

      const { undoCount, selected } = useGameStore.getState();
      expect(undoCount).toBe(0);
      expect(selected).toEqual(INITIAL_SELECTED);
    });
  });

  describe('undo', () => {
    it('should undo last move', () => {
      const { move, undo } = useGameStore.getState();

      move({ row: 3, col: 1 }, { row: 3, col: 3 });
      undo();

      const board = useGameStore.getState().board;
      expect(board[3][1]).toBe(BoardState.BALL);
      expect(board[3][2]).toBe(BoardState.BALL);
      expect(board[3][3]).toBe(BoardState.EMPTY);
    });

    it('should not undo if history is empty', () => {
      const { undo, board } = useGameStore.getState();
      const originalBoard = board.map((row) => [...row]);

      undo();

      const newBoard = useGameStore.getState().board;
      expect(newBoard).toEqual(originalBoard);
    });

    it('should increment undoCount after undo', () => {
      const { move, undo } = useGameStore.getState();

      move({ row: 3, col: 1 }, { row: 3, col: 3 });
      undo();

      const undoCount = useGameStore.getState().undoCount;
      expect(undoCount).toBe(1);
    });

    it('should reset selected after undo', () => {
      const { move, undo, selectTile } = useGameStore.getState();

      move({ row: 3, col: 1 }, { row: 3, col: 3 });
      selectTile({ row: 2, col: 2 });
      undo();

      const selected = useGameStore.getState().selected;
      expect(selected).toEqual(INITIAL_SELECTED);
    });
  });

  describe('redo', () => {
    it('should redo last undone move', () => {
      const { move, undo, redo } = useGameStore.getState();

      move({ row: 3, col: 1 }, { row: 3, col: 3 });
      undo();
      redo();

      const board = useGameStore.getState().board;
      expect(board[3][1]).toBe(BoardState.EMPTY);
      expect(board[3][2]).toBe(BoardState.EMPTY);
      expect(board[3][3]).toBe(BoardState.BALL);
    });

    it('should not redo if undoCount is 0', () => {
      const { move, redo } = useGameStore.getState();

      move({ row: 3, col: 1 }, { row: 3, col: 3 });
      const boardAfterMove = useGameStore
        .getState()
        .board.map((row) => [...row]);

      redo();

      const newBoard = useGameStore.getState().board;
      expect(newBoard).toEqual(boardAfterMove);
    });

    it('should decrement undoCount after redo', () => {
      const { move, undo, redo } = useGameStore.getState();

      move({ row: 3, col: 1 }, { row: 3, col: 3 });
      undo();
      redo();

      const undoCount = useGameStore.getState().undoCount;
      expect(undoCount).toBe(0);
    });

    it('should reset selected after redo', () => {
      const { move, undo, redo, selectTile } = useGameStore.getState();

      move({ row: 3, col: 1 }, { row: 3, col: 3 });
      undo();
      selectTile({ row: 2, col: 2 });
      redo();

      const selected = useGameStore.getState().selected;
      expect(selected).toEqual(INITIAL_SELECTED);
    });
  });

  describe('reset', () => {
    it('should reset all state to initial', () => {
      const { move, reset } = useGameStore.getState();

      move({ row: 3, col: 1 }, { row: 3, col: 3 });
      reset();

      const { board, history, undoCount, selected } = useGameStore.getState();
      expect(board).toEqual(INITIAL_BOARD.map((row) => [...row]));
      expect(history).toEqual([]);
      expect(undoCount).toBe(0);
      expect(selected).toEqual(INITIAL_SELECTED);
    });
  });

  describe('selectTile', () => {
    it('should select a ball tile', () => {
      const { selectTile } = useGameStore.getState();

      selectTile({ row: 3, col: 1 });

      const selected = useGameStore.getState().selected;
      expect(selected).toEqual({ row: 3, col: 1 });
    });

    it('should deselect when clicking same tile', () => {
      const { selectTile } = useGameStore.getState();

      selectTile({ row: 3, col: 1 });
      selectTile({ row: 3, col: 1 });

      const selected = useGameStore.getState().selected;
      expect(selected).toEqual(INITIAL_SELECTED);
    });
  });
});
