import superagent from "superagent";
import { AnyAction } from "redux";

import { url } from "../url";
import { Game, MyThunkAction } from "../reducer/types";

export const FINISHED_GAMES = "FINISHED_GAMES";
export const ARCHIVED_GAMES = "ARCHIVED_GAMES";

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
      .get(`${url}/my/finished-games`)
      .set("Authorization", `Bearer ${jwt}`);

    console.log("response test: ", response);
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
      .get(`${url}/my/archived-games`)
      .set("Authorization", `Bearer ${jwt}`);

    console.log("response test: ", response);
    const action = archivedGamesLoaded(response.body);
    dispatch(action);
  } catch (error) {
    console.warn("error test:", error);
  }
};
