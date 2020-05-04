import {
  LOGIN_SUCCESS,
  LOGIN_OR_SIGNUP_ERROR,
  CLEAR_ERROR,
} from "../actions/authorization";
import { Action } from "./types";

export default function reducer(state = null, action: Action) {
  switch (action.type) {
    case LOGIN_OR_SIGNUP_ERROR: {
      return action.payload;
    }
    case LOGIN_SUCCESS: {
      return null;
    }
    case CLEAR_ERROR: {
      return null;
    }
    default:
      return state;
  }
}
