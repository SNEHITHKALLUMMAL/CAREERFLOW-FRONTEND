import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as adminApi from '@/services/admin.service';

export function usePlatformStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: adminApi.fetchPlatformStats,
  });
}

export function useRecentActivity(params = {}) {
  return useQuery({
    queryKey: ['admin', 'activity', params],
    queryFn: () => adminApi.fetchRecentActivity(params),
  });
}

export function useAdminUsers(params = {}) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => adminApi.fetchUsers(params),
  });
}

export function useSetUserActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, isActive }) => adminApi.setUserActive(userId, isActive),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
}
