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
      if (action.payload.refreshToken) {
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      }
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

type RefreshOutcome =
  | { status: 'success'; jwt: string; refreshToken: string }
  | { status: 'rejected' } // the refresh token itself was refused
  | { status: 'error' }; // transient failure, the token may still be valid

async function requestTokenRefresh(): Promise<RefreshOutcome> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return { status: 'rejected' };
  try {
    const response = await fetch(`${baseUrl}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('jwt', data.payload.jwt);
      localStorage.setItem('refreshToken', data.payload.refreshToken);
      return {
        status: 'success',
        jwt: data.payload.jwt,
        refreshToken: data.payload.refreshToken,
      };
    }
    // 5xx, request timeout and rate limiting are retryable and the refresh
    // token may still be valid, so treat them as transient; any other 4xx
    // means the refresh token itself was refused
    return response.status >= 500 ||
      response.status === 408 ||
      response.status === 429
      ? { status: 'error' }
      : { status: 'rejected' };
  } catch {
    // network failure: transient, keep the token for the next attempt
    return { status: 'error' };
  }
}

export async function refreshTokens(): Promise<{
  jwt: string;
  refreshToken: string;
} | null> {
  const outcome = await requestTokenRefresh();
  return outcome.status === 'success'
    ? { jwt: outcome.jwt, refreshToken: outcome.refreshToken }
    : null;
}

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
      } catch (error: any) {
        if (error?.status === 401) {
          const outcome = await requestTokenRefresh();
          if (outcome.status === 'success') {
            try {
              const retryResponse = await superagent
                .get(url)
                .set('Authorization', `Bearer ${outcome.jwt}`);
              const action: LoginSuccessAction = JSON.parse(retryResponse.text);
              dispatch(action);
              return;
            } catch (retryError: any) {
              dispatch(errorFromServer(retryError, 'getProfileFetch'));
              if (retryError?.status !== 401) {
                // a non-401 failure after a successful refresh (network, 5xx
                // or a 4xx unrelated to the token): the refreshed credentials
                // were not rejected, so keep them
                return;
              }
              // a freshly refreshed token was still rejected: session is gone
            }
          } else if (outcome.status === 'error') {
            // the refresh endpoint was temporarily unreachable, the refresh
            // token may still be valid: keep tokens and retry on next launch.
            // deliberately no errorFromServer here: the original error is the
            // expired-token 401, which errorFromServer turns into a logOut
            // that would wipe the very tokens we are trying to preserve
            return;
          }
          // the token and its refresh were both refused: clear credentials
          localStorage.removeItem('jwt');
          localStorage.removeItem('refreshToken');
        } else {
          // any non-401 profile failure (network, 5xx, or a 4xx such as
          // 403/404): the server did not reject the stored credentials, so
          // keep them and let the next launch retry with the same session.
          // only an explicit 401 (handled above) discards credentials
          dispatch(errorFromServer(error, 'getProfileFetch'));
        }
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
      if (action.payload.refreshToken) {
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      }
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
