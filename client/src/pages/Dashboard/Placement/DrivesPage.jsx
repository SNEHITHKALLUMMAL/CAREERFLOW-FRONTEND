import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Users, Calendar } from 'lucide-react';
import {
  useDrives,
  useCreateDrive,
  useUpdateDriveStatus,
  useEligibleStudents,
} from '@/hooks/useDrives';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Label, FieldError } from '@/components/ui/input';
import { Select } from '@/components/ui/textarea';

function CreateDriveForm({ onDone }) {
  const createMutation = useCreateDrive();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (values) => {
    await createMutation.mutateAsync(values);
    onDone();
  };

  return (
    <Card>
      <CardTitle>Schedule a drive</CardTitle>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3" noValidate>
        <div>
          <Label htmlFor="jobId">Job ID</Label>
          <Input
            id="jobId"
            placeholder="Paste the job's ID"
            {...register('jobId', { required: 'Job ID is required' })}
          />
          <FieldError>{errors.jobId?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="driveDate">Drive date</Label>
          <Input
            id="driveDate"
            type="date"
            {...register('driveDate', { required: 'Date is required' })}
          />
          <FieldError>{errors.driveDate?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="notes">Notes (optional)</Label>
          <Input id="notes" {...register('notes')} />
        </div>
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={isSubmitting}>
            Schedule
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={onDone}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}

function EligibleStudentsList({ driveId }) {
  const { data: students, isLoading } = useEligibleStudents(driveId);

  if (isLoading) return <p className="text-sm text-mist">Checking eligibility...</p>;
  if (!students || students.length === 0)
    return <p className="text-sm text-mist">No eligible students found.</p>;

  return (
    <ul className="mt-2 space-y-1 text-sm">
      {students.map((s) => (
        <li key={s.studentId} className="flex justify-between rounded-lg bg-mist/5 px-2.5 py-1.5">
          <span>{s.name}</span>
          <span className="text-mist">{s.email}</span>
        </li>
      ))}
    </ul>
  );
}

export function DrivesPage() {
  const { data: drives, isLoading } = useDrives();
  const updateStatusMutation = useUpdateDriveStatus();
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Placement drives</h1>
          <p className="text-mist">Schedule and track campus recruitment drives.</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" />
            Schedule drive
          </Button>
        )}
      </div>

      {showForm && <CreateDriveForm onDone={() => setShowForm(false)} />}

      {isLoading && <p className="text-mist">Loading drives...</p>}

      {!isLoading && drives?.length === 0 && !showForm && (
        <Card>
          <CardDescription>No drives scheduled yet.</CardDescription>
        </Card>
      )}

      <div className="space-y-3">
        {drives?.map((drive) => (
          <Card key={drive._id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>{drive.jobId?.title || 'Job removed'}</CardTitle>
                <p className="flex items-center gap-1 text-xs text-mist">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(drive.driveDate).toLocaleDateString()} ·{' '}
                  {drive.recruiterId?.companyName}
                </p>
              </div>
              <Select
                value={drive.status}
                onChange={(e) =>
                  updateStatusMutation.mutate({ id: drive._id, status: e.target.value })
                }
                className="w-36"
              >
                <option value="scheduled">Scheduled</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </div>

            <Button
              size="sm"
              variant="ghost"
              className="mt-3"
              onClick={() => setExpandedId(expandedId === drive._id ? null : drive._id)}
            >
              <Users className="h-4 w-4" />
              {expandedId === drive._id ? 'Hide eligible students' : 'View eligible students'}
            </Button>

            {expandedId === drive._id && <EligibleStudentsList driveId={drive._id} />}
          </Card>
        ))}
      </div>
    </div>
  );
}
