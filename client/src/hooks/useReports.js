import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as reportApi from '@/services/report.service';

export function useMyReports() {
  return useQuery({ queryKey: ['reports', 'mine'], queryFn: reportApi.fetchMyReports });
}

export function useGenerateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reportApi.generateReport,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reports'] }),
  });
}
