import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useStudentAnalytics } from '@/hooks/usePlacement';
import { Card, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function StudentAnalyticsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useStudentAnalytics({ page, limit: 20 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Student analytics</h1>
        <p className="text-mist">Profile readiness across your students.</p>
      </div>

      {isLoading && <p className="text-mist">Loading students...</p>}

      {!isLoading && data?.items.length === 0 && (
        <Card>
          <CardDescription>No students found.</CardDescription>
        </Card>
      )}

      <div className="overflow-hidden rounded-2xl border border-mist/15 dark:border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-mist/5 text-left text-xs uppercase text-mist">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Profile</th>
              <th className="px-4 py-3">Resume</th>
              <th className="px-4 py-3">Applications</th>
            </tr>
          </thead>
          <tbody>
            {data?.items.map((student) => (
              <tr key={student.studentId} className="border-t border-mist/10 dark:border-white/10">
                <td className="px-4 py-3">
                  <p className="font-medium">{student.name}</p>
                  <p className="text-xs text-mist">{student.email}</p>
                </td>
                <td className="px-4 py-3">{student.profileCompletionPercent}%</td>
                <td className="px-4 py-3">
                  {student.hasResume ? (
                    <CheckCircle2 className="h-4 w-4 text-momentum" />
                  ) : (
                    <XCircle className="h-4 w-4 text-mist/40" />
                  )}
                </td>
                <td className="px-4 py-3">{student.applicationCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            size="sm"
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-mist">
            Page {data.pagination.page} of {data.pagination.totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={page >= data.pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
