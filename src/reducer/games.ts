import {
  GAME_UPDATED,
  IncomingMessageTypes,
} from '../constants/incomingMessageTypes';
import { Game } from './types';

export default function reducer(
  state: { [key in Game['id']]: Game } = {},
  action: GAME_UPDATED
) {
  switch (action.type) {
    case IncomingMessageTypes.GAME_UPDATED: {
      return { ...state, [action.payload.gameId]: action.payload.game };
    }
    default:
      return state;
  }
}
