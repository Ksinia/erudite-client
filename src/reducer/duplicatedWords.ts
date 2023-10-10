import {
  DUPLICATED_WORDS,
  IncomingMessageTypes,
  NO_DUPLICATIONS,
} from '../constants/incomingMessageTypes';

export default function reducer(
  state: string[] = [],
  action: DUPLICATED_WORDS | NO_DUPLICATIONS
) {
  switch (action.type) {
    case IncomingMessageTypes.DUPLICATED_WORDS: {
      return action.payload;
    }
    case IncomingMessageTypes.NO_DUPLICATIONS: {
      return [];
    }
    default:
      return state;
  }
}
