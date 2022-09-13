import { AnyAction } from 'redux';

import { FINISHED_GAMES } from '../constants/internalMessageTypes';
import { Game } from './types';

export default function reducer(
  state: Game[] | null = null,
  action: AnyAction
) {
  switch (action.type) {
    case FINISHED_GAMES: {
      return action.payload;
    }
    default:
      return state;
  }
}
