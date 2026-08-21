import { api } from './api';

export async function registerUser(payload) {
  const { data } = await api.post('/auth/register', payload);
  return data.data;
}

export async function verifyEmail(payload) {
  const { data } = await api.post('/auth/verify-email', payload);
  return data.data;
}

export async function resendOtp(payload) {
  const { data } = await api.post('/auth/resend-otp', payload);
  return data.data;
}

export async function loginUser(payload) {
  const { data } = await api.post('/auth/login', payload);
  return data.data;
}

export async function googleLogin(payload) {
  const { data } = await api.post('/auth/google', payload);
  return data.data;
}

/** Uses the httpOnly refresh cookie; no body needed. Silent (no toast) by default. */
export async function refreshSession() {
  const { data } = await api.post(
    '/auth/refresh-token',
    {},
    { silentError: true, skipAuthRefresh: true }
  );
  return data.data;
}

export async function logoutUser() {
  const { data } = await api.post('/auth/logout', {}, { skipAuthRefresh: true });
  return data.data;
}

export async function forgotPassword(payload) {
  const { data } = await api.post('/auth/forgot-password', payload);
  return data.data;
}

export async function resetPassword(payload) {
  const { data } = await api.post('/auth/reset-password', payload);
  return data.data;
}

export async function fetchMe() {
  const { data } = await api.get('/auth/me');
  return data.data;
}
