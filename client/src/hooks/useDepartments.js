import { useQuery } from '@tanstack/react-query';
import * as departmentApi from '@/services/department.service';

export function useDepartments(params = {}) {
  return useQuery({
    queryKey: ['departments', params],
    queryFn: () => departmentApi.fetchDepartments(params),
  });
}
