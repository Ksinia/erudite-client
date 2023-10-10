import {
  IncomingMessageTypes,
  MESSAGES_COUNT,
} from '../constants/incomingMessageTypes';

export default function reducer(
  state: { [key: number]: number } = {},
  action: MESSAGES_COUNT
) {
  switch (action.type) {
    case IncomingMessageTypes.MESSAGES_COUNT: {
      return action.payload;
    }
    default:
      return state;
  }
}
