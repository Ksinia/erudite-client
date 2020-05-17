import superagent from "superagent";
import { AnyAction } from "redux";

import { url } from "../url";
import { MyThunkAction } from "../reducer/types";

export const FINISHED_GAMES = "FINISHED_GAMES";

export const finishedGamesIdsLoaded = (gameIds: number[]): AnyAction => {
  return {
    type: FINISHED_GAMES,
    payload: gameIds,
  };
};

export const loadFinishGamesIds = (jwt: string): MyThunkAction => async (
  dispatch
) => {
  try {
    const response = await superagent
      .get(`${url}/my/finished-games`)
      .set("Authorization", `Bearer ${jwt}`);

    console.log("response test: ", response);
    const action = finishedGamesIdsLoaded(response.body);
    dispatch(action);
  } catch (error) {
    console.warn("error test:", error);
  }
};
