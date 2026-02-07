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
    execute: (action: any, emit: any, next: any, dispatch: any) => {
      // Log outgoing socket messages
      console.log('🔴 OUTGOING SOCKET MESSAGE:', {
        type: action.type,
        payload: action.payload,
        timestamp: new Date().toISOString(),
      });

      // Send the message
      emit('message', action);

      // Continue with Redux dispatch
      next(action);
    },
  }
);

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(ReduxThunk, socketIoMiddleware);
  },
});

socket.on('connect', () => {
  console.log('🔵 SOCKET CONNECTED', {
    timestamp: new Date().toISOString(),
  });
  store.dispatch(socketConnected());
});

socket.on('disconnect', () => {
  console.log('🔵 SOCKET DISCONNECTED', {
    timestamp: new Date().toISOString(),
  });
  store.dispatch(socketDisconnected());
});

socket.on('reconnect', () => {
  console.log('🔵 SOCKET RECONNECTED', {
    timestamp: new Date().toISOString(),
  });
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

// Add comprehensive logging for incoming socket messages
socket.on('message', (message: any) => {
  console.log('🟢 INCOMING SOCKET MESSAGE:', {
    type: message?.type,
    payload: message?.payload,
    timestamp: new Date().toISOString(),
  });
});

// Log socket errors
socket.on('error', (error: unknown) => {
  console.error('🔥 SOCKET ERROR:', {
    error: error,
    timestamp: new Date().toISOString(),
  });
});

// Log connection state changes
socket.on('connect_error', (error: any) => {
  console.error('🔥 SOCKET CONNECTION ERROR:', {
    error: error.message,
    timestamp: new Date().toISOString(),
  });
});

// Log when socket is connecting
socket.on('connecting', () => {
  console.log('🔵 SOCKET CONNECTING...', {
    timestamp: new Date().toISOString(),
  });
});

// Log reconnection attempts
socket.on('reconnect_attempt', (attemptNumber: number) => {
  console.log('🔵 SOCKET RECONNECT ATTEMPT:', {
    attempt: attemptNumber,
    timestamp: new Date().toISOString(),
  });
});

export type RootState = ReturnType<typeof store.getState>;

export { socket };
export default store;
