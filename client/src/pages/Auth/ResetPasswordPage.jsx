import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { resetPassword } from '@/services/auth.service';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Label, FieldError } from '@/components/ui/input';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || '';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: emailFromState, otp: '', newPassword: '' } });

  const onSubmit = async (values) => {
    await resetPassword(values);
    navigate('/login', { replace: true });
  };

  return (
    <>
      <CardTitle>Reset your password</CardTitle>
      <CardDescription>Enter the code we emailed you and choose a new password.</CardDescription>

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
          <Label htmlFor="otp">Reset code</Label>
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

        <div>
          <Label htmlFor="newPassword">New password</Label>
          <Input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            {...register('newPassword', {
              required: 'New password is required',
              minLength: { value: 8, message: 'At least 8 characters' },
            })}
          />
          <FieldError>{errors.newPassword?.message}</FieldError>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          <KeyRound className="h-4 w-4" />
          {isSubmitting ? 'Resetting...' : 'Reset password'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-mist">
        Remembered it?{' '}
        <Link to="/login" className="font-medium text-signal hover:underline">
          Back to log in
        </Link>
      </p>
    </>
  );
}
