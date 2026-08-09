import { createAction, createReducer } from '@reduxjs/toolkit';
import { InternalMessageTypes } from '../constants/internalMessageTypes';

/**
 * A translation key explaining why the last turn did not go through, shown
 * on the game screen. It is not an error in the session sense, so it must
 * not travel through errorLoaded, which signs the player out.
 */
export const turnRejected = createAction<
  string,
  InternalMessageTypes.TURN_REJECTED
>(InternalMessageTypes.TURN_REJECTED);

export type TurnRejectedAction = ReturnType<typeof turnRejected>;

export const turnFeedbackSeen = createAction<
  void,
  InternalMessageTypes.TURN_FEEDBACK_SEEN
>(InternalMessageTypes.TURN_FEEDBACK_SEEN);

export type TurnFeedbackSeenAction = ReturnType<typeof turnFeedbackSeen>;

export default createReducer<string | null>(null, (builder) =>
  builder
    .addCase(turnRejected, (_, action) => action.payload)
    // the rejection is followed by a refetch of the game, so clearing on
    // that would take the message away within one round trip; it goes when
    // the player does something about it instead
    .addCase(turnFeedbackSeen, () => null)
);
