import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL,
  withCredentials: true, // sends the httpOnly refresh-token cookie
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// The Redux store is injected after creation (see redux/store.js) rather than imported
// directly here, so this module never has to statically depend on the store — which would
// create a circular import (store -> authSlice -> auth.service -> api -> store).
let store;
export function injectStore(_store) {
  store = _store;
}

api.interceptors.request.use((config) => {
  const token = store?.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

/** Calls the refresh endpoint directly with plain axios, bypassing this instance's own interceptors. */
function performRefresh() {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${baseURL}/auth/refresh-token`, {}, { withCredentials: true })
      .then((res) => res.data.data.accessToken)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const status = error.response?.status;

    const hadAuthHeader = Boolean(originalRequest.headers?.Authorization);
    const canRetry =
      status === 401 &&
      hadAuthHeader &&
      !originalRequest._retry &&
      !originalRequest.skipAuthRefresh;

    if (canRetry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await performRefresh();
        store?.dispatch({ type: 'auth/setAccessToken', payload: newAccessToken });
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch {
        store?.dispatch({ type: 'auth/clearCredentials' });
        // fall through to standard error handling below
      }
    }

    const message =
      error.response?.data?.message || error.message || 'Something went wrong. Please try again.';

    if (!originalRequest.silentError) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);
