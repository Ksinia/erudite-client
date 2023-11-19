import { createAction, createReducer } from '@reduxjs/toolkit';
import { InternalMessageTypes } from '../constants/internalMessageTypes';
import { errorLoaded, loginSuccess } from './auth';

export const loginOrSignupError = createAction<
  string,
  InternalMessageTypes.LOGIN_OR_SIGNUP_ERROR
>(InternalMessageTypes.LOGIN_OR_SIGNUP_ERROR);

export type LoginOrSignupErrorAction = ReturnType<typeof loginOrSignupError>;

export const clearError = createAction<void, InternalMessageTypes.CLEAR_ERROR>(
  InternalMessageTypes.CLEAR_ERROR
);

export type ClearErrorAction = ReturnType<typeof clearError>;

export default createReducer<string | null>(null, (builder) =>
  builder
    .addCase(loginOrSignupError, (_, action) => action.payload)
    .addCase(clearError, () => null)
    .addCase(loginSuccess, () => null)
    .addCase(errorLoaded, (_, action) => action.payload)
);
