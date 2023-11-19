import { createAction, createReducer } from '@reduxjs/toolkit';
import { IncomingMessageTypes } from '../constants/incomingMessageTypes';

export const messagesCountLoaded = createAction<
  { [key: number]: number },
  IncomingMessageTypes.MESSAGES_COUNT
>(IncomingMessageTypes.MESSAGES_COUNT);

export default createReducer<{ [key: number]: number }>({}, (builder) =>
  builder.addCase(messagesCountLoaded, (_, action) => action.payload)
);
