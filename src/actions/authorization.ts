import superagent from "superagent";
import { AnyAction } from "redux";
import { url as baseUrl } from "../url";
import { MyThunkAction } from "../reducer/types";
import { History } from "history";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
//this action is created on server side

export const LOGIN_OR_SIGNUP_ERROR = "LOGIN_OR_SIGNUP_ERROR";

export const loginError = (error: string): AnyAction => {
  return {
    type: LOGIN_OR_SIGNUP_ERROR,
    payload: error,
  };
};

export const CLEAR_ERROR = "CLEAR_ERROR";

export const clearError = () => {
  return {
    type: CLEAR_ERROR,
  };
};

export const LOGOUT = "LOGOUT";

export const logOut = () => {
  localStorage.removeItem("jwt");
  return {
    type: LOGOUT,
  };
};

export const loginSignupFunction = (
  type: string,
  name: string,
  password: string,
  history: History
): MyThunkAction => async (dispatch) => {
  const url = `${baseUrl}/${type}`;
  try {
    const response = await superagent.post(url).send({ name, password });
    const action = JSON.parse(response.text);
    localStorage.setItem("jwt", action.payload.jwt);
    dispatch(action);
    const prevPageUrl = new URL(window.location.href).searchParams.get("prev");
    if (
      prevPageUrl &&
      prevPageUrl !== "/login" &&
      prevPageUrl !== "/signup" &&
      prevPageUrl !== "/change-password"
    ) {
      history.push(prevPageUrl);
    } else {
      history.push("/");
    }
  } catch (error) {
    console.log("error test:", error);
    if (error.response) {
      dispatch(loginError(error.response.body));
    }
  }
};

export const getProfileFetch = (
  jwt: string
  // ): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => { // no need to pass all of these, because we already did it on our type MyThunkAction
): MyThunkAction => async (dispatch) => {
  const url = `${baseUrl}/profile`;
  if (jwt) {
    try {
      const response = await superagent
        .get(url)
        .set("Authorization", `Bearer ${jwt}`);
      const action = JSON.parse(response.text);
      dispatch(action);
    } catch (error) {
      if (error.response) {
        dispatch(loginError(error.response.body.message));
      }
      localStorage.removeItem("jwt");
    }
  }
};
