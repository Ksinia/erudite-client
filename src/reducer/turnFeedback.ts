import { createAction, createReducer } from '@reduxjs/toolkit';
import { InternalMessageTypes } from '../constants/internalMessageTypes';
import { Game } from './types';

/**
 * A translation key explaining why the last turn did not go through, shown
 * on the game screen, kept per game so a rejection in one does not greet
 * the player in another.
 */
export const turnRejected = createAction<
  { gameId: Game['id']; reason: string },
  InternalMessageTypes.TURN_REJECTED
>(InternalMessageTypes.TURN_REJECTED);

export type TurnRejectedAction = ReturnType<typeof turnRejected>;

export const turnFeedbackSeen = createAction<
  Game['id'],
  InternalMessageTypes.TURN_FEEDBACK_SEEN
>(InternalMessageTypes.TURN_FEEDBACK_SEEN);

export type TurnFeedbackSeenAction = ReturnType<typeof turnFeedbackSeen>;

export default createReducer<{ [key in Game['id']]: string }>({}, (builder) =>
  builder
    .addCase(turnRejected, (state, action) => {
      state[action.payload.gameId] = action.payload.reason;
    })
    // the rejection is followed by a refetch of the game, so clearing on
    // that would take the message away within one round trip; it goes when
    // the player acts on it, by touching the board or sending a turn
    .addCase(turnFeedbackSeen, (state, action) => {
      delete state[action.payload];
    })
);
