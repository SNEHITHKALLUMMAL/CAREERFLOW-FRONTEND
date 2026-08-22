import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EmployabilityPage } from '@/pages/Dashboard/Student/EmployabilityPage';

vi.mock('@/services/employability.service', () => ({
  fetchMyEmployability: vi.fn(() =>
    Promise.resolve({
      score: 68,
      readiness: { label: 'Placement Ready', description: "You're in good shape." },
      breakdown: {
        profileCompletionPercent: 83,
        resumeAtsScore: 72,
        assessmentAveragePercent: 60,
        applicationCount: 3,
      },
      skillGap: {
        matched: [{ skill: 'react', count: 40 }],
        missing: [
          { skill: 'typescript', count: 30 },
          { skill: 'docker', count: 22 },
        ],
      },
    })
  ),
}));

function renderWithQueryClient(ui) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('EmployabilityPage', () => {
  it('renders the score and readiness level', async () => {
    renderWithQueryClient(<EmployabilityPage />);

    expect(await screen.findByText('68')).toBeInTheDocument();
    expect(screen.getByText('Placement Ready')).toBeInTheDocument();
  });

  it('renders missing skills from the skill gap', async () => {
    renderWithQueryClient(<EmployabilityPage />);

    expect(await screen.findByText('typescript')).toBeInTheDocument();
    expect(screen.getByText('docker')).toBeInTheDocument();
  });
});
