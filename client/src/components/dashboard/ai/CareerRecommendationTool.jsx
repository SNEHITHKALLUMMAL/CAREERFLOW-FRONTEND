import { useCareerRecommendation } from '@/hooks/useAI';
import { AIToolCard } from './AIToolCard';

export function CareerRecommendationTool() {
  const mutation = useCareerRecommendation();

  return (
    <AIToolCard
      title="Career recommendations"
      description="Get IT career paths that fit your current profile."
      submitLabel="Get recommendations"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
      isPending={mutation.isPending}
      result={
        mutation.data && (
          <ul className="space-y-2 text-sm">
            {mutation.data.recommendations.map((r) => (
              <li key={r.role} className="rounded-lg bg-mist/5 p-2.5">
                <div className="flex items-center justify-between font-medium">
                  <span>{r.role}</span>
                  <span className="text-momentum">{r.matchScore}%</span>
                </div>
                <p className="mt-1 text-mist">{r.matchReason}</p>
              </li>
            ))}
          </ul>
        )
      }
    />
  );
}
