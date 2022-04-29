import { AnyAction } from "redux";

import {
  DUPLICATED_WORDS,
  NO_DUPLICATIONS,
} from "../constants/incomingMessageTypes";

export default function reducer(state = null, action: AnyAction) {
  switch (action.type) {
    case DUPLICATED_WORDS: {
      return action.payload;
    }
    case NO_DUPLICATIONS: {
      return null;
    }
    default:
      return state;
  }
}
