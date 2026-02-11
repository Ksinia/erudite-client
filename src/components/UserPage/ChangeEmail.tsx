import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { backendUrl as baseUrl } from '../../runtime';
import { RootState } from '../../reducer';
import { updateEmail } from '../../reducer/auth';
import TranslationContainer from '../Translation/TranslationContainer';
import styles from './UserPage.module.css';

export default function ChangeEmail() {
  const [email, setEmail] = useState('');
  const [changed, setChanged] = useState(false);
  const [errorKey, setErrorKey] = useState('');

  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  if (!user) return null;

  const currentEmail = user.email || '';

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setErrorKey('');
    setChanged(false);

    const trimmed = email.trim();

    if (!trimmed) {
      setErrorKey('email_empty');
      return;
    }

    if (!trimmed.includes('@')) {
      setErrorKey('invalid_email');
      return;
    }

    const url = `${baseUrl}/change-email`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: trimmed }),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(updateEmail(data.email));
        setEmail('');
        setChanged(true);
        setErrorKey('');
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
      <h3>
        <TranslationContainer translationKey="expand_change_email" />
      </h3>
      <p>
        <TranslationContainer translationKey="current_email" />
        {': '}
        {currentEmail || <TranslationContainer translationKey="no_email" />}
      </p>
      <form onSubmit={onSubmit}>
        <label>
          <TranslationContainer translationKey="enter_new_email" />
        </label>
        <input
          className={styles.input}
          type="email"
          name="email"
          onChange={(e) => setEmail(e.currentTarget.value)}
          value={email}
        />
        <button className={styles.confirmButton}>
          <TranslationContainer translationKey="confirm" />
        </button>
      </form>
      {changed && (
        <p>
          <TranslationContainer translationKey="email_changed" />
        </p>
      )}
      {errorKey && (
        <p style={{ color: 'red' }}>
          <TranslationContainer translationKey={errorKey} />
        </p>
      )}
    </div>
  );
}
