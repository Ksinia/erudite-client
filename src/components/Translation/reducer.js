import { SET_LANGUAGE } from "../../constants/generalConstants";

// Initial state
const defaultLocale = localStorage.locale
  ? localStorage.locale
  : window.navigator.language.slice(0, 2) === "ru"
  ? "ru_RU"
  : "en_US";
export const initialState = {
  locale: defaultLocale,
};
console.log(window.navigator.language);

// Reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_LANGUAGE:
      return { ...state, locale: action.locale };
    default:
      return state;
  }
}