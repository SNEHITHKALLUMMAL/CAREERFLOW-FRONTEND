import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from '@/redux/store';
import { RegisterPage } from '@/pages/Auth/RegisterPage';

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

function renderRegisterPage() {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    </Provider>
  );
}

describe('RegisterPage', () => {
  it('renders name, email, password, and role fields', () => {
    renderRegisterPage();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/i am a/i)).toBeInTheDocument();
  });

  it('defaults the role selector to student', () => {
    renderRegisterPage();
    expect(screen.getByLabelText(/i am a/i)).toHaveValue('student');
  });

  it('shows validation errors when submitted empty', async () => {
    const user = userEvent.setup();
    renderRegisterPage();

    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it('rejects a password under 8 characters', async () => {
    const user = userEvent.setup();
    renderRegisterPage();

    await user.type(screen.getByLabelText(/password/i), 'short');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText(/at least 8 characters/i)).toBeInTheDocument();
  });
});
