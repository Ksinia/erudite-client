import { createAction, createReducer } from '@reduxjs/toolkit';
import { IncomingMessageTypes } from '../constants/incomingMessageTypes';
import { Game } from './types';

export const gameUpdated = createAction<
  { gameId: number; game: Game },
  IncomingMessageTypes.GAME_UPDATED
>(IncomingMessageTypes.GAME_UPDATED);

export type GameUpdatedAction = ReturnType<typeof gameUpdated>;

export default createReducer<{ [key in Game['id']]: Game }>({}, (builder) =>
  builder.addCase(gameUpdated, (state, action) => {
    state[action.payload.gameId] = action.payload.game;
  })
);
