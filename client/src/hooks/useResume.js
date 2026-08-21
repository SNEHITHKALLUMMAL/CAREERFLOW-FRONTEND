import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as resumeApi from '@/services/resume.service';

export function useResumeHistory() {
  return useQuery({ queryKey: ['resume', 'history'], queryFn: resumeApi.fetchResumeHistory });
}

export function useResumeAtsScore(resumeId) {
  return useQuery({
    queryKey: ['resume', 'ats-score', resumeId],
    queryFn: () => resumeApi.fetchAtsScore(resumeId),
    enabled: Boolean(resumeId),
  });
}

function useInvalidateResumeState() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['resume'] });
    queryClient.invalidateQueries({ queryKey: ['student', 'profile'] });
    queryClient.invalidateQueries({ queryKey: ['student', 'completion'] });
  };
}

export function useBuildResume() {
  const invalidate = useInvalidateResumeState();
  return useMutation({ mutationFn: resumeApi.buildResume, onSuccess: invalidate });
}

export function useRebuildResume() {
  const invalidate = useInvalidateResumeState();
  return useMutation({
    mutationFn: ({ resumeId, ...payload }) => resumeApi.rebuildResume(resumeId, payload),
    onSuccess: invalidate,
  });
}
