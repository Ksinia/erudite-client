import { SET_LANGUAGE } from "../../constants/generalConstants";
import { AnyAction } from "redux";

export function setLanguage(locale: string): AnyAction {
  return {
    type: SET_LANGUAGE,
    locale,
  };
}
