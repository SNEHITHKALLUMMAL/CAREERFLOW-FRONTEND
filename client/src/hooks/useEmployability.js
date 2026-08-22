import { useQuery } from '@tanstack/react-query';
import * as employabilityApi from '@/services/employability.service';

export function useEmployability() {
  return useQuery({
    queryKey: ['employability', 'mine'],
    queryFn: employabilityApi.fetchMyEmployability,
  });
}
