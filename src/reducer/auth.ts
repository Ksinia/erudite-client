import {
  ERROR,
  IncomingMessageTypes,
  LOGIN_SUCCESS,
} from '../constants/incomingMessageTypes';
import {
  InternalMessageTypes,
  LOGOUT,
} from '../constants/internalMessageTypes';
import { User } from './types';

export default function reducer(
  state: User | null = null,
  action: LOGIN_SUCCESS | LOGOUT | ERROR
) {
  switch (action.type) {
    case IncomingMessageTypes.LOGIN_SUCCESS: {
      return action.payload;
    }
    case InternalMessageTypes.LOGOUT: {
      return null;
    }
    case IncomingMessageTypes.ERROR: {
      return null;
    }
    default:
      return state;
  }
}
