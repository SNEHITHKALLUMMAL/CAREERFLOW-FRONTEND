import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as mentorApi from '@/services/mentor.service';

export function useMentors() {
  return useQuery({
    queryKey: ['mentors'],
    queryFn: mentorApi.fetchMentors,
  });
}

export function useMentorStudents(mentorId) {
  return useQuery({
    queryKey: ['mentors', mentorId, 'students'],
    queryFn: () => mentorApi.fetchMentorStudents(mentorId),
    enabled: Boolean(mentorId),
  });
}

function useInvalidateMentorData(mentorId) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['mentors'] });
    queryClient.invalidateQueries({ queryKey: ['mentors', mentorId, 'students'] });
    // A student's own overview shows their mentor, if it ever surfaces that — safe no-op otherwise.
    queryClient.invalidateQueries({ queryKey: ['placement', 'students'] });
  };
}

export function useAssignStudentsToMentor(mentorId) {
  const invalidate = useInvalidateMentorData(mentorId);
  return useMutation({
    mutationFn: (studentIds) => mentorApi.assignStudentsToMentor(mentorId, studentIds),
    onSuccess: invalidate,
  });
}

export function useUnassignStudentFromMentor(mentorId) {
  const invalidate = useInvalidateMentorData(mentorId);
  return useMutation({
    mutationFn: (studentId) => mentorApi.unassignStudentFromMentor(mentorId, studentId),
    onSuccess: invalidate,
  });
}

export function useBulkAutoAssignMentors() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mentorApi.bulkAutoAssignMentors,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentors'] });
      queryClient.invalidateQueries({ queryKey: ['placement', 'students'] });
    },
  });
}
