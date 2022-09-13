export const ADD_USER_TO_SOCKET = 'ADD_USER_TO_SOCKET';
export const REMOVE_USER_FROM_SOCKET = 'REMOVE_USER_FROM_SOCKET';
export const ADD_GAME_TO_SOCKET = 'ADD_GAME_TO_SOCKET';
export const REMOVE_GAME_FROM_SOCKET = 'REMOVE_GAME_FROM_SOCKET';
export const SEND_CHAT_MESSAGE = 'SEND_CHAT_MESSAGE';
export const ENTER_LOBBY = 'ENTER_LOBBY';

// When actions of these types are dispatched to the redux store, they are send to the server
export const socketActions = [
  ADD_USER_TO_SOCKET,
  REMOVE_USER_FROM_SOCKET,
  ADD_GAME_TO_SOCKET,
  REMOVE_GAME_FROM_SOCKET,
  SEND_CHAT_MESSAGE,
  ENTER_LOBBY,
];
