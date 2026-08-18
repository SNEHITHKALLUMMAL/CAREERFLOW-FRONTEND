import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useStartMockInterview, useContinueMockInterview } from '@/hooks/useAI';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function MockInterviewTool() {
  const [session, setSession] = useState(null); // { chatId, targetRole }
  const [transcript, setTranscript] = useState([]); // [{ role: 'interviewer'|'you', content }]
  const startMutation = useStartMockInterview();
  const continueMutation = useContinueMockInterview();

  const startForm = useForm();
  const answerForm = useForm();

  const handleStart = async ({ targetRole }) => {
    const result = await startMutation.mutateAsync({ targetRole });
    setSession({ chatId: result.chatId, targetRole });
    setTranscript([{ role: 'interviewer', content: result.question }]);
  };

  const handleAnswer = async ({ answer }) => {
    setTranscript((prev) => [...prev, { role: 'you', content: answer }]);
    answerForm.reset();
    const result = await continueMutation.mutateAsync({ chatId: session.chatId, answer });
    setTranscript((prev) => [...prev, { role: 'interviewer', content: result.reply }]);
  };

  const handleEnd = () => {
    setSession(null);
    setTranscript([]);
  };

  if (!session) {
    return (
      <Card>
        <CardTitle>Mock interview</CardTitle>
        <CardDescription>Practice with an AI interviewer for a specific role.</CardDescription>
        <form onSubmit={startForm.handleSubmit(handleStart)} className="mt-4 space-y-3" noValidate>
          <div>
            <Label htmlFor="mi-targetRole">Target role</Label>
            <Input
              id="mi-targetRole"
              placeholder="Backend Developer"
              {...startForm.register('targetRole', { required: true })}
            />
          </div>
          <Button type="submit" size="sm" disabled={startMutation.isPending}>
            {startMutation.isPending ? 'Starting...' : 'Start interview'}
          </Button>
        </form>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <CardTitle>Mock interview — {session.targetRole}</CardTitle>
        <Button size="sm" variant="ghost" onClick={handleEnd}>
          End session
        </Button>
      </div>

      <div className="mt-4 max-h-80 space-y-3 overflow-y-auto">
        {transcript.map((entry, i) => (
          <div key={i} className="rounded-xl bg-mist/5 p-3 text-sm">
            <p className="mb-1 text-xs font-medium uppercase text-mist">
              {entry.role === 'interviewer' ? 'Interviewer' : 'You'}
            </p>
            <p>{entry.content}</p>
          </div>
        ))}
        {continueMutation.isPending && (
          <p className="text-sm text-mist">Reviewing your answer...</p>
        )}
      </div>

      <form onSubmit={answerForm.handleSubmit(handleAnswer)} className="mt-3 space-y-2" noValidate>
        <Textarea
          placeholder="Type your answer..."
          {...answerForm.register('answer', { required: true })}
        />
        <Button type="submit" size="sm" disabled={continueMutation.isPending}>
          {continueMutation.isPending ? 'Sending...' : 'Submit answer'}
        </Button>
      </form>
    </Card>
  );
}
