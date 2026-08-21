import { useForm } from 'react-hook-form';
import { useLearningRoadmap } from '@/hooks/useAI';
import { AIToolCard } from './AIToolCard';
import { Input, Label } from '@/components/ui/input';

export function LearningRoadmapTool() {
  const mutation = useLearningRoadmap();
  const { register, handleSubmit } = useForm();

  return (
    <AIToolCard
      title="Learning roadmap"
      description="Get a step-by-step plan toward a goal."
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      isPending={mutation.isPending}
      result={
        mutation.data && (
          <div className="space-y-2 text-sm">
            <p className="font-medium">{mutation.data.title}</p>
            <ol className="space-y-2">
              {mutation.data.steps.map((s) => (
                <li key={s.order} className="rounded-lg bg-mist/5 p-2.5">
                  <div className="flex items-center justify-between font-medium">
                    <span>
                      {s.order}. {s.title}
                    </span>
                    <span className="text-xs text-mist">{s.estimatedWeeks}w</span>
                  </div>
                  <p className="mt-1 text-mist">{s.description}</p>
                </li>
              ))}
            </ol>
          </div>
        )
      }
    >
      <div>
        <Label htmlFor="goal">Goal</Label>
        <Input
          id="goal"
          placeholder="Become job-ready in React"
          {...register('goal', { required: true })}
        />
      </div>
    </AIToolCard>
  );
}
