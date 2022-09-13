import { AnyAction } from 'redux';

import { MESSAGES_COUNT } from '../constants/incomingMessageTypes';

export default function reducer(
  state: { [key: number]: number } = {},
  action: AnyAction
) {
  switch (action.type) {
    case MESSAGES_COUNT: {
      return action.payload;
    }
    default:
      return state;
  }
}
