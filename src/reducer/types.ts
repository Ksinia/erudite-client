import { Action, AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";

import { RootState } from "../reducer";

enum Language {
  "ru",
  "en",
}

export interface Room {
  id: number;
  maxPlayers: number;
  language: Language;
  createdAt: string;
  updatedAt: string;
  users: User[];
  game: Object;
}

export interface iUser {
  id: number;
  name: string;
  jwt?: string;
}

export type User = iUser | null;

export interface Game {
  id: number;
  language: string;
  letters: { [key in iUser["id"] | "pot"]: string[] };
  phase: string;
  validated: unknown;
  turnOrder: iUser["id"][];
  turn: iUser["id"];
  passedCount: number;
  score: { [key in iUser["id"]]: number };
  turns;
  result;
  board;
  previousBoard;
  putLetters: string[];
  lettersChanged: boolean;
  createdAt: string;
  updatedAt: string;
  roomId: number;
  users: User[];
}

export type MyThunkAction<A extends Action = AnyAction> = ThunkAction<
  void,
  RootState,
  unknown,
  A
>;
