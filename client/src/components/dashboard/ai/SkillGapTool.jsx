import { useForm } from 'react-hook-form';
import { useSkillGap } from '@/hooks/useAI';
import { AIToolCard } from './AIToolCard';
import { Input, Label } from '@/components/ui/input';

export function SkillGapTool() {
  const mutation = useSkillGap();
  const { register, handleSubmit } = useForm();

  return (
    <AIToolCard
      title="Skill gap analysis"
      description="See how your current skills match a target role."
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      isPending={mutation.isPending}
      result={
        mutation.data && (
          <div className="space-y-3 text-sm">
            <p>
              <span className="font-medium">Overall readiness:</span>{' '}
              {mutation.data.overallReadinessPercent}%
            </p>
            <div>
              <p className="font-medium">Matched skills</p>
              <p className="text-mist">{mutation.data.matchedSkills.join(', ') || 'None yet'}</p>
            </div>
            <div>
              <p className="font-medium">Skills to build</p>
              <ul className="mt-1 space-y-1">
                {mutation.data.missingSkills.map((s) => (
                  <li
                    key={s.skill}
                    className="flex items-center justify-between rounded-lg bg-mist/5 px-2.5 py-1.5"
                  >
                    <span>{s.skill}</span>
                    <span className="text-xs uppercase text-mist">{s.importance}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      }
    >
      <div>
        <Label htmlFor="targetRole">Target role</Label>
        <Input
          id="targetRole"
          placeholder="Backend Developer"
          {...register('targetRole', { required: true })}
        />
      </div>
    </AIToolCard>
  );
}
