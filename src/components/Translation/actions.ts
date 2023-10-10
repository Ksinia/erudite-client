import {
  InternalMessageTypes,
  SET_LANGUAGE,
} from '../../constants/internalMessageTypes';

export function setLanguage(locale: string): SET_LANGUAGE {
  return {
    type: InternalMessageTypes.SET_LANGUAGE,
    locale,
  };
}
