import { api } from './api';

export async function fetchResumeHistory() {
  const { data } = await api.get('/resumes/history');
  return data.data.resumes;
}

export async function fetchAtsScore(resumeId) {
  const { data } = await api.get(`/resumes/${resumeId}/ats-score`);
  return data.data;
}

export async function buildResume(payload) {
  const { data } = await api.post('/resumes/build', payload);
  return data.data.resume;
}

export async function rebuildResume(resumeId, payload) {
  const { data } = await api.post(`/resumes/${resumeId}/rebuild`, payload);
  return data.data.resume;
}
