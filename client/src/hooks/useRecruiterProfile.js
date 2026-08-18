import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as recruiterApi from '@/services/recruiterProfile.service';

export function useRecruiterProfile() {
  return useQuery({
    queryKey: ['recruiter', 'profile'],
    queryFn: recruiterApi.fetchMyRecruiterProfile,
  });
}

export function useUpdateRecruiterProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recruiterApi.updateMyRecruiterProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recruiter', 'profile'] }),
  });
}
