import { AnyAction } from "redux";

import { SET_LANGUAGE } from "../../constants/generalConstants";

export function setLanguage(locale: string): AnyAction {
  return {
    type: SET_LANGUAGE,
    locale,
  };
}
