import { LOGIN_SUCCESS, LOGOUT } from "../actions/authorization";
import { User, Action } from "./types";

export default function reducer(state: User = null, action: Action) {
  switch (action.type) {
    case LOGIN_SUCCESS: {
      return action.payload;
    }
    case LOGOUT: {
      return null;
    }
    default:
      return state;
  }
}
