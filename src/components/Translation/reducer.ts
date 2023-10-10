import {
  InternalMessageTypes,
  SET_LANGUAGE,
} from '../../constants/internalMessageTypes';

// Initial state
const defaultLocale: string = localStorage.locale
  ? localStorage.locale
  : window.navigator.language.slice(0, 2) === 'ru'
  ? 'ru_RU'
  : 'en_US';
const initialState = {
  locale: defaultLocale,
};

// Reducer
export default function reducer(state = initialState, action: SET_LANGUAGE) {
  switch (action.type) {
    case InternalMessageTypes.SET_LANGUAGE:
      return { ...state, locale: action.locale };
    default:
      return state;
  }
}
