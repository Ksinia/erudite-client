import { AnyAction } from "redux";

import { GAME_UPDATED } from "../constants/incomingMessageTypes";
import { Game } from "./types";

export default function reducer(
  state: { [key in Game["id"]]: Game } = {},
  action: AnyAction
) {
  switch (action.type) {
    case GAME_UPDATED: {
      return { ...state, [action.payload.gameId]: action.payload.game };
    }
    default:
      return state;
  }
}
