import {
  InternalMessageTypes,
  SUBSCRIPTION_REGISTERED,
} from '../constants/internalMessageTypes';

export default function reducer(
  state: PushSubscription | null = null,
  action: SUBSCRIPTION_REGISTERED
) {
  switch (action.type) {
    case InternalMessageTypes.SUBSCRIPTION_REGISTERED: {
      return action.payload;
    }
    default:
      return state;
  }
}
