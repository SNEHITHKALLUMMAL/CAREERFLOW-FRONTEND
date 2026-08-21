import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChatbotTool } from '@/components/dashboard/ai/ChatbotTool';

vi.mock('@/services/ai.service', () => ({
  chatbot: vi.fn(() =>
    Promise.resolve({ chatId: 'chat-1', reply: 'Focus on backend fundamentals first.' })
  ),
}));

function renderWithQueryClient(ui) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('ChatbotTool', () => {
  it('sends a message and displays both the user message and the reply', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<ChatbotTool />);

    const input = screen.getByPlaceholderText(/ask a question/i);
    await user.type(input, 'What should I learn next?');

    const sendButton = screen.getByRole('button', { name: /send message/i });
    await user.click(sendButton);

    expect(await screen.findByText('What should I learn next?')).toBeInTheDocument();
    expect(await screen.findByText('Focus on backend fundamentals first.')).toBeInTheDocument();
  });
});
