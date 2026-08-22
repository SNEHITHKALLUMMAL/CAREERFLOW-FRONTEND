import { useState } from 'react';
import { Users, MessageSquare, CalendarCheck, Sparkles, Mail, ClipboardPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMentorStudents } from '@/hooks/useMentors';
import { AssignTaskForm } from '@/components/tasks/AssignTaskForm';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/** Basic working dashboard for the 'mentor' role. */
export function MentorOverviewPage() {
  const { user } = useAuth();
  const { data, isLoading } = useMentorStudents(user?.id);
  const students = data?.students || [];
  const [taskFormFor, setTaskFormFor] = useState(null);

  const stats = [
    { label: 'Assigned students', value: students.length, icon: Users },
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

      {/* Assigned students */}
      <Card>
        <CardTitle>Assigned students</CardTitle>
        <CardDescription className="mt-1">
          Students assigned to you for mentoring.
        </CardDescription>

        {isLoading && <p className="mt-4 text-sm text-mist">Loading...</p>}

        {!isLoading && students.length === 0 && (
          <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-mist/25 py-10 text-center dark:border-white/15">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mist/10 text-mist dark:bg-white/10">
              <Sparkles className="h-5 w-5" />
            </span>
            <p className="mt-3 text-sm font-medium">No students assigned yet</p>
            <p className="mt-1 max-w-xs text-sm text-mist">
              Once a placement officer assigns students to you, they&apos;ll appear here along
              with their progress.
            </p>
          </div>
        )}

        {students.length > 0 && (
          <ul className="mt-4 space-y-2">
            {students.map((student) => (
              <li
                key={student.studentId}
                className="rounded-xl border border-mist/15 px-3.5 py-2.5 dark:border-white/10"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{student.name}</p>
                    <p className="flex items-center gap-1 truncate text-xs text-mist">
                      <Mail className="h-3 w-3 shrink-0" />
                      {student.email}
                      {student.department ? ` · ${student.department}` : ''}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {student.skills?.length > 0 && (
                      <span className="hidden truncate text-xs text-mist sm:inline">
                        {student.skills.slice(0, 3).join(', ')}
                      </span>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setTaskFormFor((prev) => (prev === student.studentId ? null : student.studentId))
                      }
                    >
                      <ClipboardPlus className="h-4 w-4" />
                      Assign task
                    </Button>
                  </div>
                </div>

                {taskFormFor === student.studentId && (
                  <AssignTaskForm
                    studentId={student.studentId}
                    onDone={() => setTaskFormFor(null)}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
