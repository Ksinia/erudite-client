import {ResponseError} from "superagent";
import {MyThunkAction} from "../reducer/types";
import {ERROR} from "../constants/incomingMessageTypes";
import {LOGIN_OR_SIGNUP_ERROR} from "../constants/internalMessageTypes";
import {logOut} from "./authorization";

export const errorFromServer = (error: unknown, context:string): MyThunkAction => dispatch => {
  let errorMessage = JSON.stringify(error)
  const isResponseError = (error: unknown): error is ResponseError=>{return !!(error as ResponseError)}
  if (isResponseError(error) && error.response) {
    errorMessage = error.response.body.message
  } else if (error instanceof Error) {
    errorMessage = error.message
  }

  console.debug(`error on ${context}`, errorMessage);
  let errType = ERROR
  if (errorMessage.includes('TokenExpiredError')) {
    errType = LOGIN_OR_SIGNUP_ERROR
    dispatch(logOut())
  }
  dispatch({
    type: errType,
    payload: errorMessage,
  });
};