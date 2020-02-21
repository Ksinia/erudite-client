import { combineReducers } from "redux";
import user from "./auth";
import error from "./error";

export default combineReducers({
  user,
  error
});
