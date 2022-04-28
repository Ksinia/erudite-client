import { AnyAction } from "redux";
import { SOCKET_CONNECTED } from "../actions/user";
export default function reducer(
  state: SocketIOClient.Socket | null = null,
  action: AnyAction
) {
  switch (action.type) {
    case SOCKET_CONNECTED: {
      return action.payload;
    }
    default:
      return state;
  }
}
