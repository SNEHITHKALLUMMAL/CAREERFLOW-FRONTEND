import { useNavigate, useParams, Link } from 'react-router-dom';
import { Clock, Award, ListChecks, PlayCircle } from 'lucide-react';
import { useAssessment, useMyAttempts, useStartAttempt } from '@/hooks/useAssessment';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { typeLabel, statusLabel } from '@/utils/assessmentLabels';

export function AssessmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: assessment, isLoading } = useAssessment(id);
  const { data: myAttempts } = useMyAttempts();
  const startMutation = useStartAttempt();

  const existingAttempt = myAttempts?.find(
    (a) => a.assessmentId?._id === id || a.assessmentId === id
  );

  const handleStart = async () => {
    await startMutation.mutateAsync(id);
    navigate(`/dashboard/assessments/${id}/take`);
  };

  if (isLoading || !assessment) return <p className="text-mist">Loading assessment...</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-signal-light px-2.5 py-1 text-xs font-medium text-signal-dark dark:bg-signal/15 dark:text-signal">
          {typeLabel(assessment.type)}
        </span>
        <CardTitle className="mt-3">{assessment.title}</CardTitle>
        {assessment.description && <CardDescription>{assessment.description}</CardDescription>}

        <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-xl bg-mist/5 p-3 text-center">
            <Clock className="mx-auto h-4 w-4 text-mist" />
            <p className="mt-1 font-medium">{assessment.durationMinutes} min</p>
          </div>
          <div className="rounded-xl bg-mist/5 p-3 text-center">
            <ListChecks className="mx-auto h-4 w-4 text-mist" />
            <p className="mt-1 font-medium">{assessment.questionCount} questions</p>
          </div>
          <div className="rounded-xl bg-mist/5 p-3 text-center">
            <Award className="mx-auto h-4 w-4 text-mist" />
            <p className="mt-1 font-medium">{assessment.totalMarks} marks</p>
          </div>
        </div>

        <div className="mt-6">
          {!existingAttempt && (
            <Button size="lg" onClick={handleStart} disabled={startMutation.isPending}>
              <PlayCircle className="h-4 w-4" />
              {startMutation.isPending ? 'Starting...' : 'Start assessment'}
            </Button>
          )}

          {existingAttempt?.status === 'in_progress' && (
            <Button size="lg" onClick={handleStart} disabled={startMutation.isPending}>
              <PlayCircle className="h-4 w-4" />
              Resume assessment
            </Button>
          )}

          {existingAttempt && existingAttempt.status !== 'in_progress' && (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-mist">
                You&apos;ve already taken this assessment — {statusLabel(existingAttempt.status)}.
              </p>
              <Button size="sm" variant="secondary" asChild>
                <Link to={`/dashboard/assessments/${id}/result`}>View result</Link>
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Link
        to={`/dashboard/assessments/${id}/leaderboard`}
        className="text-sm font-medium text-signal hover:underline"
      >
        View leaderboard →
      </Link>
    </div>
  );
}
