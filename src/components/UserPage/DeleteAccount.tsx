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

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setErrorKey('');

    if (!password) {
      setErrorKey('password_empty');
      return;
    }

    if (!window.confirm(TRANSLATIONS[locale].confirm_delete_account)) return;

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

  return (
    <div>
      <form onSubmit={onSubmit}>
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
