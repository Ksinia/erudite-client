import { AnyAction } from "redux";

export default function reducer(
  state: { [key: number]: number } = {},
  action: AnyAction
) {
  switch (action.type) {
    case "MESSAGES_COUNT": {
      return action.payload;
    }
    default:
      return state;
  }
}
