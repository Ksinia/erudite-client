import superagent from "superagent";
import { AnyAction } from "redux";

import { url } from "../url";
import { MyThunkAction } from "../reducer/types";
import { WildCardOnBoard } from "../components/GameContainer";

export const DUPLICATED_WORDS = "DUPLICATED_WORDS";

export const duplicatedWords = (words: string[]): AnyAction => {
  return {
    type: DUPLICATED_WORDS,
    payload: words,
  };
};

export const NO_DUPLICATIONS = "NO_DUPLICATIONS";

export const clearDuplicatedWordsError = () => {
  return {
    type: NO_DUPLICATIONS,
  };
};

export const sendTurn = (
  gameId: number,
  jwt: string,
  userBoard: (string | null)[][],
  wildCardOnBoard: WildCardOnBoard
): MyThunkAction => async (dispatch) => {
  try {
    const response = await superagent
      .post(`${url}/game/${gameId}/turn`)
      .set("Authorization", `Bearer ${jwt}`)
      .send({
        userBoard,
        wildCardOnBoard,
      });
    console.log("response test: ", response);
    const action = JSON.parse(response.text);
    dispatch(action);
  } catch (error) {
    console.warn("error test:", error);
  }
};
