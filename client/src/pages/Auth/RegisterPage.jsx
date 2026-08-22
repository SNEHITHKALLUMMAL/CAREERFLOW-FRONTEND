import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { UserPlus } from 'lucide-react';
import { registerUser } from '@/redux/slices/authSlice';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Label, FieldError } from '@/components/ui/input';

const ROLES = [
  { value: 'student', label: 'Student' },
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'mentor', label: 'Mentor' },
];

export function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { role: 'student' } });

  const selectedRole = watch('role');

  const onSubmit = async (values) => {
    const result = await dispatch(registerUser(values));
    if (registerUser.fulfilled.match(result)) {
      // OTP verification disabled → go directly to login
      navigate('/login', { replace: true });
    }
  };

  return (
    <>
      <CardTitle>Create your account</CardTitle>
      <CardDescription>Start tracking your placement readiness today.</CardDescription>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            autoComplete="name"
            {...register('name', { required: 'Name is required' })}
          />
          <FieldError>{errors.name?.message}</FieldError>
        </div>

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
            autoComplete="new-password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'At least 8 characters' },
            })}
          />
          <FieldError>{errors.password?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="role">I am a...</Label>
          <select
            id="role"
            className="h-11 w-full rounded-xl border border-mist/25 bg-white px-3.5 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal dark:border-white/15 dark:bg-white/5 dark:text-white"
            {...register('role', { required: true })}
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          <UserPlus className="h-4 w-4" />
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <GoogleSignInButton role={selectedRole} redirectTo="/dashboard" />

      <p className="mt-6 text-center text-sm text-mist">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-signal hover:underline">
          Log in
        </Link>
      </p>
    </>
  );
}
