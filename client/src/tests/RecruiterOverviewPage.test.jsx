import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecruiterOverviewPage } from '@/pages/Dashboard/Recruiter/RecruiterOverviewPage';

const mockFetch = vi.fn();
vi.mock('@/services/recruiterProfile.service', () => ({
  fetchMyRecruiterProfile: () => mockFetch(),
}));

function renderWithProviders(ui) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe('RecruiterOverviewPage', () => {
  it('shows a pending badge and a complete-profile prompt for an unverified, unnamed recruiter', async () => {
    mockFetch.mockResolvedValueOnce({ companyName: null, isVerified: false });
    renderWithProviders(<RecruiterOverviewPage />);

    expect(await screen.findByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Complete profile')).toBeInTheDocument();
  });

  it('shows a verified badge for a verified recruiter', async () => {
    mockFetch.mockResolvedValueOnce({ companyName: 'Acme Corp', isVerified: true });
    renderWithProviders(<RecruiterOverviewPage />);

    expect(await screen.findByText('Verified')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
  });
});
