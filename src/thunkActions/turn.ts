import superagent from 'superagent';

import { backendUrl } from '../runtime';
import { MyThunkAction } from '../reducer/types';
import { WildCardOnBoard } from '../components/GameContainer';
import { GameUpdatedAction } from '../reducer/games';
import { errorFromServer } from './errorHandling';

export const sendTurn =
  (
    gameId: number,
    jwt: string,
    userBoard: (string | null)[][],
    wildCardOnBoard: WildCardOnBoard
  ): MyThunkAction<GameUpdatedAction> =>
  async (dispatch) => {
    try {
      const response = await superagent
        .post(`${backendUrl}/game/${gameId}/turn`)
        .set('Authorization', `Bearer ${jwt}`)
        .send({
          userBoard,
          wildCardOnBoard,
        });
      const action: GameUpdatedAction = JSON.parse(response.text);
      dispatch(action);
    } catch (error) {
      dispatch(errorFromServer(error, 'turn'));
    }
  };
