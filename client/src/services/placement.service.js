import { api } from './api';

export async function fetchPlacementAnalytics() {
  const { data } = await api.get('/placement/analytics');
  return data.data;
}

export async function fetchStudentAnalytics(params = {}) {
  const { data } = await api.get('/placement/students', { params });
  return data.data;
}

export async function fetchRecruitersForPlacement() {
  const { data } = await api.get('/placement/recruiters');
  return data.data.recruiters;
}

export async function fetchCareerAnalytics() {
  const { data } = await api.get('/placement/career-analytics');
  return data.data;
}
