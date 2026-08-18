import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMyReports, useGenerateReport } from '@/hooks/useReports';
import { Card, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/textarea';

export function ReportsPage() {
  const { user } = useAuth();
  const isStudent = user.role === 'student';
  const [scope, setScope] = useState(isStudent ? 'student_weekly' : 'college');
  const { data: reports, isLoading } = useMyReports();
  const generateMutation = useGenerateReport();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Reports</h1>
          <p className="text-mist">Generate and review periodic snapshots.</p>
        </div>
        <div className="flex items-center gap-2">
          {isStudent && (
            <Select value={scope} onChange={(e) => setScope(e.target.value)} className="w-36">
              <option value="student_weekly">Weekly</option>
              <option value="student_monthly">Monthly</option>
            </Select>
          )}
          <Button
            size="sm"
            onClick={() => generateMutation.mutate(scope)}
            disabled={generateMutation.isPending}
          >
            {generateMutation.isPending ? 'Generating...' : 'Generate report'}
          </Button>
        </div>
      </div>

      {isLoading && <p className="text-mist">Loading reports...</p>}

      {!isLoading && reports?.length === 0 && (
        <Card>
          <CardDescription>No reports generated yet.</CardDescription>
        </Card>
      )}

      <div className="space-y-3">
        {reports?.map((report) => (
          <Card key={report._id}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium capitalize">{report.scope.replace('_', ' ')}</p>
                <p className="text-xs text-mist">
                  {new Date(report.periodStart).toLocaleDateString()} –{' '}
                  {new Date(report.periodEnd).toLocaleDateString()}
                </p>
              </div>
              <p className="text-xs text-mist">
                Generated {new Date(report.generatedAt).toLocaleDateString()}
              </p>
            </div>
            {report.scope.startsWith('student') ? (
              <p className="mt-2 text-sm">
                Score: <span className="font-medium">{report.data.score}</span> (
                {report.data.readiness?.label})
              </p>
            ) : (
              <p className="mt-2 text-sm">
                Placement rate: <span className="font-medium">{report.data.placementRate}%</span> ·{' '}
                {report.data.totalStudents} students
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
