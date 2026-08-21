import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as notificationApi from '@/services/notification.service';

export function useMyNotifications(params = {}) {
  return useQuery({
    queryKey: ['notifications', 'mine', params],
    queryFn: () => notificationApi.fetchMyNotifications(params),
    refetchInterval: 60 * 1000, // light polling so the unread badge stays reasonably fresh
  });
}

function useInvalidateNotifications() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['notifications'] });
}

export function useMarkNotificationRead() {
  const invalidate = useInvalidateNotifications();
  return useMutation({ mutationFn: notificationApi.markNotificationRead, onSuccess: invalidate });
}

export function useMarkAllNotificationsRead() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: notificationApi.markAllNotificationsRead,
    onSuccess: invalidate,
  });
}

export function useSendNotification() {
  return useMutation({ mutationFn: notificationApi.sendNotification });
}
