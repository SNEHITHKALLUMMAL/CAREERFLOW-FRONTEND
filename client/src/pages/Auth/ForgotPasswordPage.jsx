import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { forgotPassword } from '@/services/auth.service';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Label, FieldError } from '@/components/ui/input';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (values) => {
    await forgotPassword(values);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <CardTitle>Check your email</CardTitle>
        <CardDescription>
          If an account exists for {getValues('email')}, we&apos;ve sent a reset code.
        </CardDescription>
        <Button
          size="lg"
          className="mt-6 w-full"
          onClick={() => navigate('/reset-password', { state: { email: getValues('email') } })}
        >
          Enter reset code
        </Button>
      </>
    );
  }

  return (
    <>
      <CardTitle>Forgot your password?</CardTitle>
      <CardDescription>We&apos;ll email you a code to reset it.</CardDescription>

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

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          <Mail className="h-4 w-4" />
          {isSubmitting ? 'Sending...' : 'Send reset code'}
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
