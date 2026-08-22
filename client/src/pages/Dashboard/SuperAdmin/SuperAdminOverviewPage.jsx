import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Briefcase,
  GraduationCap,
  School,
  FileText,
  ClipboardCheck,
  UserCog,
  BarChart3,
  Activity,
  Users2,
  ArrowUpDown,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePlatformStats, useRecentActivity } from '@/hooks/useAdmin';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/textarea';

const STAT_CARDS = [
  { key: 'totalStudents', label: 'Total students', icon: Users },
  { key: 'totalRecruiters', label: 'Total recruiters', icon: Briefcase },
  { key: 'totalMentors', label: 'Total mentors', icon: UserCog },
  { key: 'totalColleges', label: 'Total colleges', icon: School },
  { key: 'totalJobs', label: 'Total jobs', icon: GraduationCap },
  { key: 'totalApplications', label: 'Total applications', icon: FileText },
];

const QUICK_ACTIONS = [
  {
    to: '/dashboard/manage-users',
    label: 'Manage users',
    description: 'Search every account on the platform and activate or deactivate any of them.',
    icon: Users2,
  },
  {
    to: '/dashboard/mentor-assignment',
    label: 'Manage mentors',
    description: 'Assign students to mentors across every college.',
    icon: UserCog,
  },
  {
    to: '/dashboard/recruiter-management',
    label: 'Manage recruiters',
    description: 'Verify recruiter accounts before they can post listings.',
    icon: ClipboardCheck,
  },
  {
    to: '/dashboard/reports',
    label: 'View reports',
    description: 'Platform-wide placement and career analytics.',
    icon: BarChart3,
  },
];

const ACTIVITY_TYPES = [
  { value: '', label: 'All activity' },
  { value: 'mentor.assigned', label: 'Mentor assigned' },
  { value: 'mentor.unassigned', label: 'Mentor unassigned' },
  { value: 'mentor.bulk_assigned', label: 'Mentor bulk-assigned' },
  { value: 'task.created', label: 'Task assigned' },
  { value: 'task.completed', label: 'Task completed' },
  { value: 'task.cancelled', label: 'Task cancelled' },
  { value: 'user.deactivated', label: 'User deactivated' },
  { value: 'user.reactivated', label: 'User reactivated' },
];

export function SuperAdminOverviewPage() {
  const { user } = useAuth();
  const { data: stats, isLoading } = usePlatformStats();
  const [activityType, setActivityType] = useState('');
  const [activitySort, setActivitySort] = useState('desc');
  const { data: activity, isLoading: activityLoading } = useRecentActivity({
    limit: 15,
    type: activityType || undefined,
    sort: activitySort,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Welcome back, {user?.name}</h1>
        <p className="text-mist">Here&apos;s how CareerFlow is doing across the platform.</p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STAT_CARDS.map(({ key, label, icon: Icon }) => (
          <Card key={key}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal-light text-signal dark:bg-signal/15">
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-3 font-display text-2xl font-semibold">
              {isLoading ? '—' : (stats?.[key] ?? 0).toLocaleString()}
            </p>
            <p className="text-sm text-mist">{label}</p>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-display text-lg font-semibold">Quick actions</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map(({ to, label, description, icon: Icon }) => (
            <Card key={to}>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-momentum-light text-momentum dark:bg-momentum/15">
                <Icon className="h-5 w-5" />
              </span>
              <CardTitle className="mt-3">{label}</CardTitle>
              <CardDescription>{description}</CardDescription>
              <Button size="sm" variant="secondary" className="mt-3" asChild>
                <Link to={to}>Open</Link>
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mist/10 text-mist dark:bg-white/10">
              <Activity className="h-5 w-5" />
            </span>
            <div>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>
                Mentor assignments, task assignments, and account changes.
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              className="h-9 w-48 text-xs"
            >
              {ACTIVITY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setActivitySort((s) => (s === 'desc' ? 'asc' : 'desc'))}
            >
              <ArrowUpDown className="h-4 w-4" />
              {activitySort === 'desc' ? 'Newest first' : 'Oldest first'}
            </Button>
          </div>
        </div>

        {activityLoading && <p className="mt-4 text-sm text-mist">Loading activity...</p>}

        {!activityLoading && activity?.length === 0 && (
          <p className="mt-4 text-sm text-mist">No matching activity.</p>
        )}

        {activity?.length > 0 && (
          <ul className="mt-4 space-y-3">
            {activity.map((entry) => (
              <li
                key={entry._id}
                className="flex items-start justify-between gap-4 border-b border-mist/10 pb-3 text-sm last:border-0 last:pb-0 dark:border-white/5"
              >
                <span className="text-ink dark:text-white">{entry.message}</span>
                <span className="shrink-0 whitespace-nowrap text-xs text-mist">
                  {new Date(entry.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
