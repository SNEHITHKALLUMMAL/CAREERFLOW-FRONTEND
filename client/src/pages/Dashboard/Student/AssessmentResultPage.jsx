import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Award } from 'lucide-react';
import { useStudentProfile } from '@/hooks/useStudentProfile';
import { useResult } from '@/hooks/useAssessment';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

export function AssessmentResultPage() {
  const { id } = useParams();
  const { data: profile } = useStudentProfile();
  const { data: result, isLoading } = useResult(id, profile?.id);

  if (isLoading || !result) return <p className="text-mist">Loading result...</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase text-mist">{result.assessmentTitle}</p>
            <p className="mt-1 font-display text-2xl font-semibold">
              {result.totalScore} / {result.maxScore}
            </p>
          </div>
          <span
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium',
              result.passed
                ? 'bg-momentum-light text-momentum-dark dark:bg-momentum/15 dark:text-momentum'
                : 'bg-red-500/10 text-red-500'
            )}
          >
            {result.passed ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {result.passed ? 'Passed' : 'Not passed'} · {result.percentage}%
          </span>
        </div>

        {result.status === 'submitted' && (
          <p className="mt-3 text-sm text-mist">
            Some coding answers are still pending manual review — your score may update.
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          <Button size="sm" variant="outline" asChild>
            <Link to={`/dashboard/assessments/${id}/leaderboard`}>View leaderboard</Link>
          </Button>
          {result.passed && (
            <Button size="sm" variant="secondary" asChild>
              <Link to="/dashboard/certificates">
                <Award className="h-4 w-4" />
                My certificates
              </Link>
            </Button>
          )}
        </div>
      </Card>

      <div className="space-y-3">
        {result.breakdown.map((item, index) => (
          <Card key={item.questionText + index}>
            <p className="text-xs font-medium uppercase text-mist">
              Question {index + 1} · {item.marksAwarded ?? '—'} / {item.maxMarks}
            </p>
            <p className="mt-1.5 font-medium">{item.questionText}</p>
            <p className="mt-2 text-sm text-mist">
              Your answer:{' '}
              <span className="text-ink dark:text-white">{item.response || '(no answer)'}</span>
            </p>
            {item.correctAnswer !== null && item.correctAnswer !== undefined && (
              <p className="mt-1 text-sm text-mist">
                Correct answer: <span className="text-momentum">{item.correctAnswer}</span>
              </p>
            )}
            {item.isCorrect === null && (
              <p className="mt-1 text-xs text-ember">Pending manual review</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
