import { combineReducers } from "redux";

import translation from "../components/Translation/reducer";
import user from "./auth";
import error from "./error";
import lobby from "./lobby";
import games from "./games";
import duplicatedWords from "./duplicatedWords";
import finishedGames from "./finishedGames";
import chat from "./chat";
import messagesCount from "./messagesCount";

export const rootReducer = combineReducers({
  user,
  error,
  lobby,
  games,
  translation,
  duplicatedWords,
  finishedGames,
  chat,
  messagesCount,
});

export type RootState = ReturnType<typeof rootReducer>;
