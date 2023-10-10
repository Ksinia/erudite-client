import superagent from 'superagent';
import parser from 'ua-parser-js';
import { backendUrl as baseUrl } from '../runtime';
import {
  InternalMessageTypes,
  SUBSCRIPTION_REGISTERED,
} from '../constants/internalMessageTypes';
import { MyThunkAction } from '../reducer/types';
import { errorFromServer } from './errorHandling';
import { loginSignupFunctionErrorCtx } from './authorization';

function getJWT(): string | null {
  return localStorage.getItem('jwt');
}

async function callApi(
  method: keyof Pick<typeof superagent, 'get' | 'post'>,
  path: string,
  body?: object | string
) {
  const jwt = getJWT();
  if (jwt) {
    const response = await superagent[method](`${baseUrl}/${path}`)
      .send(body)
      .set('Authorization', `Bearer ${jwt}`);

    return JSON.parse(response.text);
  } else {
    throw new Error('unauthorzied');
  }
}

export const saveSubscriptionForUser =
  (subscription: PushSubscription): MyThunkAction<SUBSCRIPTION_REGISTERED> =>
  async (dispatch): Promise<SUBSCRIPTION_REGISTERED | undefined> => {
    const ua = parser(window.navigator.userAgent);
    const userAgent = `${ua.browser.name} on ${ua.os.name}`;
    try {
      return callApi(
        'post',
        'subscribe',
        JSON.parse(JSON.stringify({ subscription, userAgent }))
      ); // TODO: Check return code
    } catch (error) {
      dispatch(errorFromServer(error, loginSignupFunctionErrorCtx));
    }
  };

export const storeSubscription = (
  subscription: PushSubscription
): SUBSCRIPTION_REGISTERED => ({
  type: InternalMessageTypes.SUBSCRIPTION_REGISTERED,
  payload: subscription,
});
