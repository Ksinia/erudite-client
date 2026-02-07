import { socket } from '../store';
import { OutgoingMessageTypes } from '../constants/outgoingMessageTypes';

interface ChatMessageResponse {
  success: boolean;
  error?: string;
}

export const sendChatMessageWithAck = (
  message: string
): Promise<ChatMessageResponse> => {
  return new Promise((resolve) => {
    let resolved = false;
    const action = {
      type: OutgoingMessageTypes.SEND_CHAT_MESSAGE,
      payload: message,
    };

    // Use socket.io acknowledgment callback
    socket.emit('message', action, (response: ChatMessageResponse) => {
      if (!resolved) {
        resolved = true;
        resolve(response);
      }
    });

    // Timeout after 10 seconds if no response
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve({ success: false, error: 'Message send timeout' });
      }
    }, 10000);
  });
};
