import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StudentOverviewPage } from '@/pages/Dashboard/Student/StudentOverviewPage';

vi.mock('@/services/student.service', () => ({
  fetchMyCompletion: vi.fn(() =>
    Promise.resolve({
      percent: 50,
      checklist: [
        { key: 'basicInfo', label: 'Basic info added', complete: true },
        { key: 'education', label: 'Education added', complete: true },
        { key: 'skills', label: 'At least 3 skills added', complete: false },
        {
          key: 'experience',
          label: 'A project, internship, or work experience added',
          complete: false,
        },
        { key: 'resume', label: 'Resume uploaded', complete: false },
        {
          key: 'links',
          label: 'Career interests and at least one profile link added',
          complete: false,
        },
      ],
    })
  ),
  fetchMyProfile: vi.fn(() => Promise.resolve({})),
}));

function renderWithQueryClient(ui) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('StudentOverviewPage', () => {
  it('renders the checklist items returned by the API', async () => {
    renderWithQueryClient(<StudentOverviewPage />);

    expect(await screen.findByText('Basic info added')).toBeInTheDocument();
    expect(screen.getByText('At least 3 skills added')).toBeInTheDocument();
    expect(screen.getByText('Resume uploaded')).toBeInTheDocument();
  });

  it('renders the completion percentage', async () => {
    renderWithQueryClient(<StudentOverviewPage />);
    expect(await screen.findByText('50%')).toBeInTheDocument();
  });
});
