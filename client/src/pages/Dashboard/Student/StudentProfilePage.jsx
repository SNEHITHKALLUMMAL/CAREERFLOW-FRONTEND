import { useForm } from 'react-hook-form';
import { useStudentProfile, useUpdateProfile } from '@/hooks/useStudentProfile';
import { SubResourceEditor } from '@/components/dashboard/SubResourceEditor';
import { ResumeCard } from './ResumeCard';
import { Card, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { RESOURCE_CONFIG, STUDENT_ARRAY_FIELDS } from '@/config/studentResourceFields';

function BasicInfoForm({ profile }) {
  const updateMutation = useUpdateProfile();
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      rollNumber: profile.rollNumber || '',
      graduationYear: profile.graduationYear || '',
      portfolioUrl: profile.portfolioUrl || '',
      githubUrl: profile.githubUrl || '',
      linkedinUrl: profile.linkedinUrl || '',
      careerInterests: (profile.careerInterests || []).join(', '),
    },
  });

  const onSubmit = async (values) => {
    await updateMutation.mutateAsync({
      rollNumber: values.rollNumber || undefined,
      graduationYear: values.graduationYear ? Number(values.graduationYear) : undefined,
      portfolioUrl: values.portfolioUrl || undefined,
      githubUrl: values.githubUrl || undefined,
      linkedinUrl: values.linkedinUrl || undefined,
      careerInterests: values.careerInterests
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    });
  };

  return (
    <Card>
      <CardTitle>Basic info</CardTitle>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-4 sm:grid-cols-2" noValidate>
        <div>
          <Label htmlFor="rollNumber">Roll number</Label>
          <Input id="rollNumber" {...register('rollNumber')} />
        </div>
        <div>
          <Label htmlFor="graduationYear">Graduation year</Label>
          <Input id="graduationYear" type="number" {...register('graduationYear')} />
        </div>
        <div>
          <Label htmlFor="portfolioUrl">Portfolio URL</Label>
          <Input id="portfolioUrl" type="url" {...register('portfolioUrl')} />
        </div>
        <div>
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input id="githubUrl" type="url" {...register('githubUrl')} />
        </div>
        <div>
          <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
          <Input id="linkedinUrl" type="url" {...register('linkedinUrl')} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="careerInterests">Career interests (comma-separated)</Label>
          <Input
            id="careerInterests"
            placeholder="Backend development, DevOps"
            {...register('careerInterests')}
          />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={formState.isSubmitting}>
            {formState.isSubmitting ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export function StudentProfilePage() {
  const { data: profile, isLoading } = useStudentProfile();

  if (isLoading || !profile) {
    return <p className="text-mist">Loading your profile...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Your profile</h1>
        <p className="text-mist">
          Keep this up to date — it powers your profile completion and what recruiters see.
        </p>
      </div>

      <BasicInfoForm profile={profile} />
      <ResumeCard profile={profile} />

      {STUDENT_ARRAY_FIELDS.map((field) => (
        <SubResourceEditor
          key={field}
          field={field}
          config={RESOURCE_CONFIG[field]}
          items={profile[field] || []}
        />
      ))}
    </div>
  );
}
