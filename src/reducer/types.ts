import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { RootState } from './index';

enum Language {
  'ru',
  'en',
}

export interface Room {
  id: number;
  maxPlayers: number;
  language: Language;
  createdAt: string;
  updatedAt: string;
  users: User[];
  game: Game;
  phase: string;
}

export type User = {
  id: number;
  name: string;
  email?: string;
  jwt: string;
  refreshToken?: string;
  finishedGamesIds?: number[];
  authMethod?: 'apple' | 'password';
  infiniteBoardEnabled?: boolean;
};

type Turn = {
  words: { [key: string]: number }[];
  score: number;
  user: number;
  changedLetters: boolean;
};

export type SparseCell = [number, number, string];

export interface Game {
  id: number;
  phase: string;
  turnOrder: User['id'][];
  turn: User['id'];
  validated: string;
  language: string;
  maxPlayers: number;
  users: User[];
  archived: boolean;
  letters: { [key in User['id'] | 'pot']: string[] };
  passedCount: number;
  score: { [key in User['id']]: number };
  turns: Turn[];
  result: {
    winner: string[]; // TODO: it should be a number
    longestWord: { word: string; user: number }[];
    maxScoreWord: { word: string; value: number; user: number }[];
    bestTurnByCount: { qty: number; turn: Turn; user: number }[];
    bestTurnByValue: { score: number; turn: Turn; user: number }[];
    neverChangedLetters: number[];
  };
  board: (string | null)[][];
  previousBoard: (string | null)[][];
  boardType?: 'classic' | 'infinite';
  boardOrigin?: { x: number; y: number };
  // an infinite board travels as its occupied cells, see reducer/games.ts
  boardSize?: { rows: number; cols: number };
  boardCells?: SparseCell[];
  previousBoardCells?: SparseCell[];
  putLetters: string[];
  lettersChanged: boolean;
  createdAt: string;
  updatedAt: string;
  wordsForValidation: string[];
  activeUserId: null | number;
}

export type MyThunkAction<A extends Action> = ThunkAction<
  void,
  RootState,
  unknown,
  A
>;

export type Message = {
  userId: number;
  text: string;
  gameId: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  id?: number;
};
