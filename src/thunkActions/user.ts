import superagent from 'superagent';

import { backendUrl } from '../runtime';
import { Game, MyThunkAction } from '../reducer/types';
import {
  archivedGamesLoaded,
  ArchivedGamesLoadedAction,
} from '../reducer/archivedGames';
import {
  finishedGamesLoaded,
  FinishedGamesLoadedAction,
} from '../reducer/finishedGames';
import { clientFeaturesHeader } from '../constants/clientFeatures';
import { errorFromServer } from './errorHandling';

export const loadFinishGames =
  (jwt: string): MyThunkAction<FinishedGamesLoadedAction> =>
  async (dispatch) => {
    try {
      const response = await superagent
        .get(`${backendUrl}/my/finished-games`)
        .set(clientFeaturesHeader())
        .set('Authorization', `Bearer ${jwt}`);

      const action = finishedGamesLoaded(response.body);
      dispatch(action);
    } catch (error) {
      dispatch(errorFromServer(error, 'my finished games'));
    }
  };

export const loadArchivedGames =
  (jwt: string): MyThunkAction<ArchivedGamesLoadedAction> =>
  async (dispatch) => {
    try {
      const response = await superagent
        .get(`${backendUrl}/my/archived-games`)
        .set(clientFeaturesHeader())
        .set('Authorization', `Bearer ${jwt}`);

      dispatch(archivedGamesLoaded(response.body as Game[]));
    } catch (error) {
      dispatch(errorFromServer(error, 'my archived games'));
    }
  };
