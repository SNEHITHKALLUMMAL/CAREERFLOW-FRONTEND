import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MyResultsPage } from '@/pages/Dashboard/Student/MyResultsPage';

vi.mock('@/services/assessment.service', () => ({
  fetchMyAttempts: vi.fn(() =>
    Promise.resolve([
      {
        _id: 'att1',
        status: 'graded',
        passed: true,
        totalScore: 45,
        maxScore: 50,
        assessmentId: { _id: 'a1', title: 'JavaScript Fundamentals', type: 'mcq' },
      },
      {
        _id: 'att2',
        status: 'in_progress',
        totalScore: 0,
        maxScore: 100,
        assessmentId: { _id: 'a2', title: 'Aptitude Round 1', type: 'aptitude' },
      },
    ])
  ),
}));

function renderWithProviders(ui) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe('MyResultsPage', () => {
  it('shows a passed badge and score for a graded attempt', async () => {
    renderWithProviders(<MyResultsPage />);

    expect(await screen.findByText('JavaScript Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('Passed')).toBeInTheDocument();
    expect(screen.getByText('45/50')).toBeInTheDocument();
  });

  it('shows a Resume link for an in-progress attempt instead of a score', async () => {
    renderWithProviders(<MyResultsPage />);

    expect(await screen.findByText('Aptitude Round 1')).toBeInTheDocument();
    expect(screen.getByText('In progress')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /resume/i })).toBeInTheDocument();
  });
});
