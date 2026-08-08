import { createAction, createReducer } from '@reduxjs/toolkit';
import { InternalMessageTypes } from '../constants/internalMessageTypes';
import { gameUpdated } from './games';
import { Game } from './types';

/**
 * Why a game could not be loaded. 'not_found' also covers games the user
 * has no access to: the server answers 404 for those, without revealing
 * that they exist.
 */
export type GameLoadFailure = 'not_found' | 'unavailable';

export const gameLoadFailed = createAction<
  { gameId: Game['id']; reason: GameLoadFailure },
  InternalMessageTypes.GAME_LOAD_FAILED
>(InternalMessageTypes.GAME_LOAD_FAILED);

export type GameLoadFailedAction = ReturnType<typeof gameLoadFailed>;

export default createReducer<{ [key in Game['id']]: GameLoadFailure }>(
  {},
  (builder) =>
    builder
      .addCase(gameLoadFailed, (state, action) => {
        state[action.payload.gameId] = action.payload.reason;
      })
      // the game arrived after all, over a retry or the socket
      .addCase(gameUpdated, (state, action) => {
        delete state[action.payload.gameId];
      })
);
