import { LOGIN_SUCCESS, LOGOUT } from "../actions/authorization";

export default function reducer(
  state = null,
  action: { type: string; payload: any }
) {
  switch (action.type) {
    case LOGIN_SUCCESS: {
      return action.payload;
    }
    case LOGOUT: {
      return null;
    }
    default:
      return state;
  }
}
