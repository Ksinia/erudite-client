import { AnyAction } from "redux";
import { NOTIFICATIONS_SUPPORTED } from "../constants/internalMessageTypes";
export default function reducer(state: boolean = false, action: AnyAction) {
  switch (action.type) {
    case NOTIFICATIONS_SUPPORTED: {
      return true;
    }
    default:
      return state;
  }
}
