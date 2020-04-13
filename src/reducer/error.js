export default function reducer(state = null, action = {}) {
  switch (action.type) {
    case "LOGIN_OR_SIGNUP_ERROR": {
      return action.payload;
    }
    case "LOGIN_SUCCESS": {
      return null;
    }
    default:
      return state;
  }
}
