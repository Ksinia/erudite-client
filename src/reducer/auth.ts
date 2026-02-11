import { createAction, createReducer } from '@reduxjs/toolkit';
import { InternalMessageTypes } from '../constants/internalMessageTypes';
import { IncomingMessageTypes } from '../constants/incomingMessageTypes';
import { User } from './types';

export const loginSuccess = createAction<
  User,
  IncomingMessageTypes.LOGIN_SUCCESS
>(IncomingMessageTypes.LOGIN_SUCCESS);

export type LoginSuccessAction = ReturnType<typeof loginSuccess>;

export const errorLoaded = createAction<string, IncomingMessageTypes.ERROR>(
  IncomingMessageTypes.ERROR
);

export type ErrorLoadedAction = ReturnType<typeof errorLoaded>;

export const logOut = createAction<void, InternalMessageTypes.LOGOUT>(
  InternalMessageTypes.LOGOUT
);

export type LogOutAction = ReturnType<typeof logOut>;

export const updateEmail = createAction<
  string,
  InternalMessageTypes.UPDATE_EMAIL
>(InternalMessageTypes.UPDATE_EMAIL);

export type UpdateEmailAction = ReturnType<typeof updateEmail>;

export default createReducer<User | null>(null, (builder) =>
  builder
    .addCase(loginSuccess, (_, action) => action.payload)
    .addCase(logOut, () => {
      localStorage.removeItem('jwt');
      return null;
    })
    .addCase(errorLoaded, () => null)
    .addCase(updateEmail, (state, action) => {
      if (state) {
        state.email = action.payload;
      }
    })
);
