import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as listingApi from '@/services/listing.service';

export function useListings(kind, params = {}) {
  return useQuery({
    queryKey: ['listings', kind, 'list', params],
    queryFn: () => listingApi.fetchListings(kind, params),
  });
}

export function useListing(kind, id) {
  return useQuery({
    queryKey: ['listings', kind, 'detail', id],
    queryFn: () => listingApi.fetchListing(kind, id),
    enabled: Boolean(id),
  });
}

export function useBookmarked(kind) {
  return useQuery({
    queryKey: ['listings', kind, 'bookmarked'],
    queryFn: () => listingApi.fetchBookmarked(kind),
  });
}

export function useApplicants(kind, id) {
  return useQuery({
    queryKey: ['listings', kind, 'applicants', id],
    queryFn: () => listingApi.fetchApplicants(kind, id),
    enabled: Boolean(id),
  });
}

function useInvalidateListings(kind) {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['listings', kind] });
}

export function useCreateListing(kind) {
  const invalidate = useInvalidateListings(kind);
  return useMutation({
    mutationFn: (payload) => listingApi.createListing(kind, payload),
    onSuccess: invalidate,
  });
}

export function useUpdateListing(kind) {
  const invalidate = useInvalidateListings(kind);
  return useMutation({
    mutationFn: ({ id, payload }) => listingApi.updateListing(kind, id, payload),
    onSuccess: invalidate,
  });
}

export function useChangeListingStatus(kind) {
  const invalidate = useInvalidateListings(kind);
  return useMutation({
    mutationFn: ({ id, status }) => listingApi.changeListingStatus(kind, id, status),
    onSuccess: invalidate,
  });
}

export function useApplyToListing(kind) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => listingApi.applyToListing(kind, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  });
}

export function useToggleBookmark(kind) {
  const invalidate = useInvalidateListings(kind);
  return useMutation({
    mutationFn: ({ id, bookmarked }) =>
      bookmarked ? listingApi.unbookmarkListing(kind, id) : listingApi.bookmarkListing(kind, id),
    onSuccess: invalidate,
  });
}
