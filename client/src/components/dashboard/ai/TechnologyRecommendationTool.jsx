import { useForm } from 'react-hook-form';
import { useTechnologyRecommendation } from '@/hooks/useAI';
import { AIToolCard } from './AIToolCard';
import { Input, Label } from '@/components/ui/input';

export function TechnologyRecommendationTool() {
  const mutation = useTechnologyRecommendation();
  const { register, handleSubmit } = useForm();

  return (
    <AIToolCard
      title="Technology recommendations"
      description="Find out what to learn next for an area of interest."
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      isPending={mutation.isPending}
      result={
        mutation.data && (
          <ul className="space-y-1.5 text-sm">
            {mutation.data.recommendations.map((r) => (
              <li
                key={r.technology}
                className="flex items-start justify-between gap-3 rounded-lg bg-mist/5 p-2.5"
              >
                <div>
                  <p className="font-medium">{r.technology}</p>
                  <p className="text-mist">{r.reason}</p>
                </div>
                <span className="shrink-0 text-xs uppercase text-mist">{r.priority}</span>
              </li>
            ))}
          </ul>
        )
      }
    >
      <div>
        <Label htmlFor="interest">Area of interest</Label>
        <Input
          id="interest"
          placeholder="Cloud infrastructure"
          {...register('interest', { required: true })}
        />
      </div>
    </AIToolCard>
  );
}
