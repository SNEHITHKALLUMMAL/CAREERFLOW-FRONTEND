import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LogIn } from 'lucide-react';
import { login } from '@/redux/slices/authSlice';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Label, FieldError } from '@/components/ui/input';

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (values) => {
    const result = await dispatch(login(values));
    if (login.fulfilled.match(result)) {
      // Login successful → go to dashboard
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    }
    // OTP / unverified check completely removed
  };

  return (
    <>
      <CardTitle>Welcome back</CardTitle>
      <CardDescription>Log in to keep your placement journey moving.</CardDescription>

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
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register('password', { required: 'Password is required' })}
          />
          <FieldError>{errors.password?.message}</FieldError>
        </div>

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm font-medium text-signal hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          <LogIn className="h-4 w-4" />
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </Button>
      </form>

      <GoogleSignInButton role="student" redirectTo={location.state?.from?.pathname || '/dashboard'} />

      <p className="mt-6 text-center text-sm text-mist">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-medium text-signal hover:underline">
          Sign up
        </Link>
      </p>
    </>
  );
}
