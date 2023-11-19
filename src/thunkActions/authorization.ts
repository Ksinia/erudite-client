import superagent from 'superagent';
import { History } from 'history';

import { backendUrl as baseUrl } from '../runtime';
import { MyThunkAction } from '../reducer/types';

import { LoginSuccessAction } from '../reducer/auth';
import { errorFromServer } from './errorHandling';

export const loginSignupFunctionErrorCtx = 'loginSignupFunction';

export const loginSignupFunction =
  (
    type: string,
    name: string,
    password: string,
    history: History,
    email?: string
  ): MyThunkAction<LoginSuccessAction> =>
  async (dispatch) => {
    const url = `${baseUrl}/${type}`;
    try {
      let response = { text: '' };
      if (type === 'login') {
        response = await superagent.post(url).send({ name, password });
      } else if (type === 'signup') {
        response = await superagent.post(url).send({ name, password, email });
      }
      const action: LoginSuccessAction = JSON.parse(response.text);
      localStorage.setItem('jwt', action.payload.jwt);
      dispatch(action);
      const prevPageUrl = new URL(window.location.href).searchParams.get(
        'prev'
      );
      if (
        prevPageUrl &&
        prevPageUrl !== '/login' &&
        prevPageUrl !== '/signup' &&
        prevPageUrl !== '/change-password'
      ) {
        history.push(prevPageUrl);
      } else {
        history.push('/');
      }
    } catch (error) {
      dispatch(errorFromServer(error, loginSignupFunctionErrorCtx));
    }
  };

export const getProfileFetch =
  (jwt: string): MyThunkAction<LoginSuccessAction> =>
  async (dispatch) => {
    const url = `${baseUrl}/profile`;
    if (jwt) {
      try {
        const response = await superagent
          .get(url)
          .set('Authorization', `Bearer ${jwt}`);
        const action: LoginSuccessAction = JSON.parse(response.text);
        dispatch(action);
      } catch (error) {
        dispatch(errorFromServer(error, 'getProfileFetch'));
        // TODO: check if it is needed
        localStorage.removeItem('jwt');
      }
    }
  };
