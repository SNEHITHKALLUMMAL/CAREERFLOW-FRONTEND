import { api } from './api';

export async function fetchMentors() {
  const { data } = await api.get('/mentors');
  return data.data.mentors;
}

export async function fetchMentorStudents(mentorId) {
  const { data } = await api.get(`/mentors/${mentorId}/students`);
  return data.data;
}

export async function assignStudentsToMentor(mentorId, studentIds) {
  const { data } = await api.post(`/mentors/${mentorId}/assign`, { studentIds });
  return data.data;
}

export async function unassignStudentFromMentor(mentorId, studentId) {
  await api.delete(`/mentors/${mentorId}/students/${studentId}`);
}

export async function bulkAutoAssignMentors({ mentorIds, departmentId }) {
  const { data } = await api.post('/mentors/bulk-assign', { mentorIds, departmentId });
  return data.data;
}
