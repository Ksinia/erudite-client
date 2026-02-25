import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { backendUrl as baseUrl } from '../../runtime';
import { RootState } from '../../reducer';
import { logOut } from '../../reducer/auth';
import TranslationContainer from '../Translation/TranslationContainer';
import { TRANSLATIONS } from '../../constants/translations';
import styles from './UserPage.module.css';

export default function DeleteAccount() {
  const [password, setPassword] = useState('');
  const [errorKey, setErrorKey] = useState('');

  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  if (!user) return null;

  const locale = localStorage.getItem('locale') || 'en_US';
  const isAppleUser = user.authMethod === 'apple';

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setErrorKey('');

    if (!isAppleUser && !password) {
      setErrorKey('password_empty');
      return;
    }

    if (!window.confirm(TRANSLATIONS[locale].confirm_delete_account)) return;

    if (isAppleUser) {
      await doAppleDelete();
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/delete-account`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        dispatch(logOut());
        window.location.href = '/';
      } else {
        try {
          const data = await response.json();
          setErrorKey(data.message || 'send_failed');
        } catch {
          setErrorKey('send_failed');
        }
      }
    } catch {
      setErrorKey('send_failed');
    }
  };

  const doAppleDelete = async () => {
    if (!window.AppleID) {
      setErrorKey('apple_signin_failed');
      return;
    }
    try {
      window.AppleID.auth.init({
        clientId: process.env.REACT_APP_APPLE_SERVICE_ID || '',
        scope: '',
        redirectURI: window.location.origin,
        usePopup: true,
      });
      const result = await window.AppleID.auth.signIn();

      const response = await fetch(`${baseUrl}/delete-account`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identityToken: result.authorization.id_token }),
      });

      if (response.ok) {
        dispatch(logOut());
        window.location.href = '/';
      } else {
        try {
          const data = await response.json();
          setErrorKey(data.message || 'send_failed');
        } catch {
          setErrorKey('send_failed');
        }
      }
    } catch {
      setErrorKey('apple_signin_failed');
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        {isAppleUser ? (
          <label>
            <TranslationContainer translationKey="confirm_delete_apple" />
          </label>
        ) : (
          <>
            <label>
              <TranslationContainer translationKey="enter_password_to_delete" />
            </label>
            <input
              className={styles.input}
              type="password"
              name="password"
              onChange={(e) => setPassword(e.currentTarget.value)}
              value={password}
            />
          </>
        )}
        <button className={styles.deleteButton}>
          <TranslationContainer translationKey="expand_delete_account" />
        </button>
      </form>
      {errorKey && (
        <p style={{ color: 'red' }}>
          <TranslationContainer translationKey={errorKey} />
        </p>
      )}
    </div>
  );
}
