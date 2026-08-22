import { useMemo, useState } from 'react';
import { UserCog, Search, X, Mail, GraduationCap, Shuffle } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  useMentors,
  useMentorStudents,
  useAssignStudentsToMentor,
  useUnassignStudentFromMentor,
  useBulkAutoAssignMentors,
} from '@/hooks/useMentors';
import { useStudentAnalytics } from '@/hooks/usePlacement';
import { useDepartments } from '@/hooks/useDepartments';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/textarea';

/**
 * Lets a placement officer (or super admin) pick a mentor, see who's already
 * assigned to them, and assign more students. Only placementOfficer/superAdmin
 * can reach this route (see AppRouter) — the backend enforces the same on every
 * request regardless.
 */
export function MentorAssignmentPage() {
  const { data: mentors, isLoading: mentorsLoading } = useMentors();
  const [selectedMentorId, setSelectedMentorId] = useState(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Mentor assignment</h1>
        <p className="text-mist">Assign students to mentors and manage existing assignments.</p>
      </div>

      <BulkAutoAssignCard mentors={mentors} mentorsLoading={mentorsLoading} />

      <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
        <Card className="h-fit">
          <CardTitle>Mentors</CardTitle>
          {mentorsLoading && <p className="mt-3 text-sm text-mist">Loading mentors...</p>}
          {!mentorsLoading && mentors?.length === 0 && (
            <CardDescription className="mt-2">No mentors registered yet.</CardDescription>
          )}
          <ul className="mt-3 space-y-1">
            {mentors?.map((mentor) => (
              <li key={mentor.id}>
                <button
                  type="button"
                  onClick={() => setSelectedMentorId(mentor.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    selectedMentorId === mentor.id
                      ? 'bg-signal text-white'
                      : 'text-ink hover:bg-mist/10 dark:text-white dark:hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">{mentor.name}</span>
                  <span
                    className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs ${
                      selectedMentorId === mentor.id
                        ? 'bg-white/20'
                        : 'bg-mist/10 text-mist dark:bg-white/10'
                    }`}
                  >
                    {mentor.assignedStudentCount}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Card>

        {selectedMentorId ? (
          <MentorAssignmentPanel mentorId={selectedMentorId} />
        ) : (
          <Card className="flex flex-col items-center justify-center py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mist/10 text-mist dark:bg-white/10">
              <UserCog className="h-5 w-5" />
            </span>
            <p className="mt-3 text-sm font-medium">Select a mentor</p>
            <p className="mt-1 max-w-xs text-sm text-mist">
              Pick a mentor from the list to view and manage their assigned students.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

/**
 * Auto-distributes every currently-unassigned student round-robin across the
 * selected mentors, in one action — for onboarding a whole cohort at once
 * instead of assigning students one by one.
 */
function BulkAutoAssignCard({ mentors, mentorsLoading }) {
  const [open, setOpen] = useState(false);
  const [selectedMentorIds, setSelectedMentorIds] = useState([]);
  const [departmentId, setDepartmentId] = useState('');
  const { data: departments, isLoading: departmentsLoading } = useDepartments();
  const bulkAssignMutation = useBulkAutoAssignMentors();

  const toggleMentor = (id) => {
    setSelectedMentorIds((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]));
  };

  const handleRun = () => {
    if (selectedMentorIds.length === 0) return;
    bulkAssignMutation.mutate(
      { mentorIds: selectedMentorIds, departmentId: departmentId || undefined },
      {
        onSuccess: (result) => {
          toast.success(
            result.assignedCount > 0
              ? `${result.assignedCount} unassigned student(s) distributed across ${selectedMentorIds.length} mentor(s).`
              : 'No unassigned students to distribute.'
          );
          setSelectedMentorIds([]);
          setOpen(false);
        },
      }
    );
  };

  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <div>
          <CardTitle>Bulk auto-assign</CardTitle>
          <CardDescription>
            Distribute every currently-unassigned student evenly (round-robin) across mentors you
            pick — handy when onboarding a whole cohort at once.
          </CardDescription>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen((o) => !o)}>
          <Shuffle className="h-4 w-4" />
          {open ? 'Close' : 'Bulk assign'}
        </Button>
      </div>

      {open && (
        <div className="mt-4 space-y-4 border-t border-mist/15 pt-4 dark:border-white/10">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-mist">
              Limit to department (optional)
            </label>
            <Select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="sm:w-64"
              disabled={departmentsLoading}
            >
              <option value="">All departments</option>
              {departments?.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </Select>
          </div>

          {mentorsLoading && <p className="text-sm text-mist">Loading mentors...</p>}
          <div className="flex flex-wrap gap-2">
            {mentors?.map((mentor) => {
              const checked = selectedMentorIds.includes(mentor.id);
              return (
                <label
                  key={mentor.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    checked
                      ? 'border-signal bg-signal-light text-signal-dark dark:bg-signal/15 dark:text-white'
                      : 'border-mist/25 text-ink hover:bg-mist/10 dark:border-white/15 dark:text-white dark:hover:bg-white/5'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleMentor(mentor.id)}
                    className="h-3.5 w-3.5 rounded border-mist/40 text-signal focus:ring-signal"
                  />
                  {mentor.name}
                </label>
              );
            })}
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleRun}
            disabled={selectedMentorIds.length === 0 || bulkAssignMutation.isPending}
          >
            {bulkAssignMutation.isPending
              ? 'Assigning...'
              : `Distribute across ${selectedMentorIds.length || 0} mentor(s)`}
          </Button>
        </div>
      )}
    </Card>
  );
}

function MentorAssignmentPanel({ mentorId }) {
  const { data, isLoading } = useMentorStudents(mentorId);
  const unassignMutation = useUnassignStudentFromMentor(mentorId);

  const handleUnassign = (studentId) => {
    unassignMutation.mutate(studentId, {
      onSuccess: () => toast.success('Student unassigned.'),
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle>{isLoading ? 'Loading...' : `${data?.mentor.name}'s students`}</CardTitle>
        <CardDescription className="mt-1">
          {data?.students.length ? `${data.students.length} assigned` : 'No students assigned yet'}
        </CardDescription>

        {data?.students.length > 0 && (
          <ul className="mt-4 space-y-2">
            {data.students.map((student) => (
              <li
                key={student.studentId}
                className="flex items-center justify-between rounded-xl border border-mist/15 px-3.5 py-2.5 dark:border-white/10"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{student.name}</p>
                  <p className="truncate text-xs text-mist">
                    {student.email}
                    {student.department ? ` · ${student.department}` : ''}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleUnassign(student.studentId)}
                  disabled={unassignMutation.isPending}
                  aria-label={`Unassign ${student.name}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <AssignStudentsCard mentorId={mentorId} assignedStudentIds={data?.students.map((s) => s.studentId) || []} />
    </div>
  );
}

function AssignStudentsCard({ mentorId, assignedStudentIds }) {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const { data: studentPage, isLoading } = useStudentAnalytics({ limit: 100 });
  const assignMutation = useAssignStudentsToMentor(mentorId);

  const assignedSet = useMemo(() => new Set(assignedStudentIds.map(String)), [assignedStudentIds]);

  const candidates = useMemo(() => {
    const items = studentPage?.items || [];
    const unassigned = items.filter((s) => !assignedSet.has(String(s.studentId)));
    if (!search.trim()) return unassigned;
    const q = search.trim().toLowerCase();
    return unassigned.filter(
      (s) => s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q)
    );
  }, [studentPage, assignedSet, search]);

  const toggleSelected = (studentId) => {
    setSelectedIds((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const handleAssign = () => {
    if (selectedIds.length === 0) return;
    assignMutation.mutate(selectedIds, {
      onSuccess: () => {
        toast.success(
          `${selectedIds.length} student${selectedIds.length > 1 ? 's' : ''} assigned.`
        );
        setSelectedIds([]);
      },
    });
  };

  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <CardTitle>Assign students</CardTitle>
        <Button
          type="button"
          size="sm"
          onClick={handleAssign}
          disabled={selectedIds.length === 0 || assignMutation.isPending}
        >
          {assignMutation.isPending ? 'Assigning...' : `Assign (${selectedIds.length})`}
        </Button>
      </div>

      <div className="relative mt-4">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search students by name or email..."
          className="pl-10"
        />
      </div>

      {isLoading && <p className="mt-4 text-sm text-mist">Loading students...</p>}

      {!isLoading && candidates.length === 0 && (
        <CardDescription className="mt-4">
          {search ? 'No matching students.' : 'No unassigned students available.'}
        </CardDescription>
      )}

      {candidates.length > 0 && (
        <ul className="mt-4 max-h-96 space-y-1 overflow-y-auto pr-1">
          {candidates.map((student) => {
            const checked = selectedIds.includes(student.studentId);
            return (
              <li key={student.studentId}>
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    checked
                      ? 'bg-signal-light dark:bg-signal/15'
                      : 'hover:bg-mist/10 dark:hover:bg-white/5'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSelected(student.studentId)}
                    className="h-4 w-4 shrink-0 rounded border-mist/40 text-signal focus:ring-signal"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{student.name}</span>
                    <span className="flex items-center gap-1 truncate text-xs text-mist">
                      <Mail className="h-3 w-3 shrink-0" />
                      {student.email}
                    </span>
                  </span>
                  {student.hasResume && (
                    <span className="flex shrink-0 items-center gap-1 text-xs text-mist">
                      <GraduationCap className="h-3.5 w-3.5" />
                    </span>
                  )}
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
