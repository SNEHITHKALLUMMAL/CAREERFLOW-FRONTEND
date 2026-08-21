import { api } from './api';

export async function fetchMyNotifications({ unreadOnly } = {}) {
  const { data } = await api.get('/notifications/me', { params: { unreadOnly } });
  return data.data.notifications;
}

export async function markNotificationRead(id) {
  const { data } = await api.patch(`/notifications/${id}/read`);
  return data.data.notification;
}

export async function markAllNotificationsRead() {
  await api.patch('/notifications/me/read-all');
}

export async function sendNotification(payload) {
  const { data } = await api.post('/notifications', payload);
  return data.data;
}
