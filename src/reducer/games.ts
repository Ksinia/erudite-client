import { createAction, createReducer } from '@reduxjs/toolkit';
import { IncomingMessageTypes } from '../constants/incomingMessageTypes';
import { Game, SparseCell } from './types';

export const gameUpdated = createAction<
  { gameId: number; game: Game },
  IncomingMessageTypes.GAME_UPDATED
>(IncomingMessageTypes.GAME_UPDATED);

export type GameUpdatedAction = ReturnType<typeof gameUpdated>;

const expandCells = (
  rows: number,
  cols: number,
  cells: SparseCell[]
): (string | null)[][] => {
  const board: (string | null)[][] = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(null));
  cells.forEach(([y, x, letter]) => {
    if (board[y] && board[y][x] !== undefined) {
      board[y][x] = letter;
    }
  });
  return board;
};

/**
 * An infinite board arrives as its occupied cells plus the dimensions,
 * because sending the whole grid costs the square of its side on every
 * update. Classic games keep arriving as plain grids.
 */
export const expandBoards = (game: Game): Game => {
  if (!game || !game.boardSize || !game.boardCells) {
    return game;
  }
  const { rows, cols } = game.boardSize;
  return {
    ...game,
    board: expandCells(rows, cols, game.boardCells),
    previousBoard: expandCells(rows, cols, game.previousBoardCells || []),
  };
};

export default createReducer<{ [key in Game['id']]: Game }>({}, (builder) =>
  builder.addCase(gameUpdated, (state, action) => {
    state[action.payload.gameId] = expandBoards(action.payload.game);
  })
);
