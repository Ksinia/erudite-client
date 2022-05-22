import ReduxThunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSocketIoMiddleware from "redux-socket.io";
import io from "socket.io-client";
import { rootReducer } from "./reducer";
import { backendUrl } from "./runtime";
import {
  ADD_USER_TO_SOCKET,
  ADD_GAME_TO_SOCKET,
  ENTER_LOBBY,
  socketActions,
} from "./constants/outgoingMessageTypes";
import {
  SOCKET_CONNECTED,
  SOCKET_DISCONNECTED,
} from "./constants/internalMessageTypes";

const socket = io(backendUrl, {
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
  const locationArray = window.location.pathname.split("/");
  if (locationArray[1] === "game") {
    store.dispatch({
      type: ADD_GAME_TO_SOCKET,
      payload: locationArray[2],
    });
  } else if (locationArray[1] === "") {
    store.dispatch({
      type: ENTER_LOBBY,
    });
  }
  store.dispatch({
    type: SOCKET_CONNECTED,
  });
});

const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(ReduxThunk, socketIoMiddleware)
  )
);

export default store;
