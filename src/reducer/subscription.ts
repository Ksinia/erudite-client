import { createAction, createReducer } from '@reduxjs/toolkit';
import { InternalMessageTypes } from '../constants/internalMessageTypes';

export const subscriptionRegistered = createAction<
  PushSubscription,
  InternalMessageTypes.SUBSCRIPTION_REGISTERED
>(InternalMessageTypes.SUBSCRIPTION_REGISTERED);

export type SubscriptionRegisteredAction = ReturnType<
  typeof subscriptionRegistered
>;

export default createReducer<PushSubscription | null>(null, (builder) =>
  builder.addCase(subscriptionRegistered, (_, action) => action.payload)
);
