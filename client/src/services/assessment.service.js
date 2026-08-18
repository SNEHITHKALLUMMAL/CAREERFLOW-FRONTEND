import { api } from './api';

export async function fetchAssessments({ type, page, limit } = {}) {
  const { data } = await api.get('/assessments', { params: { type, page, limit } });
  return data.data;
}

export async function fetchAssessment(id) {
  const { data } = await api.get(`/assessments/${id}`);
  return data.data.assessment;
}

export async function startAttempt(id) {
  const { data } = await api.post(`/assessments/${id}/attempt/start`);
  return data.data.attempt;
}

export async function submitAttempt(id, answers) {
  const { data } = await api.post(`/assessments/${id}/attempt/submit`, { answers });
  return data.data.attempt;
}

export async function fetchLeaderboard(id) {
  const { data } = await api.get(`/assessments/${id}/leaderboard`);
  return data.data.leaderboard;
}

export async function fetchResult(id, studentId) {
  const { data } = await api.get(`/assessments/${id}/result/${studentId}`);
  return data.data;
}

export async function fetchMyAttempts() {
  const { data } = await api.get('/assessments/me/attempts');
  return data.data.attempts;
}
