import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PlacementOverviewPage } from '@/pages/Dashboard/Placement/PlacementOverviewPage';

vi.mock('@/services/placement.service', () => ({
  fetchPlacementAnalytics: vi.fn(() =>
    Promise.resolve({
      totalStudents: 120,
      placedCount: 30,
      placementRate: 25,
      totalDrives: 4,
      totalApplications: 200,
      applicationsByStatus: { applied: 150, shortlisted: 30, offered: 20 },
    })
  ),
}));

function renderWithQueryClient(ui) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('PlacementOverviewPage', () => {
  it('renders the key stat cards from the analytics API', async () => {
    renderWithQueryClient(<PlacementOverviewPage />);

    expect(await screen.findByText('120')).toBeInTheDocument();
    expect(screen.getByText('25%')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  it('renders the applications-by-status breakdown', async () => {
    renderWithQueryClient(<PlacementOverviewPage />);

    expect(await screen.findByText('shortlisted')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
  });
});
