import { useForm } from 'react-hook-form';
import { useSalaryEstimation } from '@/hooks/useAI';
import { AIToolCard } from './AIToolCard';
import { Input, Label } from '@/components/ui/input';

export function SalaryEstimationTool() {
  const mutation = useSalaryEstimation();
  const { register, handleSubmit } = useForm();

  return (
    <AIToolCard
      title="Salary estimation"
      description="Get a rough AI-generated compensation estimate."
      submitLabel="Estimate salary"
      onSubmit={handleSubmit((values) =>
        mutation.mutate({
          ...values,
          experienceYears: values.experienceYears ? Number(values.experienceYears) : undefined,
        })
      )}
      isPending={mutation.isPending}
      result={
        mutation.data && (
          <div className="space-y-2 text-sm">
            <p className="text-lg font-semibold">
              {mutation.data.estimatedRange.currency}{' '}
              {mutation.data.estimatedRange.min.toLocaleString()} –{' '}
              {mutation.data.estimatedRange.max.toLocaleString()}
            </p>
            <p className="text-xs text-mist">{mutation.data.disclaimer}</p>
          </div>
        )
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="se-role">Role</Label>
          <Input
            id="se-role"
            placeholder="Backend Developer"
            {...register('role', { required: true })}
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Bengaluru, India"
            {...register('location', { required: true })}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="experienceYears">Years of experience</Label>
          <Input id="experienceYears" type="number" min="0" {...register('experienceYears')} />
        </div>
      </div>
    </AIToolCard>
  );
}
