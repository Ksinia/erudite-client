import {
  ALL_GAMES,
  DELETE_GAME_IN_LOBBY,
  IncomingMessageTypes,
  UPDATED_GAME_IN_LOBBY,
} from '../constants/incomingMessageTypes';
import { Game } from './types';

export default function reducer(
  state: Game[] = [],
  action: ALL_GAMES | UPDATED_GAME_IN_LOBBY | DELETE_GAME_IN_LOBBY
) {
  switch (action.type) {
    case IncomingMessageTypes.ALL_GAMES: {
      return action.payload;
    }
    case IncomingMessageTypes.UPDATED_GAME_IN_LOBBY: {
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
    }
    case IncomingMessageTypes.DELETE_GAME_IN_LOBBY: {
      return state.filter((game) => game.id !== action.payload);
    }
    default:
      return state;
  }
}
