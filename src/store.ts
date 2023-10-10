import ReduxThunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
import { rootReducer } from './reducer';
import { backendUrl } from './runtime';
import {
  outgoingSocketActions,
  OutgoingMessageTypes,
} from './constants/outgoingMessageTypes';
import { InternalMessageTypes } from './constants/internalMessageTypes';
import { addGameToSocket } from './actions/game';
import { addUserToSocket } from './actions/user';

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
socket.on('connect', () => {
  store.dispatch({ type: InternalMessageTypes.SOCKET_CONNECTED });
});
socket.on('disconnect', () => {
  store.dispatch({ type: InternalMessageTypes.SOCKET_DISCONNECTED });
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
    store.dispatch({
      type: OutgoingMessageTypes.ENTER_LOBBY,
    });
  }
  store.dispatch({
    type: InternalMessageTypes.SOCKET_CONNECTED,
  });
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(ReduxThunk, socketIoMiddleware))
);

export default store;
