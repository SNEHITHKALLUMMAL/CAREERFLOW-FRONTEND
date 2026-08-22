import { api } from './api';

export async function fetchDrives() {
  const { data } = await api.get('/drives');
  return data.data.drives;
}

export async function fetchDrive(id) {
  const { data } = await api.get(`/drives/${id}`);
  return data.data.drive;
}

export async function createDrive(payload) {
  const { data } = await api.post('/drives', payload);
  return data.data.drive;
}

export async function updateDriveStatus(id, status) {
  const { data } = await api.patch(`/drives/${id}/status`, { status });
  return data.data.drive;
}

export async function fetchEligibleStudents(id) {
  const { data } = await api.get(`/drives/${id}/eligible-students`);
  return data.data.students;
}
