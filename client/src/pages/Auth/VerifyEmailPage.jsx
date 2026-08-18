import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShieldCheck } from 'lucide-react';
import { verifyEmail } from '@/redux/slices/authSlice';
import { resendOtp } from '@/services/auth.service';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Label, FieldError } from '@/components/ui/input';

export function VerifyEmailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || '';
  const [resent, setResent] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: emailFromState, otp: '' } });

  const onSubmit = async (values) => {
    const result = await dispatch(verifyEmail(values));
    if (verifyEmail.fulfilled.match(result)) {
      navigate('/dashboard', { replace: true });
    }
  };

  const handleResend = async (email) => {
    if (!email) return;
    await resendOtp({ email, purpose: 'verify_email' });
    setResent(true);
  };

  // Deliberately validates only the email field, not the whole form — requiring a
  // filled-in OTP before allowing "Resend code" would block the exact situation a
  // user clicks it for (they don't have a code yet).
  const handleResendClick = async () => {
    const isEmailValid = await trigger('email');
    if (!isEmailValid) return;
    await handleResend(getValues('email'));
  };

  return (
    <>
      <CardTitle>Verify your email</CardTitle>
      <CardDescription>Enter the 6-digit code we sent to your inbox.</CardDescription>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email', { required: 'Email is required' })}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="otp">Verification code</Label>
          <Input
            id="otp"
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            className="text-center font-mono text-lg tracking-[0.4em]"
            {...register('otp', {
              required: 'Code is required',
              pattern: { value: /^\d{6}$/, message: 'Enter the 6-digit code' },
            })}
          />
          <FieldError>{errors.otp?.message}</FieldError>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          <ShieldCheck className="h-4 w-4" />
          {isSubmitting ? 'Verifying...' : 'Verify email'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-mist">
        Didn&apos;t get a code?{' '}
        <button
          type="button"
          onClick={handleResendClick}
          className="font-medium text-signal hover:underline"
        >
          {resent ? 'Code sent — resend again' : 'Resend code'}
        </button>
      </p>
    </>
  );
}
