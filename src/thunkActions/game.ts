import superagent from 'superagent';

import { backendUrl } from '../runtime';
import { MyThunkAction } from '../reducer/types';
import { GameUpdatedAction } from '../reducer/games';
import { errorFromServer } from './errorHandling';

export const fetchGame =
  (gameId: number, jwt: string | null): MyThunkAction<GameUpdatedAction> =>
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
      const action: GameUpdatedAction = JSON.parse(response.text);
      dispatch(action);
    } catch (error) {
      dispatch(errorFromServer(error, 'fetch game'));
    }
  };
