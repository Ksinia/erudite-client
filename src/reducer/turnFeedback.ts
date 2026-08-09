import { createAction, createReducer } from '@reduxjs/toolkit';
import { InternalMessageTypes } from '../constants/internalMessageTypes';
import { gameUpdated } from './games';

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

export default createReducer<string | null>(null, (builder) =>
  builder
    .addCase(turnRejected, (_, action) => action.payload)
    // any fresh view of the game means the player has moved on
    .addCase(gameUpdated, () => null)
);
