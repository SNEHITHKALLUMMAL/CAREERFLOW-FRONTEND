import { api } from './api';

export async function createTask(payload) {
  const { data } = await api.post('/tasks', payload);
  return data.data.task;
}

export async function fetchMyTasks() {
  const { data } = await api.get('/tasks/mine');
  return data.data.tasks;
}

export async function fetchTasksCreatedByMe() {
  const { data } = await api.get('/tasks/created');
  return data.data.tasks;
}

export async function completeTask(taskId) {
  const { data } = await api.patch(`/tasks/${taskId}/complete`);
  return data.data.task;
}

export async function updateTask(taskId, payload) {
  const { data } = await api.patch(`/tasks/${taskId}`, payload);
  return data.data.task;
}

export async function cancelTask(taskId) {
  const { data } = await api.delete(`/tasks/${taskId}`);
  return data.data.task;
}
