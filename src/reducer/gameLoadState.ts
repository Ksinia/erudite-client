import { createAction, createReducer } from '@reduxjs/toolkit';
import { InternalMessageTypes } from '../constants/internalMessageTypes';
import { gameUpdated } from './games';
import { Game } from './types';

/**
 * Why a game could not be loaded. A game the user may not see is reported
 * by the server as a missing one, so it arrives as a null game rather than
 * through here; 'not_found' only covers endpoints that still answer 404.
 * 'unavailable' means the request never reached the server, 'error' that
 * the server answered with a failure.
 */
export type GameLoadFailure = 'not_found' | 'unavailable' | 'error';

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
