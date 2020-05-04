import { Game, Action } from "./types";

export default function reducer(
  state: { [key in Game["id"]]: Game } = {},
  action: Action
) {
  switch (action.type) {
    case "GAME_UPDATED": {
      return { ...state, [action.payload.gameId]: action.payload.game };
    }
    default:
      return state;
  }
}
