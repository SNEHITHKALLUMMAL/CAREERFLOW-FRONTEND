import { CheckCircle2, Clock3 } from 'lucide-react';
import { usePlacementRecruiters } from '@/hooks/usePlacement';
import { Card, CardDescription } from '@/components/ui/card';

export function RecruiterManagementPage() {
  const { data: recruiters, isLoading } = usePlacementRecruiters();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Recruiters</h1>
        <p className="text-mist">Every recruiter on the platform and their posting activity.</p>
      </div>

      {isLoading && <p className="text-mist">Loading recruiters...</p>}

      {!isLoading && recruiters?.length === 0 && (
        <Card>
          <CardDescription>No recruiters yet.</CardDescription>
        </Card>
      )}

      <div className="space-y-3">
        {recruiters?.map((recruiter) => (
          <Card key={recruiter.recruiterId} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{recruiter.companyName || 'Unnamed company'}</p>
              <p className="text-xs text-mist">
                {recruiter.contactName} · {recruiter.contactEmail}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-mist">
              <span>{recruiter.jobCount} jobs</span>
              <span>{recruiter.internshipCount} internships</span>
              {recruiter.isVerified ? (
                <span className="flex items-center gap-1 text-momentum">
                  <CheckCircle2 className="h-4 w-4" />
                  Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 text-ember">
                  <Clock3 className="h-4 w-4" />
                  Pending
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
