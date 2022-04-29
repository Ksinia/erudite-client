import superagent from "superagent";
import { AnyAction } from "redux";
import { History } from "history";

import { url as baseUrl } from "../url";
import { MyThunkAction } from "../reducer/types";

import {
  LOGIN_OR_SIGNUP_ERROR,
  CLEAR_ERROR,
  LOGOUT,
} from "../constants/internalMessageTypes";

export const loginError = (error: string): AnyAction => {
  return {
    type: LOGIN_OR_SIGNUP_ERROR,
    payload: error,
  };
};

export const clearError = () => {
  return {
    type: CLEAR_ERROR,
  };
};

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
      dispatch(loginError(error.response.body.message));
    }
  }
};

export const getProfileFetch = (jwt: string): MyThunkAction => async (
  dispatch
) => {
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
