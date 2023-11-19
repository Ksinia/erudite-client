import { History } from 'history';
import superagent from 'superagent';
import React, { useEffect } from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { backendUrl as baseUrl } from '../runtime';
import { errorFromServer } from '../thunkActions/errorHandling';
import { RootState } from '../store';
import { ErrorLoadedAction, LogOutAction } from '../reducer/auth';
import { LoginOrSignupErrorAction } from '../reducer/error';
import TranslationContainer from './Translation/TranslationContainer';

interface OwnProps {
  history: History;
}
interface DispatchProps {
  dispatch: ThunkDispatch<
    RootState,
    unknown,
    LogOutAction | ErrorLoadedAction | LoginOrSignupErrorAction
  >;
}

type Props = OwnProps & DispatchProps;

export default function ConfirmEmail({ history, dispatch }: Props) {
  const jwtFromUrl = new URL(window.location.href).searchParams.get('jwt');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        await superagent
          .get(`${baseUrl}/confirm-email`)
          .set('Authorization', `Bearer ${jwtFromUrl}`);
        history.push('/');
      } catch (error) {
        // TODO: send error and handle it on frontend
        dispatch(errorFromServer(error, 'confirm email'));
      }
    };
    confirmEmail();
  }, [jwtFromUrl, history, dispatch]);
  return <TranslationContainer translationKey="loading" />;
}
