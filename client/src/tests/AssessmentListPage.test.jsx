import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AssessmentListPage } from '@/pages/Dashboard/Student/AssessmentListPage';

vi.mock('@/services/assessment.service', () => ({
  fetchAssessments: vi.fn(() =>
    Promise.resolve({
      assessments: [
        {
          _id: 'a1',
          title: 'JavaScript Fundamentals',
          type: 'mcq',
          description: 'Test your JS basics.',
          durationMinutes: 30,
          totalMarks: 50,
        },
        {
          _id: 'a2',
          title: 'Aptitude Round 1',
          type: 'aptitude',
          durationMinutes: 45,
          totalMarks: 100,
        },
      ],
      pagination: { page: 1, limit: 20, total: 2, totalPages: 1 },
    })
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

describe('AssessmentListPage', () => {
  it('renders assessments returned by the API', async () => {
    renderWithProviders(<AssessmentListPage />);

    expect(await screen.findByText('JavaScript Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('Aptitude Round 1')).toBeInTheDocument();
    expect(screen.getByText(/30 min/)).toBeInTheDocument();
    expect(screen.getByText(/50 marks/)).toBeInTheDocument();
  });
});
