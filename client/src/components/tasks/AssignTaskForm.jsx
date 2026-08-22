import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useCreateTask } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input, Label } from '@/components/ui/input';

/**
 * Inline "assign a task" form for a single student — used from the mentor's
 * roster and from a recruiter's applicant list. Mirrors the InterviewForm /
 * OfferLetterForm pattern already used on ApplicantsPage.
 */
export function AssignTaskForm({ studentId, onDone }) {
  const createTaskMutation = useCreateTask();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {
    await createTaskMutation.mutateAsync({ studentId, ...values });
    toast.success('Task assigned.');
    onDone();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-3 space-y-2 rounded-lg bg-mist/5 p-3"
      noValidate
    >
      <div>
        <Label htmlFor={`task-title-${studentId}`}>Title</Label>
        <Input
          id={`task-title-${studentId}`}
          placeholder="e.g. Complete resume review"
          {...register('title', { required: true, maxLength: 150 })}
        />
        {errors.title && <p className="mt-1 text-xs text-danger">Title is required.</p>}
      </div>
      <div>
        <Label htmlFor={`task-description-${studentId}`}>Description (optional)</Label>
        <Textarea
          id={`task-description-${studentId}`}
          rows={3}
          placeholder="Any details the student should know..."
          {...register('description', { maxLength: 2000 })}
        />
      </div>
      <div>
        <Label htmlFor={`task-due-${studentId}`}>Due date (optional)</Label>
        <Input id={`task-due-${studentId}`} type="date" {...register('dueDate')} />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={createTaskMutation.isPending}>
          {createTaskMutation.isPending ? 'Assigning...' : 'Assign task'}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
