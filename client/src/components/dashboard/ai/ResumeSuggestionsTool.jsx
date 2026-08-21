import { useResumeSuggestions } from '@/hooks/useAI';
import { AIToolCard } from './AIToolCard';

export function ResumeSuggestionsTool() {
  const mutation = useResumeSuggestions();

  return (
    <AIToolCard
      title="Resume suggestions"
      description="Advice based on your current profile data."
      submitLabel="Get suggestions"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
      isPending={mutation.isPending}
      result={
        mutation.data && (
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium">Strengths</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-mist">
                {mutation.data.strengths.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium">Gaps to address</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-mist">
                {mutation.data.gapsToAddress.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium">Keyword suggestions</p>
              <p className="text-mist">{mutation.data.keywordSuggestions.join(', ')}</p>
            </div>
          </div>
        )
      }
    />
  );
}
