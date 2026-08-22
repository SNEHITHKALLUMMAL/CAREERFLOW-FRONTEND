import { api } from './api';

export async function fetchPlatformStats() {
  const { data } = await api.get('/admin/stats');
  return data.data;
}

export async function fetchRecentActivity(params = {}) {
  const { data } = await api.get('/admin/activity', { params });
  return data.data.entries;
}

export async function fetchUsers(params = {}) {
  const { data } = await api.get('/admin/users', { params });
  return data.data;
}

export async function setUserActive(userId, isActive) {
  const { data } = await api.patch(`/admin/users/${userId}/status`, { isActive });
  return data.data;
}
