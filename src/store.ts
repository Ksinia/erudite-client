import ReduxThunk from 'redux-thunk';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducer';
import { backendUrl } from './runtime';
import { outgoingSocketActions } from './constants/outgoingMessageTypes';
import {
  socketConnected,
  socketDisconnected,
} from './reducer/socketConnectionState';
import {
  addGameToSocket,
  addUserToSocket,
  enterLobby,
} from './reducer/outgoingMessages';

const socket = io(backendUrl, {
  path: '/socket',
});
const socketIoMiddleware = createSocketIoMiddleware(
  socket,
  outgoingSocketActions,
  {
    eventName: 'message',
  }
);

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(ReduxThunk, socketIoMiddleware);
  },
});

socket.on('connect', () => {
  store.dispatch(socketConnected());
});
socket.on('disconnect', () => {
  store.dispatch(socketDisconnected());
});
socket.on('reconnect', () => {
  const user = store.getState().user;
  if (user) {
    store.dispatch(addUserToSocket(user.jwt));
  }
  const locationArray = window.location.pathname.split('/');
  if (locationArray[1] === 'game') {
    store.dispatch(addGameToSocket(parseInt(locationArray[2])));
  } else if (locationArray[1] === '') {
    store.dispatch(enterLobby());
  }
  store.dispatch(socketConnected());
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
