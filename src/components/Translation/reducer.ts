import { createAction, createReducer } from '@reduxjs/toolkit';
import { InternalMessageTypes } from '../../constants/internalMessageTypes';

// Initial state
const defaultLocale: string = localStorage.locale
  ? localStorage.locale
  : window.navigator.language.slice(0, 2) === 'ru'
    ? 'ru_RU'
    : 'en_US';
const initialState = {
  locale: defaultLocale,
};

export const setLanguage = createAction<
  { locale: string },
  InternalMessageTypes.SET_LANGUAGE
>(InternalMessageTypes.SET_LANGUAGE);

export default createReducer<{ locale: string }>(initialState, (builder) =>
  builder.addCase(setLanguage, (state, action) => {
    return { ...state, locale: action.payload.locale };
  })
);
