import { createAction, createReducer } from '@reduxjs/toolkit';
import { IncomingMessageTypes } from '../constants/incomingMessageTypes';

export const duplicatedWordsLoaded = createAction<
  string[],
  IncomingMessageTypes.DUPLICATED_WORDS
>(IncomingMessageTypes.DUPLICATED_WORDS);

export const noDuplications = createAction<
  void,
  IncomingMessageTypes.NO_DUPLICATIONS
>(IncomingMessageTypes.NO_DUPLICATIONS);

export type NoDuplicationAction = ReturnType<typeof noDuplications>;

export default createReducer<string[]>([], (builder) =>
  builder
    .addCase(duplicatedWordsLoaded, (_, action) => action.payload)
    .addCase(noDuplications, () => [])
);
