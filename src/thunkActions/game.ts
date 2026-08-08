import superagent, { ResponseError } from 'superagent';

import { backendUrl } from '../runtime';
import { MyThunkAction } from '../reducer/types';
import { GameUpdatedAction } from '../reducer/games';
import { gameLoadFailed, GameLoadFailedAction } from '../reducer/gameLoadState';
import { clientFeaturesHeader } from '../constants/clientFeatures';
import { errorFromServer } from './errorHandling';

export const fetchGame =
  (
    gameId: number,
    jwt: string | null
  ): MyThunkAction<GameUpdatedAction | GameLoadFailedAction> =>
  async (dispatch) => {
    try {
      const request = superagent
        .get(`${backendUrl}/game/${gameId}`)
        .set(clientFeaturesHeader());
      if (jwt) {
        request.set('Authorization', `Bearer ${jwt}`);
      }
      const response = await request;
      const action: GameUpdatedAction = JSON.parse(response.text);
      dispatch(action);
    } catch (error) {
      // a request that never reached the server has no status,
      // 404 means the game does not exist or is not available to this user
      const status = (error as ResponseError).status;
      dispatch(
        gameLoadFailed({
          gameId,
          reason: status === 404 ? 'not_found' : 'unavailable',
        })
      );
      dispatch(errorFromServer(error, 'fetch game'));
    }
  };
