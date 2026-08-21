import { Award, X } from 'lucide-react';
import { useMyApplications, useWithdrawApplication } from '@/hooks/useApplications';
import { Card, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

const STATUS_STYLES = {
  applied: 'bg-mist/10 text-mist',
  shortlisted: 'bg-signal-light text-signal-dark dark:bg-signal/15 dark:text-signal',
  interview_scheduled: 'bg-ember-light text-ember-dark dark:bg-ember/15 dark:text-ember',
  offered: 'bg-momentum-light text-momentum-dark dark:bg-momentum/15 dark:text-momentum',
  rejected: 'bg-red-500/10 text-red-500',
  withdrawn: 'bg-mist/10 text-mist line-through',
};

export function MyApplicationsPage() {
  const { data: applications, isLoading } = useMyApplications();
  const withdrawMutation = useWithdrawApplication();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">My applications</h1>
        <p className="text-mist">
          Track the status of every job and internship you&apos;ve applied to.
        </p>
      </div>

      {isLoading && <p className="text-mist">Loading applications...</p>}

      {!isLoading && applications?.length === 0 && (
        <Card>
          <CardDescription>
            No applications yet — browse jobs or internships to get started.
          </CardDescription>
        </Card>
      )}

      <div className="space-y-3">
        {applications?.map((application) => (
          <Card key={application._id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase text-mist">
                  {application.targetType === 'job' ? 'Job' : 'Internship'}
                </p>
                <p className="font-medium">{application.targetId?.title || 'Listing removed'}</p>
                {application.interview?.scheduledAt && (
                  <p className="mt-1 text-xs text-mist">
                    Interview: {new Date(application.interview.scheduledAt).toLocaleString()} ·{' '}
                    {application.interview.mode}
                  </p>
                )}
              </div>
              <span
                className={cn(
                  'shrink-0 rounded-full px-3 py-1 text-xs font-medium capitalize',
                  STATUS_STYLES[application.status] || 'bg-mist/10 text-mist'
                )}
              >
                {application.status.replace('_', ' ')}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              {application.offerLetterUrl && (
                <a
                  href={application.offerLetterUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-sm font-medium text-signal hover:underline"
                >
                  <Award className="h-4 w-4" />
                  View offer letter
                </a>
              )}
              {!['withdrawn', 'rejected', 'offered'].includes(application.status) && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => withdrawMutation.mutate(application._id)}
                  disabled={withdrawMutation.isPending}
                >
                  <X className="h-4 w-4" />
                  Withdraw
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
