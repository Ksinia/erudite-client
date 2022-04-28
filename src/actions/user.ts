import superagent from "superagent";
import { AnyAction } from "redux";

import io from "socket.io-client";
import { url } from "../url";
import { Game, MyThunkAction } from "../reducer/types";
import { ADD_USER_TO_SOCKET } from "./outgoingMessageTypes";

export const FINISHED_GAMES = "FINISHED_GAMES";
export const ARCHIVED_GAMES = "ARCHIVED_GAMES";
export const SOCKET_CONNECTED = "SOCKET_CONNECTED";

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
export const socketConnected = (socket: SocketIOClient.Socket): AnyAction => {
  return {
    type: SOCKET_CONNECTED,
    payload: socket,
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

export const connectToSocket = (jwt?: string): MyThunkAction => async (
  dispatch
) => {
  try {
    const socket = io(url, {
      path: "/socket",
    });
    socket.on("connect", () => {
      socket.on("message", (action: AnyAction) => {
        dispatch(action);
      });
      if (jwt) {
        socket.send({ type: ADD_USER_TO_SOCKET, payload: jwt });
      }
      const action = socketConnected(socket);
      dispatch(action);
    });
  } catch (error) {
    console.warn(error);
  }
};
