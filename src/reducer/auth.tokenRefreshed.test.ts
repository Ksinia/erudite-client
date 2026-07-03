import reducer, { tokenRefreshed } from './auth';
import { User } from './types';

const user: User = {
  id: 1,
  name: 'test',
  jwt: 'old-jwt',
  email: 'test@example.com',
};

describe('auth reducer: tokenRefreshed', () => {
  it('replaces the jwt on the current user, keeping other fields', () => {
    expect(reducer(user, tokenRefreshed('new-jwt'))).toEqual({
      ...user,
      jwt: 'new-jwt',
    });
  });

  it('is a no-op when there is no user', () => {
    expect(reducer(null, tokenRefreshed('new-jwt'))).toBeNull();
  });
});
