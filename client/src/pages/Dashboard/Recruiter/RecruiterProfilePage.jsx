import { useForm } from 'react-hook-form';
import { useRecruiterProfile, useUpdateRecruiterProfile } from '@/hooks/useRecruiterProfile';
import { Card, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Label, FieldError } from '@/components/ui/input';

export function RecruiterProfilePage() {
  const { data: recruiter, isLoading } = useRecruiterProfile();
  const updateMutation = useUpdateRecruiterProfile();

  if (isLoading || !recruiter) return <p className="text-mist">Loading your profile...</p>;

  return <RecruiterProfileForm recruiter={recruiter} updateMutation={updateMutation} />;
}

function RecruiterProfileForm({ recruiter, updateMutation }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      companyName: recruiter.companyName || '',
      companyWebsite: recruiter.companyWebsite || '',
      companyLogoUrl: recruiter.companyLogoUrl || '',
      industry: recruiter.industry || '',
    },
  });

  const onSubmit = (values) => updateMutation.mutate(values);

  return (
    <div className="mx-auto max-w-xl">
      <Card>
        <CardTitle>Company profile</CardTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4" noValidate>
          <div>
            <Label htmlFor="companyName">Company name</Label>
            <Input
              id="companyName"
              {...register('companyName', { required: 'Company name is required' })}
            />
            <FieldError>{errors.companyName?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="industry">Industry</Label>
            <Input id="industry" {...register('industry')} />
          </div>
          <div>
            <Label htmlFor="companyWebsite">Company website</Label>
            <Input id="companyWebsite" type="url" {...register('companyWebsite')} />
            <FieldError>{errors.companyWebsite?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="companyLogoUrl">Logo URL</Label>
            <Input id="companyLogoUrl" type="url" {...register('companyLogoUrl')} />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
