import { useEmployability } from '@/hooks/useEmployability';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart } from '@/components/dashboard/charts/BarChart';

export function EmployabilityPage() {
  const { data, isLoading } = useEmployability();

  if (isLoading || !data)
    return <p className="text-mist">Loading your employability snapshot...</p>;

  const { breakdown } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Employability</h1>
        <p className="text-mist">{data.readiness.description}</p>
      </div>

      <Card>
        <div className="flex items-center gap-4">
          <p className="font-display text-4xl font-semibold text-signal">{data.score}</p>
          <div>
            <p className="font-medium">{data.readiness.label}</p>
            <p className="text-sm text-mist">Employability score, out of 100</p>
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle>Score breakdown</CardTitle>
        <div className="mt-4">
          <BarChart
            labels={['Profile', 'Resume', 'Assessments', 'Activity']}
            data={[
              breakdown.profileCompletionPercent || 0,
              breakdown.resumeAtsScore || 0,
              breakdown.assessmentAveragePercent || 0,
              Math.min(breakdown.applicationCount || 0, 5) * 20,
            ]}
          />
        </div>
        <p className="mt-3 text-xs text-mist">
          Resume: {breakdown.resumeAtsScore ?? 'no resume yet'} · Assessments:{' '}
          {breakdown.assessmentAveragePercent ?? 'none graded yet'} · Applications:{' '}
          {breakdown.applicationCount}
        </p>
      </Card>

      <Card>
        <CardTitle>Skills in demand you&apos;re missing</CardTitle>
        {data.skillGap.missing.length === 0 ? (
          <CardDescription className="mt-2">
            You&apos;re already covering the top in-demand skills — nice work.
          </CardDescription>
        ) : (
          <ul className="mt-3 space-y-1.5 text-sm">
            {data.skillGap.missing.map((m) => (
              <li
                key={m.skill}
                className="flex items-center justify-between rounded-lg bg-mist/5 px-2.5 py-1.5"
              >
                <span className="capitalize">{m.skill}</span>
                <span className="text-mist">{m.count} open listings</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
