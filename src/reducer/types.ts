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
  game: Game;
  phase: string;
}

export type User = {
  id: number;
  name: string;
  jwt?: string;
};

type Turn = {
  words: { [key: string]: number }[];
  score: number;
  user: number;
  changedLetters: boolean;
};

export interface Game {
  id: number;
  language: string;
  letters: { [key in User["id"] | "pot"]: string[] };
  phase: string;
  validated: unknown;
  turnOrder: User["id"][];
  turn: User["id"];
  passedCount: number;
  score: { [key in User["id"]]: number };
  turns: Turn[];
  result: {
    winner: string[]; // должен быть числом!
    longestWord: { word: string; user: number }[];
    maxScoreWord: { word: string; value: number; user: number }[]; //как правильно, {}[] или [{}]?
    bestTurnByCount: [{ qty: number; turn: Turn; user: number }];
    bestTurnByValue: [{ score: number; turn: Turn; user: number }];
    neverChangedLetters: number[];
  };
  board: (string | null)[][];
  previousBoard: (string | null)[][];
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
