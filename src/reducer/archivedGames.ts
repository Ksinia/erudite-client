import {
  ARCHIVED_GAMES,
  InternalMessageTypes,
} from '../constants/internalMessageTypes';
import { Game } from './types';

export default function reducer(state: Game[] = [], action: ARCHIVED_GAMES) {
  switch (action.type) {
    case InternalMessageTypes.ARCHIVED_GAMES: {
      return action.payload;
    }
    default:
      return state;
  }
}
