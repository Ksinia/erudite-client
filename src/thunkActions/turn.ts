import superagent, { ResponseError } from 'superagent';

import { backendUrl } from '../runtime';
import { MyThunkAction } from '../reducer/types';
import { WildCardOnBoard } from '../components/GameContainer';
import { GameUpdatedAction } from '../reducer/games';
import { GameLoadFailedAction } from '../reducer/gameLoadState';
import { fetchGame } from './game';
import { errorFromServer } from './errorHandling';

export const sendTurn =
  (
    gameId: number,
    jwt: string,
    userBoard: (string | null)[][],
    wildCardOnBoard: WildCardOnBoard
  ): MyThunkAction<GameUpdatedAction | GameLoadFailedAction> =>
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
      // the board grew while the turn was being composed, so the coordinates
      // just sent no longer mean what the player saw: reload the game
      if ((error as ResponseError).status === 409) {
        dispatch(fetchGame(gameId, jwt));
        return;
      }
      dispatch(errorFromServer(error, 'turn'));
    }
  };
