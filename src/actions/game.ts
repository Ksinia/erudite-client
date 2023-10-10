import superagent from 'superagent';

import { backendUrl } from '../runtime';
import { MyThunkAction } from '../reducer/types';
import {
  ADD_GAME_TO_SOCKET,
  OutgoingMessageTypes,
  REMOVE_GAME_FROM_SOCKET,
} from '../constants/outgoingMessageTypes';
import { GAME_UPDATED } from '../constants/incomingMessageTypes';
import { errorFromServer } from './errorHandling';

export const fetchGame =
  (gameId: number, jwt: string | null): MyThunkAction<GAME_UPDATED> =>
  async (dispatch) => {
    try {
      let response;
      if (jwt) {
        response = await superagent
          .get(`${backendUrl}/game/${gameId}`)
          .set('Authorization', `Bearer ${jwt}`);
      } else {
        response = await superagent.get(`${backendUrl}/game/${gameId}`);
      }
      const action: GAME_UPDATED = JSON.parse(response.text);
      dispatch(action);
    } catch (error) {
      dispatch(errorFromServer(error, 'fetch game'));
    }
  };

export const addGameToSocket = (gameId: number): ADD_GAME_TO_SOCKET => {
  return {
    type: OutgoingMessageTypes.ADD_GAME_TO_SOCKET,
    payload: gameId,
  };
};
export const removeGameFromSocket = (
  gameId: number
): REMOVE_GAME_FROM_SOCKET => {
  return {
    type: OutgoingMessageTypes.REMOVE_GAME_FROM_SOCKET,
    payload: gameId,
  };
};
