import superagent from "superagent";
import { AnyAction } from "redux";

import { backendUrl } from "../backendUrl";
import { Game, MyThunkAction } from "../reducer/types";
import {
  FINISHED_GAMES,
  ARCHIVED_GAMES,
} from "../constants/internalMessageTypes";

export const finishedGamesLoaded = (games: Game[]): AnyAction => {
  return {
    type: FINISHED_GAMES,
    payload: games,
  };
};

export const loadFinishGames = (jwt: string): MyThunkAction => async (
  dispatch
) => {
  try {
    const response = await superagent
      .get(`${backendUrl}/my/finished-games`)
      .set("Authorization", `Bearer ${jwt}`);

    const action = finishedGamesLoaded(response.body);
    dispatch(action);
  } catch (error) {
    console.warn("error test:", error);
  }
};
export const archivedGamesLoaded = (games: Game[]): AnyAction => {
  return {
    type: ARCHIVED_GAMES,
    payload: games,
  };
};

export const loadArchivedGames = (jwt: string): MyThunkAction => async (
  dispatch
) => {
  try {
    const response = await superagent
      .get(`${backendUrl}/my/archived-games`)
      .set("Authorization", `Bearer ${jwt}`);

    const action = archivedGamesLoaded(response.body);
    dispatch(action);
  } catch (error) {
    console.warn("error test:", error);
  }
};
