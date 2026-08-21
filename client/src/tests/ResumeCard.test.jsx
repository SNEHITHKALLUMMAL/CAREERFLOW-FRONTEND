import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ResumeCard } from '@/pages/Dashboard/Student/ResumeCard';

vi.mock('@/services/resume.service', () => ({
  fetchResumeHistory: vi.fn(() =>
    Promise.resolve([
      {
        _id: 'r2',
        version: 2,
        templateUsed: 'modern',
        fileUrl: 'https://cdn.example/r2.pdf',
        createdAt: '2024-02-01',
      },
      {
        _id: 'r1',
        version: 1,
        templateUsed: null,
        fileUrl: 'https://cdn.example/r1.pdf',
        createdAt: '2024-01-01',
      },
    ])
  ),
  fetchAtsScore: vi.fn(() =>
    Promise.resolve({
      atsScore: 78,
      grammarSuggestions: ['Use bullet points to list responsibilities and achievements.'],
      keywordSuggestions: ['typescript', 'redux'],
    })
  ),
  buildResume: vi.fn(),
  rebuildResume: vi.fn(),
}));

vi.mock('@/services/student.service', () => ({
  uploadResume: vi.fn(),
}));

function renderWithQueryClient(ui) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('ResumeCard', () => {
  it('renders the ATS score and suggestions for the active resume', async () => {
    renderWithQueryClient(<ResumeCard profile={{ resumeId: 'r2' }} />);

    expect(await screen.findByText(/78\/100/)).toBeInTheDocument();
    expect(screen.getByText(/Use bullet points/)).toBeInTheDocument();
    expect(screen.getByText(/typescript, redux/)).toBeInTheDocument();
  });

  it('renders resume version history', async () => {
    renderWithQueryClient(<ResumeCard profile={{ resumeId: 'r2' }} />);

    expect(await screen.findByText(/v2/)).toBeInTheDocument();
    expect(screen.getByText(/v1/)).toBeInTheDocument();
  });

  it('does not fetch an ATS score when there is no resume yet', () => {
    renderWithQueryClient(<ResumeCard profile={{ resumeId: null }} />);
    expect(screen.queryByText(/\/100/)).not.toBeInTheDocument();
  });
});
