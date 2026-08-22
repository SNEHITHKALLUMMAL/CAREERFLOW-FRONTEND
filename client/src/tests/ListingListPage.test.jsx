import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ListingListPage } from '@/pages/Dashboard/Student/ListingListPage';

vi.mock('@/services/listing.service', () => ({
  fetchListings: vi.fn(() =>
    Promise.resolve({
      items: [
        {
          _id: 'j1',
          title: 'Backend Engineer',
          jobType: 'full-time',
          location: 'Kochi',
          isRemote: false,
          requiredSkills: ['Node', 'MongoDB'],
        },
        {
          _id: 'j2',
          title: 'Frontend Intern',
          jobType: 'contract',
          location: 'Remote',
          isRemote: true,
          requiredSkills: ['React'],
        },
      ],
      pagination: { page: 1, limit: 20, total: 2, totalPages: 1 },
    })
  ),
  fetchBookmarked: vi.fn(() => Promise.resolve([])),
}));

function renderWithProviders(ui) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe('ListingListPage (job kind)', () => {
  it('renders jobs returned by the API', async () => {
    renderWithProviders(<ListingListPage kind="job" />);

    expect(await screen.findByText('Backend Engineer')).toBeInTheDocument();
    expect(screen.getByText('Frontend Intern')).toBeInTheDocument();
    expect(screen.getByText('Jobs')).toBeInTheDocument();
  });
});
