import { createAction, createReducer } from '@reduxjs/toolkit';
import { InternalMessageTypes } from '../constants/internalMessageTypes';

export const socketConnected = createAction<
  void,
  InternalMessageTypes.SOCKET_CONNECTED
>(InternalMessageTypes.SOCKET_CONNECTED);
export const socketDisconnected = createAction<
  void,
  InternalMessageTypes.SOCKET_DISCONNECTED
>(InternalMessageTypes.SOCKET_DISCONNECTED);

export default createReducer<boolean>(false, (builder) =>
  builder
    .addCase(socketConnected, () => true)
    .addCase(socketDisconnected, () => false)
);
