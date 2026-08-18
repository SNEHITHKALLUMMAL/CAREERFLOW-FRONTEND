import { api } from './api';

export async function fetchMyApplications() {
  const { data } = await api.get('/applications/me');
  return data.data.applications;
}

export async function withdrawApplication(id) {
  const { data } = await api.patch(`/applications/${id}/withdraw`);
  return data.data.application;
}

export async function updateApplicationStatus(id, status) {
  const { data } = await api.patch(`/applications/${id}/status`, { status });
  return data.data.application;
}

export async function scheduleInterview(id, payload) {
  const { data } = await api.post(`/applications/${id}/schedule-interview`, payload);
  return data.data.application;
}

export async function issueOfferLetter(id, payload) {
  const { data } = await api.post(`/applications/${id}/offer-letter`, payload);
  return data.data.application;
}
