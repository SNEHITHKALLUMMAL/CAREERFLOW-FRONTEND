import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as taskApi from '@/services/task.service';

export function useMyTasks() {
  return useQuery({
    queryKey: ['tasks', 'mine'],
    queryFn: taskApi.fetchMyTasks,
  });
}

export function useTasksCreatedByMe() {
  return useQuery({
    queryKey: ['tasks', 'created'],
    queryFn: taskApi.fetchTasksCreatedByMe,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: taskApi.createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', 'created'] }),
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: taskApi.completeTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', 'mine'] }),
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, ...payload }) => taskApi.updateTask(taskId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', 'created'] }),
  });
}

export function useCancelTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: taskApi.cancelTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', 'created'] }),
  });
}
