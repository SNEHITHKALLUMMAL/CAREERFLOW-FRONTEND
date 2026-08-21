import { api } from './api';

export async function generateReport(scope) {
  const { data } = await api.post('/reports/generate', { scope });
  return data.data.report;
}

export async function fetchMyReports() {
  const { data } = await api.get('/reports/me');
  return data.data.reports;
}
