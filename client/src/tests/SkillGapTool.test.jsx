import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SkillGapTool } from '@/components/dashboard/ai/SkillGapTool';

vi.mock('@/services/ai.service', () => ({
  skillGap: vi.fn(() =>
    Promise.resolve({
      targetRole: 'Backend Developer',
      matchedSkills: ['Node.js'],
      missingSkills: [{ skill: 'Docker', importance: 'high' }],
      overallReadinessPercent: 62,
    })
  ),
}));

function renderWithQueryClient(ui) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('SkillGapTool', () => {
  it('submits the target role and renders the result', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<SkillGapTool />);

    await user.type(screen.getByLabelText(/target role/i), 'Backend Developer');
    await user.click(screen.getByRole('button', { name: /generate/i }));

    expect(await screen.findByText(/62%/)).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('Docker')).toBeInTheDocument();
  });
});
