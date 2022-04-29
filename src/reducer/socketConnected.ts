import { AnyAction } from "redux";
import {
  SOCKET_CONNECTED,
  SOCKET_DISCONNECTED,
} from "../constants/internalMessageTypes";
export default function reducer(state: boolean = false, action: AnyAction) {
  switch (action.type) {
    case SOCKET_CONNECTED: {
      return true;
    }
    case SOCKET_DISCONNECTED: {
      return false;
    }
    default:
      return state;
  }
}
