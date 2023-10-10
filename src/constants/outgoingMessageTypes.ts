export enum OutgoingMessageTypes {
  ADD_USER_TO_SOCKET = 'ADD_USER_TO_SOCKET',
  REMOVE_USER_FROM_SOCKET = 'REMOVE_USER_FROM_SOCKET',
  ADD_GAME_TO_SOCKET = 'ADD_GAME_TO_SOCKET',
  REMOVE_GAME_FROM_SOCKET = 'REMOVE_GAME_FROM_SOCKET',
  SEND_CHAT_MESSAGE = 'SEND_CHAT_MESSAGE',
  ENTER_LOBBY = 'ENTER_LOBBY',
}
export interface ADD_GAME_TO_SOCKET {
  type: OutgoingMessageTypes.ADD_GAME_TO_SOCKET;
  payload: number;
}
export interface REMOVE_GAME_FROM_SOCKET {
  type: OutgoingMessageTypes.REMOVE_GAME_FROM_SOCKET;
  payload: number;
}
export interface ADD_USER_TO_SOCKET {
  type: OutgoingMessageTypes.ADD_USER_TO_SOCKET;
  payload: string;
}
export interface REMOVE_USER_FROM_SOCKET {
  type: OutgoingMessageTypes.REMOVE_USER_FROM_SOCKET;
}
export interface SEND_CHAT_MESSAGE {
  type: OutgoingMessageTypes.SEND_CHAT_MESSAGE;
  payload: string;
}
export interface ENTER_LOBBY {
  type: OutgoingMessageTypes.ENTER_LOBBY;
}

// When actions of these types are dispatched to the redux store, they are send to the server
export const outgoingSocketActions = Object.keys(OutgoingMessageTypes).map(
  (key) => OutgoingMessageTypes[key as keyof typeof OutgoingMessageTypes]
);
