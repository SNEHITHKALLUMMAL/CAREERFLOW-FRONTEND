import { Users, TrendingUp, Calendar, FileText } from 'lucide-react';
import { usePlacementAnalytics } from '@/hooks/usePlacement';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';

function StatCard({ icon: Icon, label, value }) {
  return (
    <Card>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal-light text-signal dark:bg-signal/15">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-3 font-display text-2xl font-semibold">{value}</p>
      <p className="text-sm text-mist">{label}</p>
    </Card>
  );
}

export function PlacementOverviewPage() {
  const { data, isLoading } = usePlacementAnalytics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Placement overview</h1>
        <p className="text-mist">A snapshot of how your students are doing.</p>
      </div>

      {isLoading && <p className="text-mist">Loading analytics...</p>}

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Users} label="Total students" value={data.totalStudents} />
            <StatCard icon={TrendingUp} label="Placement rate" value={`${data.placementRate}%`} />
            <StatCard icon={Calendar} label="Drives" value={data.totalDrives} />
            <StatCard icon={FileText} label="Applications" value={data.totalApplications} />
          </div>

          <Card>
            <CardTitle>Applications by status</CardTitle>
            {Object.keys(data.applicationsByStatus).length === 0 ? (
              <CardDescription className="mt-2">No applications yet.</CardDescription>
            ) : (
              <ul className="mt-4 space-y-2">
                {Object.entries(data.applicationsByStatus).map(([status, count]) => (
                  <li key={status} className="flex items-center justify-between text-sm">
                    <span className="capitalize text-mist">{status.replace('_', ' ')}</span>
                    <span className="font-mono font-medium">{count}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
