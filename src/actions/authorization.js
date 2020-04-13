import superagent from "superagent";
import { url as baseUrl } from "../url";

export const LOGIN_OR_SIGNUP_ERROR = "LOGIN_OR_SIGNUP_ERROR";
export const LOGOUT = "LOGOUT";

//this action is created on server side
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";

const loginError = (error) => {
  return {
    type: LOGIN_OR_SIGNUP_ERROR,
    payload: error,
  };
};
export const logOut = () => {
  localStorage.removeItem("jwt");
  return {
    type: LOGOUT,
  };
};

export const loginSignupFunction = (type, name, password, history) => async (
  dispatch
) => {
  const url = `${baseUrl}/${type}`;
  try {
    const response = await superagent.post(url).send({ name, password });
    const action = JSON.parse(response.text);
    localStorage.setItem("jwt", action.payload.jwt);
    dispatch(action);
    // dispatch the action that there is no errors
    dispatch(loginError(null));
    history.goBack();
  } catch (error) {
    console.log("error test:", error);
    console.log(error.response.body);
    dispatch(loginError(error.response.body));
  }
};

export const getProfileFetch = () => async (dispatch) => {
  const jwt = localStorage.jwt;
  const url = `${baseUrl}/profile`;
  if (jwt) {
    try {
      const response = await superagent
        .get(url)
        .set("Authorization", `Bearer ${jwt}`);
      const action = JSON.parse(response.text);
      dispatch(action);
    } catch (error) {
      console.error();
      localStorage.removeItem("jwt");
    }
  }
};
