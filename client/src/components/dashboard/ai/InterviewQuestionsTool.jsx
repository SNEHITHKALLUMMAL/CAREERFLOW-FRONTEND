import { useForm } from 'react-hook-form';
import { useInterviewQuestions } from '@/hooks/useAI';
import { AIToolCard } from './AIToolCard';
import { Input, Label } from '@/components/ui/input';
import { Select } from '@/components/ui/textarea';

export function InterviewQuestionsTool() {
  const mutation = useInterviewQuestions();
  const { register, handleSubmit } = useForm({ defaultValues: { difficulty: 'medium' } });

  return (
    <AIToolCard
      title="Interview questions"
      description="Generate practice questions for a target role."
      submitLabel="Generate questions"
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      isPending={mutation.isPending}
      result={
        mutation.data && (
          <ul className="space-y-2 text-sm">
            {mutation.data.questions.map((q) => (
              <li key={q.question} className="rounded-lg bg-mist/5 p-2.5">
                <p>{q.question}</p>
                <p className="mt-1 text-xs uppercase text-mist">
                  {q.category} · {q.difficulty}
                </p>
              </li>
            ))}
          </ul>
        )
      }
    >
      <div>
        <Label htmlFor="iq-targetRole">Target role</Label>
        <Input
          id="iq-targetRole"
          placeholder="Frontend Developer"
          {...register('targetRole', { required: true })}
        />
      </div>
      <div>
        <Label htmlFor="difficulty">Difficulty</Label>
        <Select id="difficulty" {...register('difficulty')}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </Select>
      </div>
    </AIToolCard>
  );
}
