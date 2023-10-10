import {
  OutgoingMessageTypes,
  SEND_CHAT_MESSAGE,
} from '../constants/outgoingMessageTypes';

export const sendMessage = (message: string): SEND_CHAT_MESSAGE => {
  return {
    type: OutgoingMessageTypes.SEND_CHAT_MESSAGE,
    payload: message,
  };
};
