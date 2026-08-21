import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CalendarPlus, Award } from 'lucide-react';
import { useApplicants } from '@/hooks/useListing';
import {
  useUpdateApplicationStatus,
  useScheduleInterview,
  useIssueOfferLetter,
} from '@/hooks/useApplications';
import { APPLICATION_STATUSES_ORDER } from '@/utils/applicationLabels';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/textarea';
import { Input, Label } from '@/components/ui/input';

function InterviewForm({ applicationId, onDone }) {
  const scheduleMutation = useScheduleInterview();
  const { register, handleSubmit } = useForm({ defaultValues: { mode: 'online' } });

  const onSubmit = async (values) => {
    await scheduleMutation.mutateAsync({ id: applicationId, ...values });
    onDone();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-3 space-y-2 rounded-lg bg-mist/5 p-3"
      noValidate
    >
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <Label htmlFor="scheduledAt">Date &amp; time</Label>
          <Input
            id="scheduledAt"
            type="datetime-local"
            {...register('scheduledAt', { required: true })}
          />
        </div>
        <div>
          <Label htmlFor="mode">Mode</Label>
          <Select id="mode" {...register('mode')}>
            <option value="online">Online</option>
            <option value="in-person">In-person</option>
            <option value="phone">Phone</option>
          </Select>
        </div>
      </div>
      <Input placeholder="Meeting link (optional)" {...register('link')} />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={scheduleMutation.isPending}>
          Schedule
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function OfferLetterForm({ applicationId, onDone }) {
  const offerMutation = useIssueOfferLetter();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (values) => {
    await offerMutation.mutateAsync({ id: applicationId, ...values });
    onDone();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-3 space-y-2 rounded-lg bg-mist/5 p-3"
      noValidate
    >
      <Input placeholder="Position title" {...register('position', { required: true })} />
      <div className="grid gap-2 sm:grid-cols-2">
        <Input placeholder="Salary (optional)" {...register('salary')} />
        <Input type="date" {...register('startDate', { required: true })} />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={offerMutation.isPending}>
          Issue offer
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function ApplicantsPage({ kind }) {
  const { id } = useParams();
  const { data: applicants, isLoading } = useApplicants(kind, id);
  const statusMutation = useUpdateApplicationStatus();
  const [openForm, setOpenForm] = useState(null); // `${applicationId}:interview` | `${applicationId}:offer`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Applicants</h1>
        <p className="text-mist">Review and manage applications for this listing.</p>
      </div>

      {isLoading && <p className="text-mist">Loading applicants...</p>}

      {!isLoading && applicants?.length === 0 && (
        <Card>
          <CardDescription>No applications yet.</CardDescription>
        </Card>
      )}

      <div className="space-y-3">
        {applicants?.map((application) => (
          <Card key={application._id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>{application.studentId?.userId?.name || 'Unknown student'}</CardTitle>
                <p className="text-xs text-mist">{application.studentId?.userId?.email}</p>
              </div>
              <Select
                value={application.status}
                onChange={(e) =>
                  statusMutation.mutate({ id: application._id, status: e.target.value })
                }
                className="w-40"
              >
                {APPLICATION_STATUSES_ORDER.map((status) => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ')}
                  </option>
                ))}
              </Select>
            </div>

            <div className="mt-3 flex flex-wrap gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setOpenForm(`${application._id}:interview`)}
              >
                <CalendarPlus className="h-4 w-4" />
                Schedule interview
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setOpenForm(`${application._id}:offer`)}
              >
                <Award className="h-4 w-4" />
                Issue offer letter
              </Button>
            </div>

            {openForm === `${application._id}:interview` && (
              <InterviewForm applicationId={application._id} onDone={() => setOpenForm(null)} />
            )}
            {openForm === `${application._id}:offer` && (
              <OfferLetterForm applicationId={application._id} onDone={() => setOpenForm(null)} />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
