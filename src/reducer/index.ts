import { combineReducers } from "redux";

import translation from "../components/Translation/reducer";
import user from "./auth";
import error from "./error";
import lobby from "./lobby";
import games from "./games";
import duplicatedWords from "./duplicatedWords";
import finishedGamesIds from "./finishedGamesIds";

export const rootReducer = combineReducers({
  user,
  error,
  lobby,
  games,
  translation,
  duplicatedWords,
  finishedGamesIds,
});

export type RootState = ReturnType<typeof rootReducer>;
