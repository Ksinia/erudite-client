import superagent from 'superagent';

import { backendUrl } from '../runtime';
import { MyThunkAction } from '../reducer/types';
import { WildCardOnBoard } from '../components/GameContainer';
import {
  GAME_UPDATED,
  IncomingMessageTypes,
  NO_DUPLICATIONS,
} from '../constants/incomingMessageTypes';
import { errorFromServer } from './errorHandling';

export const clearDuplicatedWordsError = (): NO_DUPLICATIONS => {
  return {
    type: IncomingMessageTypes.NO_DUPLICATIONS,
  };
};

export const sendTurn =
  (
    gameId: number,
    jwt: string,
    userBoard: (string | null)[][],
    wildCardOnBoard: WildCardOnBoard
  ): MyThunkAction<GAME_UPDATED> =>
  async (dispatch) => {
    try {
      const response = await superagent
        .post(`${backendUrl}/game/${gameId}/turn`)
        .set('Authorization', `Bearer ${jwt}`)
        .send({
          userBoard,
          wildCardOnBoard,
        });
      const action: GAME_UPDATED = JSON.parse(response.text);
      dispatch(action);
    } catch (error) {
      dispatch(errorFromServer(error, 'turn'));
    }
  };
