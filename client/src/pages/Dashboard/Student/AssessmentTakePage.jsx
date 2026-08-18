import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAssessment, useStartAttempt, useSubmitAttempt } from '@/hooks/useAssessment';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function AssessmentTakePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: assessment, isLoading: assessmentLoading } = useAssessment(id);
  const startMutation = useStartAttempt();
  const submitMutation = useSubmitAttempt();

  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Start (or resume) the attempt once on mount.
  useEffect(() => {
    let cancelled = false;
    startMutation.mutate(id, {
      onSuccess: (result) => {
        if (!cancelled) setAttempt(result);
      },
      onError: () => {
        // Already submitted, or something else went wrong — send them to the result page.
        if (!cancelled) navigate(`/dashboard/assessments/${id}/result`, { replace: true });
      },
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = useCallback(async () => {
    if (hasSubmitted) return;
    setHasSubmitted(true);
    const payload = Object.entries(answers).map(([questionId, response]) => ({
      questionId,
      response,
    }));

    try {
      await submitMutation.mutateAsync({ id, answers: payload });
      navigate(`/dashboard/assessments/${id}/result`, { replace: true });
    } catch {
      setHasSubmitted(false);
    }
  }, [answers, hasSubmitted, id, navigate, submitMutation]);

  // Countdown timer, computed from the attempt's actual start time.
  useEffect(() => {
    if (!attempt || !assessment) return undefined;
    const deadline = new Date(attempt.startedAt).getTime() + assessment.durationMinutes * 60000;

    const tick = () => {
      const remaining = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0) {
        toast.info("Time's up — submitting your answers.");
        handleSubmit();
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [attempt, assessment, handleSubmit]);

  if (assessmentLoading || !assessment || !attempt) {
    return <p className="text-mist">Preparing your assessment...</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-24">
      <div className="sticky top-16 z-10 -mx-6 flex items-center justify-between border-b border-mist/10 bg-paper/90 px-6 py-3 backdrop-blur-md dark:border-white/10 dark:bg-ink/90">
        <h1 className="font-display text-lg font-semibold">{assessment.title}</h1>
        {secondsLeft !== null && (
          <span className="flex items-center gap-1.5 rounded-full bg-ember-light px-3 py-1 font-mono text-sm font-medium text-ember-dark dark:bg-ember/15 dark:text-ember">
            <Clock className="h-4 w-4" />
            {formatTime(secondsLeft)}
          </span>
        )}
      </div>

      {assessment.questions.map((question, index) => (
        <Card key={question._id}>
          <p className="text-xs font-medium uppercase text-mist">
            Question {index + 1} · {question.marks} marks
          </p>
          <p className="mt-1.5 font-medium">{question.questionText}</p>

          {assessment.type === 'coding' ? (
            <div className="mt-3 space-y-3">
              {question.testCases?.length > 0 && (
                <div className="rounded-lg bg-mist/5 p-2.5 text-xs text-mist">
                  <p className="font-medium text-ink dark:text-white">Sample input</p>
                  {question.testCases.map((tc) => (
                    <pre key={tc.input} className="mt-1 whitespace-pre-wrap font-mono">
                      {tc.input}
                    </pre>
                  ))}
                </div>
              )}
              <Textarea
                rows={8}
                placeholder="Write your solution here..."
                className="font-mono text-sm"
                value={answers[question._id] || ''}
                onChange={(e) =>
                  setAnswers((prev) => ({ ...prev, [question._id]: e.target.value }))
                }
              />
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {question.options.map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-mist/15 p-2.5 text-sm hover:bg-mist/5 dark:border-white/10"
                >
                  <input
                    type="radio"
                    name={question._id}
                    value={option}
                    checked={answers[question._id] === option}
                    onChange={() => setAnswers((prev) => ({ ...prev, [question._id]: option }))}
                    className="h-4 w-4 accent-signal"
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
        </Card>
      ))}

      <div className="fixed inset-x-0 bottom-0 border-t border-mist/10 bg-paper/95 p-4 backdrop-blur-md dark:border-white/10 dark:bg-ink/95 lg:pl-64">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <p className="text-sm text-mist">
            {Object.keys(answers).length} of {assessment.questions.length} answered
          </p>
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={hasSubmitted || submitMutation.isPending}
          >
            {submitMutation.isPending ? 'Submitting...' : 'Submit assessment'}
          </Button>
        </div>
      </div>
    </div>
  );
}
