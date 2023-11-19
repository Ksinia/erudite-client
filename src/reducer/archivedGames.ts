import { createAction, createReducer } from '@reduxjs/toolkit';
import { InternalMessageTypes } from '../constants/internalMessageTypes';
import { Game } from './types';

export const archivedGamesLoaded = createAction<
  Game[],
  InternalMessageTypes.ARCHIVED_GAMES
>(InternalMessageTypes.ARCHIVED_GAMES);

export type ArchivedGamesLoadedAction = ReturnType<typeof archivedGamesLoaded>;

export default createReducer<Game[]>([], (builder) =>
  builder.addCase(archivedGamesLoaded, (_, action) => action.payload)
);
