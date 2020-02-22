import { combineReducers } from "redux";
import user from "./auth";
import error from "./error";
import lobby from "./lobby";

export default combineReducers({
  user,
  error,
  lobby
});
