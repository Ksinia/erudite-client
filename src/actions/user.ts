import superagent from 'superagent';

import { backendUrl } from '../runtime';
import { Game, MyThunkAction } from '../reducer/types';
import {
  ARCHIVED_GAMES,
  FINISHED_GAMES,
  InternalMessageTypes,
} from '../constants/internalMessageTypes';
import {
  ADD_USER_TO_SOCKET,
  OutgoingMessageTypes,
} from '../constants/outgoingMessageTypes';
import { errorFromServer } from './errorHandling';

export const finishedGamesLoaded = (games: Game[]): FINISHED_GAMES => {
  return {
    type: InternalMessageTypes.FINISHED_GAMES,
    payload: games,
  };
};

export const loadFinishGames =
  (jwt: string): MyThunkAction<FINISHED_GAMES> =>
  async (dispatch) => {
    try {
      const response = await superagent
        .get(`${backendUrl}/my/finished-games`)
        .set('Authorization', `Bearer ${jwt}`);

      const action = finishedGamesLoaded(response.body);
      dispatch(action);
    } catch (error) {
      dispatch(errorFromServer(error, 'my finished games'));
    }
  };
export const archivedGamesLoaded = (games: Game[]): ARCHIVED_GAMES => {
  return {
    type: InternalMessageTypes.ARCHIVED_GAMES,
    payload: games,
  };
};

export const loadArchivedGames =
  (jwt: string): MyThunkAction<ARCHIVED_GAMES> =>
  async (dispatch) => {
    try {
      const response = await superagent
        .get(`${backendUrl}/my/archived-games`)
        .set('Authorization', `Bearer ${jwt}`);

      const action = archivedGamesLoaded(response.body);
      dispatch(action);
    } catch (error) {
      dispatch(errorFromServer(error, 'my archived games'));
    }
  };

export const addUserToSocket = (jwt: string): ADD_USER_TO_SOCKET => {
  return {
    type: OutgoingMessageTypes.ADD_USER_TO_SOCKET,
    payload: jwt,
  };
};
