import { ResponseError } from 'superagent';
import { MyThunkAction } from '../reducer/types';
import {
  errorLoaded,
  ErrorLoadedAction,
  logOut,
  LogOutAction,
} from '../reducer/auth';
import { loginOrSignupError, LoginOrSignupErrorAction } from '../reducer/error';
import { loginSignupFunctionErrorCtx } from './authorization';

export const errorFromServer =
  (
    error: unknown,
    context: string
  ): MyThunkAction<
    LogOutAction | ErrorLoadedAction | LoginOrSignupErrorAction
  > =>
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
    // token can expire on any page, so we need to show an error message on login page.
    // also show any error from login/signup function there
    if (
      errorMessage.includes('TokenExpiredError') ||
      context === loginSignupFunctionErrorCtx
    ) {
      dispatch(logOut());
      dispatch(loginOrSignupError(errorMessage));
    }
    dispatch(errorLoaded(errorMessage));
  };
