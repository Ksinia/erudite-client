import {
  FINISHED_GAMES,
  InternalMessageTypes,
} from '../constants/internalMessageTypes';
import { Game } from './types';

export default function reducer(state: Game[] = [], action: FINISHED_GAMES) {
  switch (action.type) {
    case InternalMessageTypes.FINISHED_GAMES: {
      return action.payload;
    }
    default:
      return state;
  }
}
