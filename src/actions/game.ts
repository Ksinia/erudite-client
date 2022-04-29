import superagent from "superagent";

import { url } from "../url";
import { MyThunkAction } from "../reducer/types";

export const fetchGame = (
  gameId: number,
  jwt?: string
): MyThunkAction => async (dispatch) => {
  try {
    let response;
    if (jwt) {
      response = await superagent
        .get(`${url}/game/${gameId}`)
        .set("Authorization", `Bearer ${jwt}`);
    } else {
      response = await superagent.get(`${url}/game/${gameId}`);
    }
    const action = JSON.parse(response.text);
    dispatch(action);
  } catch (error) {
    console.warn("error test:", error);
  }
};
