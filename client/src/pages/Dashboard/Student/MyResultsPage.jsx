import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock3 } from 'lucide-react';
import { useMyAttempts } from '@/hooks/useAssessment';
import { Card, CardDescription } from '@/components/ui/card';
import { typeLabel, statusLabel } from '@/utils/assessmentLabels';
import { cn } from '@/utils/cn';

function StatusBadge({ attempt }) {
  if (attempt.status === 'in_progress') {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-mist">
        <Clock3 className="h-3.5 w-3.5" />
        {statusLabel(attempt.status)}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'flex items-center gap-1 text-xs font-medium',
        attempt.passed ? 'text-momentum' : 'text-red-500'
      )}
    >
      {attempt.passed ? (
        <CheckCircle2 className="h-3.5 w-3.5" />
      ) : (
        <XCircle className="h-3.5 w-3.5" />
      )}
      {attempt.passed ? 'Passed' : 'Not passed'}
    </span>
  );
}

export function MyResultsPage() {
  const { data: attempts, isLoading } = useMyAttempts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">My results</h1>
        <p className="text-mist">Every assessment you&apos;ve started or completed.</p>
      </div>

      {isLoading && <p className="text-mist">Loading results...</p>}

      {!isLoading && attempts?.length === 0 && (
        <Card>
          <CardDescription>
            You haven&apos;t taken any assessments yet — browse the assessments list to get started.
          </CardDescription>
        </Card>
      )}

      <div className="space-y-3">
        {attempts?.map((attempt) => (
          <Card key={attempt._id} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{attempt.assessmentId?.title}</p>
              <p className="text-xs text-mist">{typeLabel(attempt.assessmentId?.type)}</p>
            </div>
            <div className="flex items-center gap-4">
              {attempt.status !== 'in_progress' && (
                <span className="font-mono text-sm text-mist">
                  {attempt.totalScore}/{attempt.maxScore}
                </span>
              )}
              <StatusBadge attempt={attempt} />
              {attempt.status !== 'in_progress' ? (
                <Link
                  to={`/dashboard/assessments/${attempt.assessmentId?._id}/result`}
                  className="text-sm font-medium text-signal hover:underline"
                >
                  View
                </Link>
              ) : (
                <Link
                  to={`/dashboard/assessments/${attempt.assessmentId?._id}/take`}
                  className="text-sm font-medium text-signal hover:underline"
                >
                  Resume
                </Link>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
