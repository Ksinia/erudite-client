import { AnyAction } from "redux";

import {
  LOGIN_OR_SIGNUP_ERROR,
  CLEAR_ERROR,
} from "../constants/internalMessageTypes";
import { LOGIN_SUCCESS } from "../constants/incomingMessageTypes";

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
