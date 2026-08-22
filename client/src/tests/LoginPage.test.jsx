import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from '@/redux/store';
import { LoginPage } from '@/pages/Auth/LoginPage';

// Prevent any real network call from ever firing, even though client-side validation
// should stop submission before the thunk runs.
vi.mock('@/services/auth.service', () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn(),
  verifyEmail: vi.fn(),
  resendOtp: vi.fn(),
  googleLogin: vi.fn(),
  refreshSession: vi.fn(),
  logoutUser: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
  fetchMe: vi.fn(),
}));

function renderLoginPage() {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </Provider>
  );
}

describe('LoginPage', () => {
  it('renders email and password fields', () => {
    renderLoginPage();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('shows validation errors when submitted empty', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });
});
