import { CheckCircle2, Circle } from 'lucide-react';
import { useProfileCompletion } from '@/hooks/useStudentProfile';
import { Card, CardTitle } from '@/components/ui/card';

const RADIUS = 16;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function CompletionRing({ percent }) {
  const filled = (percent / 100) * CIRCUMFERENCE;

  return (
    <div className="relative h-20 w-20 shrink-0">
      <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
        <circle
          cx="18"
          cy="18"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-mist/15"
        />
        <circle
          cx="18"
          cy="18"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={`${filled} ${CIRCUMFERENCE}`}
          strokeLinecap="round"
          className="text-momentum transition-all duration-500"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-mono text-lg font-semibold">
        {percent}%
      </span>
    </div>
  );
}

export function StudentOverviewPage() {
  const { data: completion, isLoading } = useProfileCompletion();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Welcome back</h1>
        <p className="text-mist">Here&apos;s where your placement readiness stands.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardTitle>Profile completion</CardTitle>
          <div className="mt-4 flex items-center gap-4">
            {isLoading ? (
              <div className="h-20 w-20 shrink-0 animate-pulse rounded-full bg-mist/10" />
            ) : (
              <CompletionRing percent={completion.percent} />
            )}
            <p className="text-sm text-mist">
              Complete your profile to improve visibility to recruiters.
            </p>
          </div>
        </Card>

        <Card className="md:col-span-2">
          <CardTitle>Your checklist</CardTitle>
          <ul className="mt-4 space-y-2.5">
            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <li key={i} className="h-4 w-2/3 animate-pulse rounded bg-mist/10" />
              ))}
            {completion?.checklist.map((item) => (
              <li key={item.key} className="flex items-center gap-2.5 text-sm">
                {item.complete ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-momentum" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-mist/40" />
                )}
                <span className={item.complete ? '' : 'text-mist'}>{item.label}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
