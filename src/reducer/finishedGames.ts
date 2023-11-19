import { createAction, createReducer } from '@reduxjs/toolkit';
import { InternalMessageTypes } from '../constants/internalMessageTypes';
import { Game } from './types';

export const finishedGamesLoaded = createAction<
  Game[],
  InternalMessageTypes.FINISHED_GAMES
>(InternalMessageTypes.FINISHED_GAMES);

export type FinishedGamesLoadedAction = ReturnType<typeof finishedGamesLoaded>;

export default createReducer<Game[]>([], (builder) =>
  builder.addCase(finishedGamesLoaded, (_, action) => action.payload)
);
