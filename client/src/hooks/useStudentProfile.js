import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as studentApi from '@/services/student.service';

const PROFILE_KEY = ['student', 'profile'];
const COMPLETION_KEY = ['student', 'completion'];

export function useStudentProfile() {
  return useQuery({ queryKey: PROFILE_KEY, queryFn: studentApi.fetchMyProfile });
}

export function useProfileCompletion() {
  return useQuery({ queryKey: COMPLETION_KEY, queryFn: studentApi.fetchMyCompletion });
}

function useInvalidateStudent() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
    queryClient.invalidateQueries({ queryKey: COMPLETION_KEY });
    queryClient.invalidateQueries({ queryKey: ['resume'] });
  };
}

export function useUpdateProfile() {
  const invalidate = useInvalidateStudent();
  return useMutation({ mutationFn: studentApi.updateMyProfile, onSuccess: invalidate });
}

export function useAddItem(field) {
  const invalidate = useInvalidateStudent();
  return useMutation({
    mutationFn: (payload) => studentApi.addItem(field, payload),
    onSuccess: invalidate,
  });
}

export function useUpdateItem(field) {
  const invalidate = useInvalidateStudent();
  return useMutation({
    mutationFn: ({ itemId, payload }) => studentApi.updateItem(field, itemId, payload),
    onSuccess: invalidate,
  });
}

export function useRemoveItem(field) {
  const invalidate = useInvalidateStudent();
  return useMutation({
    mutationFn: (itemId) => studentApi.removeItem(field, itemId),
    onSuccess: invalidate,
  });
}

export function useUploadResume() {
  const invalidate = useInvalidateStudent();
  return useMutation({ mutationFn: studentApi.uploadResume, onSuccess: invalidate });
}
