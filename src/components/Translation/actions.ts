import { SET_LANGUAGE } from "../../constants/generalConstants";

export function setLanguage(locale: string) {
  return {
    type: SET_LANGUAGE,
    locale,
  };
}
