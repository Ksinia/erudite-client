import { ResponseError } from 'superagent';
import { MyThunkAction } from '../reducer/types';
import { ERROR, IncomingMessageTypes } from '../constants/incomingMessageTypes';
import {
  InternalMessageTypes,
  LOGOUT,
} from '../constants/internalMessageTypes';
import { loginSignupFunctionErrorCtx, logOut } from './authorization';

export const errorFromServer =
  (error: unknown, context: string): MyThunkAction<LOGOUT | ERROR> =>
  (dispatch) => {
    let errorMessage = JSON.stringify(error);
    const isResponseError = (error: unknown): error is ResponseError => {
      return !!(error as ResponseError);
    };
    if (isResponseError(error) && error.response) {
      errorMessage = error.response.body.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.debug(`error on ${context}`, errorMessage);
    let errType: IncomingMessageTypes | InternalMessageTypes =
      IncomingMessageTypes.ERROR;
    // token can expire on any page, so we need to show an error message on login page.
    // also show any error from login/signup function there
    if (
      errorMessage.includes('TokenExpiredError') ||
      context === loginSignupFunctionErrorCtx
    ) {
      errType = InternalMessageTypes.LOGIN_OR_SIGNUP_ERROR;
      dispatch(logOut());
    }
    dispatch({
      type: errType,
      payload: errorMessage,
    });
  };
