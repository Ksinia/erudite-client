import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LogIn.module.css';

import TranslationContainer from './Translation/TranslationContainer';

type OwnProps = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.SyntheticEvent) => void;
  values: { name: string; password: string };
  error: string | null;
};

export default function LogIn(props: OwnProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <TranslationContainer translationKey="log_in" />
      </h1>
      <form onSubmit={props.onSubmit} noValidate>
        <label>
          <TranslationContainer translationKey="name" />
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
        <label>
          <TranslationContainer translationKey="password" />
          <input
            type="password"
            id="password"
            name="password"
            required
            autoComplete="current-password"
            onChange={props.onChange}
            value={props.values.password}
            className={styles.input}
          />
        </label>
        <p className={styles.errorMessage}>{props.error}</p>
        <button type="submit" className={styles.submitButton}>
          <TranslationContainer translationKey="log_in" />
        </button>
        <div className={styles.links}>
          <Link to="/signup">
            <TranslationContainer translationKey="no_account" />
          </Link>
          <Link to="/forgot-password">
            <TranslationContainer translationKey="forgot" />
          </Link>
        </div>
      </form>
    </div>
  );
}
