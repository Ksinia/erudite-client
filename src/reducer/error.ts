import {
  LOGIN_SUCCESS,
  LOGIN_OR_SIGNUP_ERROR,
  CLEAR_ERROR,
} from "../actions/authorization";
import { AnyAction } from "redux";

export default function reducer(state = null, action: AnyAction) {
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
