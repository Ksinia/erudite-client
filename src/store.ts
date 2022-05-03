import ReduxThunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSocketIoMiddleware from "redux-socket.io";
import io from "socket.io-client";
import { rootReducer } from "./reducer";
import { url } from "./url";
import {
  ADD_USER_TO_SOCKET,
  ADD_GAME_TO_SOCKET,
  socketActions,
} from "./constants/outgoingMessageTypes";
import {
  SOCKET_CONNECTED,
  SOCKET_DISCONNECTED,
} from "./constants/internalMessageTypes";
import notificationsMiddleware from "./notificationsMiddleware";

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
socket.on("reconnect", () => {
  if (store.getState().user) {
    store.dispatch({
      type: ADD_USER_TO_SOCKET,
      payload: store.getState().user.jwt,
    });
  }
  // TODO: add game to socket on reconnect
  // if (?) {
  //   store.dispatch({
  //     type: ADD_GAME_TO_SOCKET,
  //     payload: ?,
  //   });
  // }
  store.dispatch({
    type: SOCKET_CONNECTED,
  });
});

const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(ReduxThunk, socketIoMiddleware, notificationsMiddleware)
  )
);

export default store;
