import { describe, it, expect } from 'vitest';
import authReducer, {
  setAccessToken,
  clearCredentials,
  login,
  registerUser,
  bootstrapSession,
} from '@/redux/slices/authSlice';

const initialState = { user: null, accessToken: null, status: 'idle', error: null };

describe('authSlice reducer', () => {
  it('returns the initial state', () => {
    expect(authReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('setAccessToken updates only the access token', () => {
    const state = authReducer(initialState, setAccessToken('new-token'));
    expect(state.accessToken).toBe('new-token');
    expect(state.user).toBeNull();
  });

  it('clearCredentials resets user/token and marks unauthenticated', () => {
    const loggedIn = {
      user: { id: '1' },
      accessToken: 'abc',
      status: 'authenticated',
      error: null,
    };
    const state = authReducer(loggedIn, clearCredentials());

    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.status).toBe('unauthenticated');
  });

  it('login.pending sets status to loading and clears previous error', () => {
    const state = authReducer(
      { ...initialState, error: 'previous error' },
      { type: login.pending.type }
    );
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('login.fulfilled stores the user and access token', () => {
    const payload = { user: { id: '1', name: 'Asha' }, accessToken: 'access-123' };
    const state = authReducer(initialState, { type: login.fulfilled.type, payload });

    expect(state.status).toBe('authenticated');
    expect(state.user).toEqual(payload.user);
    expect(state.accessToken).toBe('access-123');
  });

  it('login.rejected surfaces the API error message', () => {
    const state = authReducer(initialState, {
      type: login.rejected.type,
      payload: { message: 'Invalid email or password.' },
    });
    expect(state.status).toBe('unauthenticated');
    expect(state.error).toBe('Invalid email or password.');
  });

  it('registerUser.fulfilled leaves the user unauthenticated (must verify email first)', () => {
    const state = authReducer(
      { ...initialState, status: 'loading' },
      { type: registerUser.fulfilled.type, payload: {} }
    );
    expect(state.status).toBe('unauthenticated');
  });

  it('bootstrapSession.rejected clears any stale session state', () => {
    const stale = { user: { id: '1' }, accessToken: 'old', status: 'loading', error: null };
    const state = authReducer(stale, { type: bootstrapSession.rejected.type });

    expect(state.status).toBe('unauthenticated');
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
  });
});
