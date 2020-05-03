import { SET_LANGUAGE } from "../../constants/generalConstants";

// Initial state
const defaultLocale: string = localStorage.locale
  ? localStorage.locale
  : window.navigator.language.slice(0, 2) === "ru"
  ? "ru_RU"
  : "en_US";
const initialState = {
  locale: defaultLocale,
};

// Reducer
export default function reducer(
  state = initialState,
  action: { type: string; locale: string }
) {
  switch (action.type) {
    case SET_LANGUAGE:
      return { ...state, locale: action.locale };
    default:
      return state;
  }
}
