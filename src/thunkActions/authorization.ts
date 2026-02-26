import superagent from 'superagent';
import { RouteComponentProps } from 'react-router-dom';

import { backendUrl as baseUrl } from '../runtime';
import { MyThunkAction } from '../reducer/types';
import { TRANSLATIONS } from '../constants/translations';

import { LoginSuccessAction } from '../reducer/auth';
import { errorFromServer } from './errorHandling';

export const loginSignupFunctionErrorCtx = 'loginSignupFunction';

declare global {
  interface Window {
    AppleID?: {
      auth: {
        init: (config: {
          clientId: string;
          scope: string;
          redirectURI: string;
          usePopup: boolean;
        }) => void;
        signIn: () => Promise<{
          authorization: { id_token: string; code: string };
          user?: {
            name?: { firstName?: string; lastName?: string };
            email?: string;
          };
        }>;
      };
    };
  }
}

export const loginSignupFunction =
  (
    type: string,
    name: string,
    password: string,
    history: RouteComponentProps['history'],
    email?: string
  ): MyThunkAction<LoginSuccessAction> =>
  async (dispatch, getState) => {
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

      if (type === 'signup') {
        const locale = getState().translation?.locale ?? 'en_US';
        const message =
          TRANSLATIONS[locale]?.signup_success ??
          'You have signed up successfully!';
        window.alert(message);
      }

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

export const appleSignIn =
  (
    history: RouteComponentProps['history']
  ): MyThunkAction<LoginSuccessAction> =>
  async (dispatch) => {
    try {
      if (!window.AppleID) {
        throw new Error('apple_signin_failed');
      }

      const clientId = process.env.REACT_APP_APPLE_SERVICE_ID;
      if (!clientId) {
        console.error('REACT_APP_APPLE_SERVICE_ID is not configured');
        throw new Error('apple_signin_failed');
      }

      window.AppleID.auth.init({
        clientId,
        scope: 'name email',
        redirectURI: window.location.origin,
        usePopup: true,
      });

      const result = await window.AppleID.auth.signIn();

      const response = await fetch(`${baseUrl}/auth/apple`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identityToken: result.authorization.id_token,
          fullName: result.user?.name
            ? {
                givenName: result.user.name.firstName,
                familyName: result.user.name.lastName,
              }
            : null,
          email: result.user?.email || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data?.message) throw new Error(data.message);
        throw new Error(`${response.status}: ${response.statusText}`);
      }

      const action: LoginSuccessAction = data;
      localStorage.setItem('jwt', action.payload.jwt);
      dispatch(action);

      const prevPageUrl = new URL(window.location.href).searchParams.get(
        'prev'
      );
      if (
        prevPageUrl &&
        prevPageUrl !== '/login' &&
        prevPageUrl !== '/signup'
      ) {
        history.push(prevPageUrl);
      } else {
        history.push('/');
      }
    } catch (error) {
      const appleError = error as { error?: string };
      if (appleError?.error === 'popup_closed_by_user') {
        return;
      }
      console.error('Apple sign-in error:', error);
      dispatch(errorFromServer(error, loginSignupFunctionErrorCtx));
    }
  };
