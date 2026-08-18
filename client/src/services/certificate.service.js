import { api } from './api';

export async function fetchMyCertificates() {
  const { data } = await api.get('/certificates/me');
  return data.data.certificates;
}
