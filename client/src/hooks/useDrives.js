import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as driveApi from '@/services/drive.service';

export function useDrives() {
  return useQuery({ queryKey: ['drives', 'list'], queryFn: driveApi.fetchDrives });
}

export function useDrive(id) {
  return useQuery({
    queryKey: ['drives', 'detail', id],
    queryFn: () => driveApi.fetchDrive(id),
    enabled: Boolean(id),
  });
}

export function useEligibleStudents(id) {
  return useQuery({
    queryKey: ['drives', 'eligible', id],
    queryFn: () => driveApi.fetchEligibleStudents(id),
    enabled: Boolean(id),
  });
}

export function useCreateDrive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: driveApi.createDrive,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['drives'] }),
  });
}

export function useUpdateDriveStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => driveApi.updateDriveStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['drives'] }),
  });
}
