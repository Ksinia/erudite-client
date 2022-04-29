import { AnyAction } from "redux";

import {
  ALL_GAMES,
  UPDATED_GAME_IN_LOBBY,
  DELETE_GAME_IN_LOBBY,
} from "../constants/incomingMessageTypes";
import { Game } from "./types";

export default function reducer(state: Game[] = [], action: AnyAction) {
  switch (action.type) {
    case ALL_GAMES: {
      return action.payload;
    }
    case UPDATED_GAME_IN_LOBBY: {
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
    case DELETE_GAME_IN_LOBBY: {
      return state.filter((game) => game.id !== parseInt(action.payload));
    }
    default:
      return state;
  }
}
