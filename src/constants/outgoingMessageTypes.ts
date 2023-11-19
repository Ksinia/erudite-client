export enum OutgoingMessageTypes {
  ADD_USER_TO_SOCKET = 'ADD_USER_TO_SOCKET',
  REMOVE_USER_FROM_SOCKET = 'REMOVE_USER_FROM_SOCKET',
  ADD_GAME_TO_SOCKET = 'ADD_GAME_TO_SOCKET',
  REMOVE_GAME_FROM_SOCKET = 'REMOVE_GAME_FROM_SOCKET',
  SEND_CHAT_MESSAGE = 'SEND_CHAT_MESSAGE',
  ENTER_LOBBY = 'ENTER_LOBBY',
}

// When actions of these types are dispatched to the redux store, they are send to the server
export const outgoingSocketActions = Object.keys(OutgoingMessageTypes).map(
  (key) => OutgoingMessageTypes[key as keyof typeof OutgoingMessageTypes]
);
