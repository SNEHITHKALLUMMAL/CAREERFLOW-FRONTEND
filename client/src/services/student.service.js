import { api } from './api';

export async function fetchMyProfile() {
  const { data } = await api.get('/students/me');
  return data.data.student;
}

export async function fetchMyCompletion() {
  const { data } = await api.get('/students/me/completion');
  return data.data;
}

export async function updateMyProfile(payload) {
  const { data } = await api.patch('/students/me', payload);
  return data.data.student;
}

export async function addItem(field, payload) {
  const { data } = await api.post(`/students/me/${field}`, payload);
  return data.data.item;
}

export async function updateItem(field, itemId, payload) {
  const { data } = await api.patch(`/students/me/${field}/${itemId}`, payload);
  return data.data.item;
}

export async function removeItem(field, itemId) {
  await api.delete(`/students/me/${field}/${itemId}`);
}

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append('resume', file);
  const { data } = await api.post('/students/me/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data.resume;
}
