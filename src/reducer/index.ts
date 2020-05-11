import { combineReducers } from "redux";

import translation from "../components/Translation/reducer";
import user from "./auth";
import error from "./error";
import lobby from "./lobby";
import games from "./games";

export const rootReducer = combineReducers({
  user,
  error,
  lobby,
  games,
  translation,
});

export type RootState = ReturnType<typeof rootReducer>;
