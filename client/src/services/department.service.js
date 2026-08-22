import { api } from './api';

export async function fetchDepartments(params = {}) {
  const { data } = await api.get('/departments', { params });
  return data.data.departments;
}
