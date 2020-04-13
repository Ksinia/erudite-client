import { SET_LANGUAGE } from "../../constants/generalConstants";

export function setLanguage(locale) {
  return {
    type: SET_LANGUAGE,
    locale,
  };
}
