import { combineReducers } from "redux";
import user from "./auth";
import error from "./error";
import lobby from "./lobby";
import games from "./games";
import translation from "../components/Translation/reducer";

export const rootReducer =  combineReducers({
  user,
  error,
  lobby,
  games,
  translation,
});

export type RootState = ReturnType<typeof rootReducer>