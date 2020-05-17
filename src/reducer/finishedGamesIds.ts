import { AnyAction } from "redux";

import { FINISHED_GAMES } from "../actions/user";

export default function reducer(
  state: number[] | null = null,
  action: AnyAction
) {
  switch (action.type) {
    case FINISHED_GAMES: {
      return action.payload;
    }
    default:
      return state;
  }
}
