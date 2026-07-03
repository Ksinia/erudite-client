import superagent from 'superagent';
import { InternalMessageTypes } from '../constants/internalMessageTypes';
import { getProfileFetch } from './authorization';

jest.mock('superagent');

const mockedGet = superagent.get as jest.Mock;

const profileRequest = (result: {
  resolve?: object;
  reject?: object;
}): { set: jest.Mock } => ({
  set: result.resolve
    ? jest.fn().mockResolvedValue(result.resolve)
    : jest.fn().mockRejectedValue(result.reject),
});

// an expired access token comes back as a superagent 401 whose body message
// is TokenExpiredError; errorFromServer turns exactly that into a logOut
const expiredTokenError = {
  status: 401,
  response: { body: { message: 'TokenExpiredError: jwt expired' } },
};

// dispatch that records actions and executes nested thunks, so side effects
// like errorFromServer -> logOut actually run and can be asserted on
const runThunk = async () => {
  const dispatched: Array<{ type?: string } | unknown> = [];
  const getState = () => ({ translation: { locale: 'en_US' } });
  const dispatch = (action: unknown): unknown => {
    dispatched.push(action);
    if (typeof action === 'function') {
      return (action as (d: typeof dispatch, g: typeof getState) => unknown)(
        dispatch,
        getState
      );
    }
    return action;
  };
  await (
    getProfileFetch('old-jwt') as unknown as (
      dispatch: (action: unknown) => unknown
    ) => Promise<void>
  )(dispatch);
  return dispatched;
};

const loggedOut = (dispatched: Array<{ type?: string } | unknown>) =>
  dispatched.some(
    (a) => (a as { type?: string })?.type === InternalMessageTypes.LOGOUT
  );

describe('getProfileFetch', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    localStorage.setItem('jwt', 'old-jwt');
    localStorage.setItem('refreshToken', 'old-refresh');
  });

  afterEach(() => {
    localStorage.clear();
    delete (global as { fetch?: unknown }).fetch;
  });

  it('keeps tokens when the profile request fails with a network error', async () => {
    mockedGet.mockReturnValue(
      profileRequest({ reject: { code: 'ECONNREFUSED' } })
    );

    await runThunk();

    expect(localStorage.getItem('jwt')).toBe('old-jwt');
    expect(localStorage.getItem('refreshToken')).toBe('old-refresh');
  });

  it('keeps tokens on a non-401 profile error and does not attempt a refresh', async () => {
    mockedGet.mockReturnValue(profileRequest({ reject: { status: 403 } }));
    const fetchMock = jest.fn();
    (global as { fetch?: unknown }).fetch = fetchMock;

    const dispatched = await runThunk();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(localStorage.getItem('jwt')).toBe('old-jwt');
    expect(localStorage.getItem('refreshToken')).toBe('old-refresh');
    expect(loggedOut(dispatched)).toBe(false);
  });

  it('clears tokens when the token and its refresh are both refused', async () => {
    mockedGet.mockReturnValue(profileRequest({ reject: expiredTokenError }));
    (global as { fetch?: unknown }).fetch = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 401 });

    await runThunk();

    expect(localStorage.getItem('jwt')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
  });

  it('keeps tokens and does not log out when refresh is down (5xx) after an expired-token 401', async () => {
    mockedGet.mockReturnValue(profileRequest({ reject: expiredTokenError }));
    (global as { fetch?: unknown }).fetch = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 503 });

    const dispatched = await runThunk();

    expect(localStorage.getItem('jwt')).toBe('old-jwt');
    expect(localStorage.getItem('refreshToken')).toBe('old-refresh');
    expect(loggedOut(dispatched)).toBe(false);
  });

  it('keeps tokens when the refresh endpoint rate-limits (429)', async () => {
    mockedGet.mockReturnValue(profileRequest({ reject: expiredTokenError }));
    (global as { fetch?: unknown }).fetch = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 429 });

    const dispatched = await runThunk();

    expect(localStorage.getItem('jwt')).toBe('old-jwt');
    expect(localStorage.getItem('refreshToken')).toBe('old-refresh');
    expect(loggedOut(dispatched)).toBe(false);
  });

  it('keeps tokens when the refresh request throws (network error)', async () => {
    mockedGet.mockReturnValue(profileRequest({ reject: expiredTokenError }));
    (global as { fetch?: unknown }).fetch = jest
      .fn()
      .mockRejectedValue(new Error('network down'));

    const dispatched = await runThunk();

    expect(localStorage.getItem('jwt')).toBe('old-jwt');
    expect(localStorage.getItem('refreshToken')).toBe('old-refresh');
    expect(loggedOut(dispatched)).toBe(false);
  });

  it('keeps refreshed tokens when the retry fails transiently', async () => {
    mockedGet
      .mockReturnValueOnce(profileRequest({ reject: expiredTokenError }))
      .mockReturnValueOnce(profileRequest({ reject: { code: 'ECONNRESET' } }));
    (global as { fetch?: unknown }).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        payload: { jwt: 'new-jwt', refreshToken: 'new-refresh' },
      }),
    });

    await runThunk();

    expect(localStorage.getItem('jwt')).toBe('new-jwt');
    expect(localStorage.getItem('refreshToken')).toBe('new-refresh');
  });

  it('updates the user when refresh and retry succeed', async () => {
    const action = {
      type: 'LOGIN_SUCCESS',
      payload: { id: 1, name: 'test', jwt: 'new-jwt' },
    };
    mockedGet
      .mockReturnValueOnce(profileRequest({ reject: expiredTokenError }))
      .mockReturnValueOnce(
        profileRequest({ resolve: { text: JSON.stringify(action) } })
      );
    (global as { fetch?: unknown }).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        payload: { jwt: 'new-jwt', refreshToken: 'new-refresh' },
      }),
    });

    const dispatched = await runThunk();

    expect(dispatched).toContainEqual(action);
    expect(localStorage.getItem('jwt')).toBe('new-jwt');
    expect(localStorage.getItem('refreshToken')).toBe('new-refresh');
  });

  it('clears tokens when the retry is rejected with 401 again', async () => {
    mockedGet
      .mockReturnValueOnce(profileRequest({ reject: expiredTokenError }))
      .mockReturnValueOnce(profileRequest({ reject: { status: 401 } }));
    (global as { fetch?: unknown }).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        payload: { jwt: 'new-jwt', refreshToken: 'new-refresh' },
      }),
    });

    await runThunk();

    expect(localStorage.getItem('jwt')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
  });
});
