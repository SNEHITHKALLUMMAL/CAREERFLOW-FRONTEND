import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as applicationApi from '@/services/recruitment.service';

export function useMyApplications() {
  return useQuery({
    queryKey: ['applications', 'mine'],
    queryFn: applicationApi.fetchMyApplications,
  });
}

export function useWithdrawApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applicationApi.withdrawApplication,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  });
}

function useInvalidateApplicants() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['listings', 'job', 'applicants'] });
    queryClient.invalidateQueries({ queryKey: ['listings', 'internship', 'applicants'] });
  };
}

export function useUpdateApplicationStatus() {
  const invalidate = useInvalidateApplicants();
  return useMutation({
    mutationFn: ({ id, status }) => applicationApi.updateApplicationStatus(id, status),
    onSuccess: invalidate,
  });
}

export function useScheduleInterview() {
  const invalidate = useInvalidateApplicants();
  return useMutation({
    mutationFn: ({ id, ...payload }) => applicationApi.scheduleInterview(id, payload),
    onSuccess: invalidate,
  });
}

export function useIssueOfferLetter() {
  const invalidate = useInvalidateApplicants();
  return useMutation({
    mutationFn: ({ id, ...payload }) => applicationApi.issueOfferLetter(id, payload),
    onSuccess: invalidate,
  });
}
