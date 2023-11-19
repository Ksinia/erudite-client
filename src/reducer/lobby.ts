import { createAction, createReducer } from '@reduxjs/toolkit';
import { IncomingMessageTypes } from '../constants/incomingMessageTypes';
import { Game } from './types';

export const allGamesLoaded = createAction<
  Game[],
  IncomingMessageTypes.ALL_GAMES
>(IncomingMessageTypes.ALL_GAMES);

export const updatedGameInLobby = createAction<
  Game,
  IncomingMessageTypes.UPDATED_GAME_IN_LOBBY
>(IncomingMessageTypes.UPDATED_GAME_IN_LOBBY);

export const deleteGameInLobby = createAction<
  string,
  IncomingMessageTypes.DELETE_GAME_IN_LOBBY
>(IncomingMessageTypes.DELETE_GAME_IN_LOBBY);

export default createReducer<Game[]>([], (builder) =>
  builder
    .addCase(allGamesLoaded, (_, action) => action.payload)
    .addCase(updatedGameInLobby, (state, action) => {
      const updatedGame = action.payload;
      let gameFound = false;
      let newState = state.map((game) => {
        if (game.id === updatedGame.id) {
          gameFound = true;
          return updatedGame;
        } else {
          return game;
        }
      });
      if (!gameFound) {
        newState.push(updatedGame);
      }
      return newState;
    })
    .addCase(deleteGameInLobby, (state, action) =>
      state.filter((game) => game.id !== parseInt(action.payload))
    )
);
