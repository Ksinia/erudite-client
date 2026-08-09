import superagent, { ResponseError } from 'superagent';

import { backendUrl } from '../runtime';
import { clientFeaturesHeader } from '../constants/clientFeatures';
import { MyThunkAction } from '../reducer/types';
import { WildCardOnBoard } from '../components/GameContainer';
import { GameUpdatedAction } from '../reducer/games';
import { GameLoadFailedAction } from '../reducer/gameLoadState';
import {
  turnFeedbackSeen,
  TurnFeedbackSeenAction,
  turnRejected,
  TurnRejectedAction,
} from '../reducer/turnFeedback';
import { fetchGame } from './game';
import { errorFromServer } from './errorHandling';

export const sendTurn =
  (
    gameId: number,
    jwt: string,
    userBoard: (string | null)[][],
    wildCardOnBoard: WildCardOnBoard
  ): MyThunkAction<
    | GameUpdatedAction
    | GameLoadFailedAction
    | TurnRejectedAction
    | TurnFeedbackSeenAction
  > =>
  async (dispatch) => {
    // a new attempt supersedes whatever the last one said
    dispatch(turnFeedbackSeen(gameId));
    try {
      const response = await superagent
        .post(`${backendUrl}/game/${gameId}/turn`)
        .set(clientFeaturesHeader())
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
        // the letters stay on the board, so without a word the board would
        // simply twitch and the player would not know the turn was refused
        dispatch(turnRejected({ gameId, reason: 'board_out_of_date' }));
        return;
      }
      dispatch(errorFromServer(error, 'turn'));
    }
  };
