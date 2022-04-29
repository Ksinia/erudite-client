import ReduxThunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSocketIoMiddleware from "redux-socket.io";
import io from "socket.io-client";
import { rootReducer } from "./reducer";
import { url } from "./url";
import { socketActions } from "./constants/outgoingMessageTypes";
import {
  SOCKET_CONNECTED,
  SOCKET_DISCONNECTED,
} from "./constants/internalMessageTypes";

const socket = io(url, {
  path: "/socket",
});
const socketIoMiddleware = createSocketIoMiddleware(socket, socketActions, {
  eventName: "message",
});
socket.on("connect", () => {
  store.dispatch({
    type: SOCKET_CONNECTED,
  });
});
socket.on("disconnect", () => {
  const action = {
    type: SOCKET_DISCONNECTED,
  };
  store.dispatch(action);
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(ReduxThunk, socketIoMiddleware))
);

export default store;
