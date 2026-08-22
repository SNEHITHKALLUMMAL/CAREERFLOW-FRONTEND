import { useQuery } from '@tanstack/react-query';
import * as placementApi from '@/services/placement.service';

export function usePlacementAnalytics() {
  return useQuery({
    queryKey: ['placement', 'analytics'],
    queryFn: placementApi.fetchPlacementAnalytics,
  });
}

export function useStudentAnalytics(params = {}) {
  return useQuery({
    queryKey: ['placement', 'students', params],
    queryFn: () => placementApi.fetchStudentAnalytics(params),
  });
}

export function usePlacementRecruiters() {
  return useQuery({
    queryKey: ['placement', 'recruiters'],
    queryFn: placementApi.fetchRecruitersForPlacement,
  });
}

export function useCareerAnalytics() {
  return useQuery({
    queryKey: ['placement', 'career-analytics'],
    queryFn: placementApi.fetchCareerAnalytics,
  });
}
