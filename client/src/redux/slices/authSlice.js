import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from '@/services/auth.service';

const initialState = {
  user: null,
  accessToken: null,
  status: 'idle', // idle | loading | authenticated | unauthenticated
  error: null,
};

/** Wraps an auth API call so rejected thunks carry the API's structured error body (message + field errors). */
function withApiError(apiCall) {
  return async (payload, { rejectWithValue }) => {
    try {
      return await apiCall(payload);
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: err.message || 'Something went wrong.' }
      );
    }
  };
}

export const login = createAsyncThunk('auth/login', withApiError(authApi.loginUser));
export const registerUser = createAsyncThunk('auth/register', withApiError(authApi.registerUser));
export const verifyEmail = createAsyncThunk('auth/verifyEmail', withApiError(authApi.verifyEmail));
export const googleLogin = createAsyncThunk('auth/googleLogin', withApiError(authApi.googleLogin));
export const logout = createAsyncThunk('auth/logout', withApiError(authApi.logoutUser));

/** Attempts a silent session restore from the httpOnly refresh cookie on app load. */
export const bootstrapSession = createAsyncThunk(
  'auth/bootstrap',
  withApiError(authApi.refreshSession)
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Used by the axios interceptor after a successful silent token refresh. */
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
    clearCredentials(state) {
      state.user = null;
      state.accessToken = null;
      state.status = 'unauthenticated';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'unauthenticated';
        state.error = action.payload?.message;
      })

      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        // Register only creates the account — it doesn't return a session,
        // so the user is sent to /login to sign in explicitly.
        state.status = 'unauthenticated';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'unauthenticated';
        state.error = action.payload?.message;
      })

      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })

      .addCase(googleLogin.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })

      .addCase(bootstrapSession.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(bootstrapSession.rejected, (state) => {
        state.status = 'unauthenticated';
        state.user = null;
        state.accessToken = null;
      })

      .addCase(logout.fulfilled, (state) => {
        state.status = 'unauthenticated';
        state.user = null;
        state.accessToken = null;
      });
  },
});

export const { setAccessToken, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
