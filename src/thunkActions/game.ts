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
      // a request that never reached the server has no status at all;
      // anything else is the server answering, and 404 means this game is
      // not there for this user, which the reducer already renders from a
      // null game, so it is only reachable on endpoints that still send it
      const status = (error as ResponseError).status;
      if (!status) {
        // errorFromServer clears the user, which would make a retry
        // anonymous, and a connection that dropped says nothing about the
        // session
        dispatch(gameLoadFailed({ gameId, reason: 'unavailable' }));
        console.debug('error on fetch game', error);
        return;
      }
      dispatch(
        gameLoadFailed({
          gameId,
          reason: status === 404 ? 'not_found' : 'error',
        })
      );
      dispatch(errorFromServer(error, 'fetch game'));
    }
  };
