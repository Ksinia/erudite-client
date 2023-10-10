import {
  CLEAR_ERROR,
  InternalMessageTypes,
  LOGIN_OR_SIGNUP_ERROR,
} from '../constants/internalMessageTypes';
import {
  IncomingMessageTypes,
  LOGIN_SUCCESS,
} from '../constants/incomingMessageTypes';

export default function reducer(
  state = null,
  action: LOGIN_SUCCESS | LOGIN_OR_SIGNUP_ERROR | CLEAR_ERROR
) {
  switch (action.type) {
    case InternalMessageTypes.LOGIN_OR_SIGNUP_ERROR: {
      return action.payload;
    }
    case IncomingMessageTypes.LOGIN_SUCCESS: {
      return null;
    }
    case InternalMessageTypes.CLEAR_ERROR: {
      return null;
    }
    default:
      return state;
  }
}
