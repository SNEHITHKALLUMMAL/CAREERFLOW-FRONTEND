import { useQuery } from '@tanstack/react-query';
import * as certificateApi from '@/services/certificate.service';

export function useMyCertificates() {
  return useQuery({
    queryKey: ['certificates', 'mine'],
    queryFn: certificateApi.fetchMyCertificates,
  });
}
