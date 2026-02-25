import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { appleSignIn } from '../thunkActions/authorization';

export default function AppleSignInButton() {
  const dispatch = useDispatch();
  const history = useHistory();

  if (!window.AppleID) return null;

  return (
    <button
      type="button"
      onClick={() => dispatch(appleSignIn(history))}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: '100%',
        padding: 12,
        backgroundColor: '#000',
        color: '#fff',
        border: 'none',
        borderRadius: 4,
        fontSize: 16,
        cursor: 'pointer',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M13.71 9.53c-.02-2.08 1.7-3.08 1.78-3.13-0.97-1.42-2.48-1.61-3.01-1.63-1.28-.13-2.5.75-3.15.75-.65 0-1.65-.73-2.72-.71-1.4.02-2.69.81-3.41 2.07-1.45 2.52-.37 6.26 1.04 8.31.69 1 1.51 2.13 2.59 2.09 1.04-.04 1.43-.67 2.69-.67 1.25 0 1.61.67 2.71.65 1.12-.02 1.83-1.02 2.51-2.03.79-1.16 1.12-2.28 1.14-2.34-.02-.01-2.18-.84-2.2-3.33zM11.62 3.43c.57-.7.96-1.66.85-2.63-.82.03-1.82.55-2.41 1.24-.53.61-.99 1.59-.87 2.52.92.07 1.86-.46 2.43-1.13z"
          fill="white"
        />
      </svg>
      Sign in with Apple
    </button>
  );
}
