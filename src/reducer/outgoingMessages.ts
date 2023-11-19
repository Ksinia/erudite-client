import { createAction } from '@reduxjs/toolkit';
import { OutgoingMessageTypes } from '../constants/outgoingMessageTypes';

export const addGameToSocket = createAction<
  number,
  OutgoingMessageTypes.ADD_GAME_TO_SOCKET
>(OutgoingMessageTypes.ADD_GAME_TO_SOCKET);

export type AddGameToSocketAction = ReturnType<typeof addGameToSocket>;

export const enterLobby = createAction<void, OutgoingMessageTypes.ENTER_LOBBY>(
  OutgoingMessageTypes.ENTER_LOBBY
);

export type EnterLobbyAction = ReturnType<typeof enterLobby>;

export const addUserToSocket = createAction<
  string,
  OutgoingMessageTypes.ADD_USER_TO_SOCKET
>(OutgoingMessageTypes.ADD_USER_TO_SOCKET);

export type AddUserToSocketAction = ReturnType<typeof addUserToSocket>;

export const removeGameFromSocket = createAction<
  number,
  OutgoingMessageTypes.REMOVE_GAME_FROM_SOCKET
>(OutgoingMessageTypes.REMOVE_GAME_FROM_SOCKET);

export type RemoveGameFromSocketAction = ReturnType<
  typeof removeGameFromSocket
>;

export const removeUserFromSocket = createAction<
  void,
  OutgoingMessageTypes.REMOVE_USER_FROM_SOCKET
>(OutgoingMessageTypes.REMOVE_USER_FROM_SOCKET);

export type RemoveUserFromSocketAction = ReturnType<
  typeof removeUserFromSocket
>;

export const sendChatMessage = createAction<
  string,
  OutgoingMessageTypes.SEND_CHAT_MESSAGE
>(OutgoingMessageTypes.SEND_CHAT_MESSAGE);

export type SendChatMessageAction = ReturnType<typeof sendChatMessage>;
