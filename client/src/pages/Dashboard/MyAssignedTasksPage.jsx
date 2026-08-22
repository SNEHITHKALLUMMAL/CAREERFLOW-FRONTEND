import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ClipboardList, Pencil, Ban, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTasksCreatedByMe, useUpdateTask, useCancelTask } from '@/hooks/useTasks';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input, Label } from '@/components/ui/input';

const STATUS_STYLES = {
  pending: 'bg-mist/10 text-mist dark:bg-white/10',
  completed: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  cancelled: 'bg-danger/10 text-danger',
};

/** Every task a mentor, recruiter, or superAdmin has assigned — with edit/cancel for still-pending ones. */
export function MyAssignedTasksPage() {
  const { data: tasks, isLoading } = useTasksCreatedByMe();
  const [editingTaskId, setEditingTaskId] = useState(null);
  const cancelMutation = useCancelTask();

  const handleCancel = (taskId) => {
    cancelMutation.mutate(taskId, {
      onSuccess: () => toast.success('Task cancelled.'),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Tasks I&apos;ve assigned</h1>
        <p className="text-mist">Every task you&apos;ve given a student, and its current status.</p>
      </div>

      {isLoading && <p className="text-mist">Loading tasks...</p>}

      {!isLoading && tasks?.length === 0 && (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mist/10 text-mist dark:bg-white/10">
            <ClipboardList className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-medium">No tasks assigned yet</p>
          <p className="mt-1 max-w-xs text-sm text-mist">
            Tasks you assign to students from their profile will show up here.
          </p>
        </Card>
      )}

      <div className="space-y-3">
        {tasks?.map((task) => {
          const isOverdue =
            task.status === 'pending' && task.dueDate && new Date(task.dueDate) < new Date();

          return (
            <Card key={task._id}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle
                      className={task.status !== 'pending' ? 'line-through opacity-60' : ''}
                    >
                      {task.title}
                    </CardTitle>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                        STATUS_STYLES[task.status] || STATUS_STYLES.pending
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-mist">
                    Assigned to {task.studentId?.userId?.name || 'a student'}
                    {task.studentId?.userId?.email ? ` · ${task.studentId.userId.email}` : ''}
                  </p>
                  {task.description && (
                    <CardDescription className="mt-1">{task.description}</CardDescription>
                  )}
                  {task.dueDate && (
                    <p
                      className={`mt-2 flex items-center gap-1 text-xs ${
                        isOverdue ? 'text-danger' : 'text-mist'
                      }`}
                    >
                      <Clock className="h-3 w-3" />
                      Due {new Date(task.dueDate).toLocaleDateString()}
                      {isOverdue ? ' · overdue' : ''}
                    </p>
                  )}
                </div>

                {task.status === 'pending' && (
                  <div className="flex shrink-0 gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setEditingTaskId((prev) => (prev === task._id ? null : task._id))
                      }
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCancel(task._id)}
                      disabled={cancelMutation.isPending}
                      aria-label={`Cancel ${task.title}`}
                    >
                      <Ban className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {editingTaskId === task._id && (
                <EditTaskForm task={task} onDone={() => setEditingTaskId(null)} />
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function EditTaskForm({ task, onDone }) {
  const updateMutation = useUpdateTask();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
    },
  });

  const onSubmit = async (values) => {
    await updateMutation.mutateAsync({ taskId: task._id, ...values });
    toast.success('Task updated.');
    onDone();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-4 space-y-2 border-t border-mist/15 pt-4 dark:border-white/10"
      noValidate
    >
      <div>
        <Label htmlFor={`edit-title-${task._id}`}>Title</Label>
        <Input
          id={`edit-title-${task._id}`}
          {...register('title', { required: true, maxLength: 150 })}
        />
        {errors.title && <p className="mt-1 text-xs text-danger">Title is required.</p>}
      </div>
      <div>
        <Label htmlFor={`edit-description-${task._id}`}>Description</Label>
        <Textarea id={`edit-description-${task._id}`} rows={3} {...register('description')} />
      </div>
      <div>
        <Label htmlFor={`edit-due-${task._id}`}>Due date</Label>
        <Input id={`edit-due-${task._id}`} type="date" {...register('dueDate')} />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? 'Saving...' : 'Save changes'}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
