import {
  ALL_MESSAGES,
  IncomingMessageTypes,
  NEW_MESSAGE,
} from '../constants/incomingMessageTypes';
import {
  CLEAR_MESSAGES,
  InternalMessageTypes,
} from '../constants/internalMessageTypes';
import { Message } from './types';

export default function reducer(
  state: Message[] = [],
  action: ALL_MESSAGES | NEW_MESSAGE | CLEAR_MESSAGES
) {
  switch (action.type) {
    case IncomingMessageTypes.ALL_MESSAGES: {
      return action.payload;
    }
    case IncomingMessageTypes.NEW_MESSAGE: {
      return [action.payload, ...state];
    }
    case InternalMessageTypes.CLEAR_MESSAGES: {
      return [];
    }
    default:
      return state;
  }
}
