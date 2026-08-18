import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from '@/redux/store';
import { VerifyEmailPage } from '@/pages/Auth/VerifyEmailPage';

const resendOtpMock = vi.fn(() => Promise.resolve());

vi.mock('@/services/auth.service', () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn(),
  verifyEmail: vi.fn(),
  resendOtp: (...args) => resendOtpMock(...args),
  googleLogin: vi.fn(),
  refreshSession: vi.fn(),
  logoutUser: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
  fetchMe: vi.fn(),
}));

function renderVerifyEmailPage() {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <VerifyEmailPage />
      </MemoryRouter>
    </Provider>
  );
}

describe('VerifyEmailPage', () => {
  it('renders email and OTP fields', () => {
    renderVerifyEmailPage();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/verification code/i)).toBeInTheDocument();
  });

  it('shows validation errors when submitted empty', async () => {
    const user = userEvent.setup();
    renderVerifyEmailPage();

    await user.click(screen.getByRole('button', { name: /verify email/i }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/code is required/i)).toBeInTheDocument();
  });

  it('rejects a code that is not 6 digits', async () => {
    const user = userEvent.setup();
    renderVerifyEmailPage();

    await user.type(screen.getByLabelText(/verification code/i), '123');
    await user.click(screen.getByRole('button', { name: /verify email/i }));

    expect(await screen.findByText('Enter the 6-digit code')).toBeInTheDocument();
  });

  it('calls resendOtp with the entered email when "Resend code" is clicked', async () => {
    const user = userEvent.setup();
    renderVerifyEmailPage();

    await user.type(screen.getByLabelText(/^email$/i), 'student@example.com');
    await user.click(screen.getByRole('button', { name: /resend code/i }));

    expect(resendOtpMock).toHaveBeenCalledWith({
      email: 'student@example.com',
      purpose: 'verify_email',
    });
    expect(await screen.findByRole('button', { name: /resend again/i })).toBeInTheDocument();
  });
});
