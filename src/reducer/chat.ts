import { AnyAction } from "redux";

import { Message } from "./types";

export default function reducer(state: Message[] = [], action: AnyAction) {
  switch (action.type) {
    case "ALL_MESSAGES": {
      return action.payload;
    }
    case "NEW_MESSAGE": {
      return [action.payload, ...state];
    }
    case "CLEAR_MESSAGES": {
      return [];
    }
    default:
      return state;
  }
}
