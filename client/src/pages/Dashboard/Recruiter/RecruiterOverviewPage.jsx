import { Link } from 'react-router-dom';
import { CheckCircle2, Clock3, Briefcase, GraduationCap } from 'lucide-react';
import { useRecruiterProfile } from '@/hooks/useRecruiterProfile';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function RecruiterOverviewPage() {
  const { data: recruiter, isLoading } = useRecruiterProfile();

  if (isLoading || !recruiter) return <p className="text-mist">Loading your profile...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Welcome back</h1>
        <p className="text-mist">Manage your job and internship postings from here.</p>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{recruiter.companyName || 'Complete your company profile'}</CardTitle>
            <CardDescription>
              {recruiter.isVerified
                ? 'Your account is verified — you can post jobs and internships.'
                : 'Your account is pending verification by an administrator before you can post listings.'}
            </CardDescription>
          </div>
          {recruiter.isVerified ? (
            <span className="flex items-center gap-1.5 rounded-full bg-momentum-light px-3 py-1.5 text-sm font-medium text-momentum-dark dark:bg-momentum/15 dark:text-momentum">
              <CheckCircle2 className="h-4 w-4" />
              Verified
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-ember-light px-3 py-1.5 text-sm font-medium text-ember-dark dark:bg-ember/15 dark:text-ember">
              <Clock3 className="h-4 w-4" />
              Pending
            </span>
          )}
        </div>
        {!recruiter.companyName && (
          <Button size="sm" className="mt-4" asChild>
            <Link to="/dashboard/company-profile">Complete profile</Link>
          </Button>
        )}
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal-light text-signal dark:bg-signal/15">
            <Briefcase className="h-5 w-5" />
          </span>
          <CardTitle className="mt-3">Jobs</CardTitle>
          <CardDescription>Post and manage your job listings.</CardDescription>
          <Button size="sm" variant="secondary" className="mt-3" asChild>
            <Link to="/dashboard/my-jobs">Manage jobs</Link>
          </Button>
        </Card>
        <Card>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-momentum-light text-momentum dark:bg-momentum/15">
            <GraduationCap className="h-5 w-5" />
          </span>
          <CardTitle className="mt-3">Internships</CardTitle>
          <CardDescription>Post and manage your internship listings.</CardDescription>
          <Button size="sm" variant="secondary" className="mt-3" asChild>
            <Link to="/dashboard/my-internships">Manage internships</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
