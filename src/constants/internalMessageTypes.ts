import { Game } from '../reducer/types';

export enum InternalMessageTypes {
  LOGIN_OR_SIGNUP_ERROR = 'LOGIN_OR_SIGNUP_ERROR',
  CLEAR_ERROR = 'CLEAR_ERROR',
  LOGOUT = 'LOGOUT',
  CLEAR_MESSAGES = 'CLEAR_MESSAGES',
  FINISHED_GAMES = 'FINISHED_GAMES',
  ARCHIVED_GAMES = 'ARCHIVED_GAMES',
  SOCKET_CONNECTED = 'SOCKET_CONNECTED',
  SOCKET_DISCONNECTED = 'SOCKET_DISCONNECTED',
  SUBSCRIPTION_REGISTERED = 'SUBSCRIPTION_REGISTERED',
  SET_LANGUAGE = 'SET_LANGUAGE',
}

export interface LOGIN_OR_SIGNUP_ERROR {
  type: InternalMessageTypes.LOGIN_OR_SIGNUP_ERROR;
  payload: string;
}
export interface CLEAR_ERROR {
  type: InternalMessageTypes.CLEAR_ERROR;
}
export interface LOGOUT {
  type: InternalMessageTypes.LOGOUT;
}
export interface CLEAR_MESSAGES {
  type: InternalMessageTypes.CLEAR_MESSAGES;
}
export interface FINISHED_GAMES {
  type: InternalMessageTypes.FINISHED_GAMES;
  payload: Game[];
}
export interface ARCHIVED_GAMES {
  type: InternalMessageTypes.ARCHIVED_GAMES;
  payload: Game[];
}
export interface SOCKET_CONNECTED {
  type: InternalMessageTypes.SOCKET_CONNECTED;
}
export interface SOCKET_DISCONNECTED {
  type: InternalMessageTypes.SOCKET_DISCONNECTED;
}
export interface SUBSCRIPTION_REGISTERED {
  type: InternalMessageTypes.SUBSCRIPTION_REGISTERED;
  payload: PushSubscription;
}

export interface SET_LANGUAGE {
  type: InternalMessageTypes.SET_LANGUAGE;
  locale: string;
}
