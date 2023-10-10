import {
  InternalMessageTypes,
  SOCKET_CONNECTED,
  SOCKET_DISCONNECTED,
} from '../constants/internalMessageTypes';
export default function reducer(
  state: boolean = false,
  action: SOCKET_CONNECTED | SOCKET_DISCONNECTED
) {
  switch (action.type) {
    case InternalMessageTypes.SOCKET_CONNECTED: {
      return true;
    }
    case InternalMessageTypes.SOCKET_DISCONNECTED: {
      return false;
    }
    default:
      return state;
  }
}
