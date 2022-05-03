import { combineReducers } from "redux";

import translation from "../components/Translation/reducer";
import user from "./auth";
import error from "./error";
import lobby from "./lobby";
import games from "./games";
import duplicatedWords from "./duplicatedWords";
import finishedGames from "./finishedGames";
import archivedGames from "./archivedGames";
import chat from "./chat";
import messagesCount from "./messagesCount";
import socketConnected from "./socketConnected";
import notificationsSupported from "./notificationsSupported";

export const rootReducer = combineReducers({
  user,
  error,
  lobby,
  games,
  translation,
  duplicatedWords,
  finishedGames,
  archivedGames,
  chat,
  messagesCount,
  socketConnected,
  notificationsSupported,
});

export type RootState = ReturnType<typeof rootReducer>;
