import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LoginSignup.module.css';

import TranslationContainer from './Translation/TranslationContainer';

type OwnProps = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.SyntheticEvent) => void;
  values: { name: string; password: string; email?: string };
  error: string | null;
  isSignUp: boolean;
};

export default function LoginSignup(props: OwnProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <TranslationContainer
          translationKey={props.isSignUp ? 'sign_up' : 'log_in'}
        />
      </h1>
      <form onSubmit={props.onSubmit} noValidate>
        <label>
          <TranslationContainer
            translationKey={props.isSignUp ? 'login' : 'login_or_email'}
          />
          <input
            type="text"
            id="name"
            name="name"
            required
            autoComplete="username"
            autoFocus
            onChange={props.onChange}
            value={props.values.name}
            className={styles.input}
          />
        </label>
        {props.isSignUp && (
          <label>
            <TranslationContainer translationKey="email" />
            <input
              type="text"
              id="email"
              name="email"
              required
              autoComplete="email"
              onChange={props.onChange}
              value={props.values.email}
              className={styles.input}
            />
          </label>
        )}
        <label>
          <TranslationContainer translationKey="password" />
          <input
            type="password"
            id="password"
            name="password"
            required
            autoComplete={props.isSignUp ? 'new-password' : 'current-password'}
            onChange={props.onChange}
            value={props.values.password}
            className={styles.input}
          />
        </label>
        {props.error && (
          <p className={styles.errorMessage}>
            <TranslationContainer translationKey={props.error} />
          </p>
        )}
        <button type="submit" className={styles.submitButton}>
          <TranslationContainer
            translationKey={props.isSignUp ? 'sign_up' : 'log_in'}
          />
        </button>
        <div className={styles.links}>
          {props.isSignUp ? (
            <Link to="/login">
              <TranslationContainer translationKey="already_signed_up" />
            </Link>
          ) : (
            <>
              <Link to="/signup">
                <TranslationContainer translationKey="no_account" />
              </Link>
              <Link to="/forgot-password">
                <TranslationContainer translationKey="forgot" />
              </Link>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
