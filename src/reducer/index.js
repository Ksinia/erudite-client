import { combineReducers } from "redux";
import user from "./auth";
import error from "./error";
import lobby from "./lobby";
import games from "./games";

export default combineReducers({
  user,
  error,
  lobby,
  games
});
