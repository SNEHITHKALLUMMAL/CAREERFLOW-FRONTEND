import { Users, MessageSquare, CalendarCheck, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';

/**
 * Basic working dashboard for the 'mentor' role.
 * Mentor <-> student assignment isn't modelled on the backend yet, so the
 * "assigned students" section intentionally renders an empty state rather
 * than calling an endpoint that doesn't exist. Swap in a real query here
 * once mentor-student assignment ships.
 */
export function MentorOverviewPage() {
  const { user } = useAuth();

  const stats = [
    { label: 'Assigned students', value: 0, icon: Users },
    { label: 'Sessions this month', value: 0, icon: CalendarCheck },
    { label: 'Unread messages', value: 0, icon: MessageSquare },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Welcome back, {user?.name}</h1>
        <p className="text-mist">Here&apos;s your mentoring activity at a glance.</p>
      </div>

      {/* Profile summary */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-signal-light text-lg font-semibold text-signal dark:bg-signal/15">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              (user?.name || '?').charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <CardTitle className="truncate">{user?.name}</CardTitle>
            <CardDescription className="truncate">{user?.email}</CardDescription>
            <span className="mt-1 inline-flex items-center rounded-full bg-mist/10 px-2.5 py-0.5 text-xs font-medium capitalize text-mist dark:bg-white/10">
              Mentor
            </span>
          </div>
        </div>
      </Card>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal-light text-signal dark:bg-signal/15">
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-3 font-display text-2xl font-semibold">{value}</p>
            <p className="text-sm text-mist">{label}</p>
          </Card>
        ))}
      </div>

      {/* Assigned students — empty state */}
      <Card>
        <CardTitle>Assigned students</CardTitle>
        <CardDescription className="mt-1">
          Students assigned to you for mentoring will show up here.
        </CardDescription>
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-mist/25 py-10 text-center dark:border-white/15">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mist/10 text-mist dark:bg-white/10">
            <Sparkles className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-medium">No students assigned yet</p>
          <p className="mt-1 max-w-xs text-sm text-mist">
            Once a placement officer assigns students to you, they&apos;ll appear here along with
            their progress.
          </p>
        </div>
      </Card>
    </div>
  );
}
