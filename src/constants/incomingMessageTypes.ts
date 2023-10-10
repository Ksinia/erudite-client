import { Game, Message, User } from '../reducer/types';
import { InternalMessageTypes } from './internalMessageTypes';

export enum IncomingMessageTypes {
  NEW_MESSAGE = 'NEW_MESSAGE',
  MESSAGES_COUNT = 'MESSAGES_COUNT',
  ALL_MESSAGES = 'ALL_MESSAGES',
  ALL_GAMES = 'ALL_GAMES',
  GAME_UPDATED = 'GAME_UPDATED',
  DUPLICATED_WORDS = 'DUPLICATED_WORDS',
  NO_DUPLICATIONS = 'NO_DUPLICATIONS',
  DELETE_GAME_IN_LOBBY = 'DELETE_GAME_IN_LOBBY',
  UPDATED_GAME_IN_LOBBY = 'UPDATED_GAME_IN_LOBBY',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  ERROR = 'ERROR',
}
export interface NEW_MESSAGE {
  type: IncomingMessageTypes.NEW_MESSAGE;
  payload: Message;
}
export interface MESSAGES_COUNT {
  type: IncomingMessageTypes.MESSAGES_COUNT;
  payload: string;
}
export interface ALL_MESSAGES {
  type: IncomingMessageTypes.ALL_MESSAGES;
  payload: Message[];
}
export interface ALL_GAMES {
  type: IncomingMessageTypes.ALL_GAMES;
  payload: Game[];
}
export interface GAME_UPDATED {
  type: IncomingMessageTypes.GAME_UPDATED;
  payload: { gameId: number; game: Game };
}
export interface DUPLICATED_WORDS {
  type: IncomingMessageTypes.DUPLICATED_WORDS;
  payload: string[];
}
export interface NO_DUPLICATIONS {
  type: IncomingMessageTypes.NO_DUPLICATIONS;
}
export interface DELETE_GAME_IN_LOBBY {
  type: IncomingMessageTypes.DELETE_GAME_IN_LOBBY;
  payload: number;
}
export interface UPDATED_GAME_IN_LOBBY {
  type: IncomingMessageTypes.UPDATED_GAME_IN_LOBBY;
  payload: Game;
}
export interface LOGIN_SUCCESS {
  type: IncomingMessageTypes.LOGIN_SUCCESS;
  payload: User;
}
export interface ERROR {
  type: IncomingMessageTypes.ERROR | InternalMessageTypes.LOGIN_OR_SIGNUP_ERROR;
  payload: string;
}
