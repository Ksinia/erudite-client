import { AnyAction } from "redux";

import { Game } from "./types";

export default function reducer(state: Game[] = [], action: AnyAction) {
  switch (action.type) {
    case "ALL_GAMES": {
      return action.payload;
    }
    case "NEW_GAME": {
      return [...state, action.payload];
    }
    case "UPDATED_GAME_IN_LOBBY": {
      return state.map((game) => {
        if (game.id === action.payload.id) {
          return action.payload;
        } else {
          return game;
        }
      });
    }
    case "DELETE_GAME_IN_LOBBY": {
      return state.filter((game) => game.id !== parseInt(action.payload));
    }
    default:
      return state;
  }
}
