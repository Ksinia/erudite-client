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
import { refreshTokens } from './thunkActions/authorization';

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

let hasConnectedBefore = false;

socket.on('connect', () => {
  console.log('🔵 SOCKET CONNECTED, hasConnectedBefore:', hasConnectedBefore);
  store.dispatch(socketConnected());

  if (hasConnectedBefore) {
    const user = store.getState().user;
    if (user) {
      store.dispatch(addUserToSocket(user.jwt));
    }
    const locationArray = window.location.pathname.split('/');
    const gameId = parseInt(locationArray[2]);
    if (locationArray[1] === 'game' && !isNaN(gameId)) {
      store.dispatch(addGameToSocket(gameId));
    } else if (locationArray[1] === '') {
      store.dispatch(enterLobby());
    }
  }

  hasConnectedBefore = true;
});

socket.on('disconnect', () => {
  console.log('🔵 SOCKET DISCONNECTED', {
    timestamp: new Date().toISOString(),
  });
  store.dispatch(socketDisconnected());
});

let isRefreshing = false;

socket.on('message', (message: any) => {
  console.log('🟢 INCOMING SOCKET MESSAGE:', {
    type: message?.type,
    payload: message?.payload,
    timestamp: new Date().toISOString(),
  });

  if (message?.type === 'TOKEN_EXPIRED' && !isRefreshing) {
    isRefreshing = true;
    refreshTokens().then((result) => {
      isRefreshing = false;
      if (result) {
        localStorage.setItem('jwt', result.jwt);
        store.dispatch(addUserToSocket(result.jwt));
      } else {
        localStorage.removeItem('jwt');
        localStorage.removeItem('refreshToken');
      }
    });
  }
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

// When PWA returns from background, iOS may have killed the WebSocket silently.
// Force a disconnect+reconnect to restore the connection and re-join rooms.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && hasConnectedBefore) {
    console.log('🔵 PAGE VISIBLE — checking socket state:', {
      connected: socket.connected,
      timestamp: new Date().toISOString(),
    });
    if (!socket.connected) {
      socket.connect();
    } else {
      // Socket thinks it's connected but may be stale — disconnect and reconnect
      socket.disconnect();
      socket.connect();
    }
  }
});

export type RootState = ReturnType<typeof store.getState>;

export { socket };
export default store;
