import superagent, { ResponseError } from 'superagent';

import { backendUrl } from '../runtime';
import { MyThunkAction } from '../reducer/types';
import { GameUpdatedAction } from '../reducer/games';
import { gameLoadFailed, GameLoadFailedAction } from '../reducer/gameLoadState';
import { errorFromServer } from './errorHandling';

export const fetchGame =
  (
    gameId: number,
    jwt: string | null
  ): MyThunkAction<GameUpdatedAction | GameLoadFailedAction> =>
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
