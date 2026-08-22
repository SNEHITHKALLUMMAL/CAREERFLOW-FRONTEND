import { api } from './api';

export async function fetchMyRecruiterProfile() {
  const { data } = await api.get('/recruiters/me');
  return data.data.recruiter;
}

export async function updateMyRecruiterProfile(payload) {
  const { data } = await api.patch('/recruiters/me', payload);
  return data.data.recruiter;
}
