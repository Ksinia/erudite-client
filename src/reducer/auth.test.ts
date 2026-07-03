import reducer, { errorLoaded, loginSuccess, logOut } from './auth';
import { User } from './types';

const user: User = { id: 1, name: 'test', jwt: 'test-jwt' };

describe('auth reducer', () => {
  it('keeps the user when a server error is loaded', () => {
    expect(reducer(user, errorLoaded('something went wrong'))).toEqual(user);
  });

  it('stores the user on login success', () => {
    expect(reducer(null, loginSuccess(user))).toEqual(user);
  });

  it('clears the user and tokens on logout', () => {
    localStorage.setItem('jwt', 'test-jwt');
    localStorage.setItem('refreshToken', 'test-refresh');
    expect(reducer(user, logOut())).toBeNull();
    expect(localStorage.getItem('jwt')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
  });
});
