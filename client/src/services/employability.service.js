import { api } from './api';

export async function fetchMyEmployability() {
  const { data } = await api.get('/employability/me');
  return data.data;
}
