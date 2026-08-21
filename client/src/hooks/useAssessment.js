import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as assessmentApi from '@/services/assessment.service';

export function useAssessments(params = {}) {
  return useQuery({
    queryKey: ['assessments', 'list', params],
    queryFn: () => assessmentApi.fetchAssessments(params),
  });
}

export function useAssessment(id) {
  return useQuery({
    queryKey: ['assessments', 'detail', id],
    queryFn: () => assessmentApi.fetchAssessment(id),
    enabled: Boolean(id),
  });
}

export function useStartAttempt() {
  return useMutation({ mutationFn: assessmentApi.startAttempt });
}

export function useSubmitAttempt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, answers }) => assessmentApi.submitAttempt(id, answers),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assessments', 'myAttempts'] }),
  });
}

export function useLeaderboard(id) {
  return useQuery({
    queryKey: ['assessments', 'leaderboard', id],
    queryFn: () => assessmentApi.fetchLeaderboard(id),
    enabled: Boolean(id),
  });
}

export function useResult(id, studentId) {
  return useQuery({
    queryKey: ['assessments', 'result', id, studentId],
    queryFn: () => assessmentApi.fetchResult(id, studentId),
    enabled: Boolean(id && studentId),
  });
}

export function useMyAttempts() {
  return useQuery({
    queryKey: ['assessments', 'myAttempts'],
    queryFn: assessmentApi.fetchMyAttempts,
  });
}
