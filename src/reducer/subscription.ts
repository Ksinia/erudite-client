import { AnyAction } from "redux";

import { SUBSCRIPTION_REGISTERED } from "../constants/internalMessageTypes";

export default function reducer(
  state: PushSubscription | null = null,
  action: AnyAction
) {
  switch (action.type) {
    case SUBSCRIPTION_REGISTERED: {
      return action.payload;
    }
    default:
      return state;
  }
}
