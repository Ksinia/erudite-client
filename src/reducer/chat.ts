import { createAction, createReducer } from '@reduxjs/toolkit';
import { IncomingMessageTypes } from '../constants/incomingMessageTypes';
import { InternalMessageTypes } from '../constants/internalMessageTypes';
import { Message } from './types';

export const allMessages = createAction<
  Message[],
  IncomingMessageTypes.ALL_MESSAGES
>(IncomingMessageTypes.ALL_MESSAGES);
export const newMessage = createAction<
  Message,
  IncomingMessageTypes.NEW_MESSAGE
>(IncomingMessageTypes.NEW_MESSAGE);
export const clearMessages = createAction<
  void,
  InternalMessageTypes.CLEAR_MESSAGES
>(InternalMessageTypes.CLEAR_MESSAGES);

export type ClearMessagesAction = ReturnType<typeof clearMessages>;

const isBotTrigger = (m: Message) =>
  m.userId === 1 && m.text.trim().toLowerCase() === 'бот ходи';

export default createReducer<Message[]>([], (builder) =>
  builder
    .addCase(allMessages, (_, action) => action.payload.filter((m) => !isBotTrigger(m)))
    .addCase(newMessage, (state, action) =>
      isBotTrigger(action.payload) ? state : [action.payload, ...state],
    )
    .addCase(clearMessages, () => []),
);
