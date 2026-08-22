import { ClipboardList, Check, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import { useMyTasks, useCompleteTask } from '@/hooks/useTasks';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ROLE_LABELS = {
  mentor: 'Mentor',
  recruiter: 'Recruiter',
  superAdmin: 'Admin',
};

export function MyTasksPage() {
  const { data: tasks, isLoading } = useMyTasks();
  const completeMutation = useCompleteTask();

  const pending = tasks?.filter((t) => t.status === 'pending') || [];
  const completed = tasks?.filter((t) => t.status === 'completed') || [];

  const handleComplete = (taskId) => {
    completeMutation.mutate(taskId, {
      onSuccess: () => toast.success('Task marked complete.'),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">My tasks</h1>
        <p className="text-mist">Tasks assigned to you by your mentor, a recruiter, or an admin.</p>
      </div>

      {isLoading && <p className="text-mist">Loading tasks...</p>}

      {!isLoading && tasks?.length === 0 && (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mist/10 text-mist dark:bg-white/10">
            <ClipboardList className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-medium">No tasks yet</p>
          <p className="mt-1 max-w-xs text-sm text-mist">
            Tasks your mentor, a recruiter, or an admin assign you will show up here.
          </p>
        </Card>
      )}

      {pending.length > 0 && (
        <div>
          <h2 className="font-display text-lg font-semibold">Pending ({pending.length})</h2>
          <div className="mt-3 space-y-3">
            {pending.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onComplete={() => handleComplete(task._id)}
                completing={completeMutation.isPending}
              />
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <h2 className="font-display text-lg font-semibold">Completed ({completed.length})</h2>
          <div className="mt-3 space-y-3">
            {completed.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TaskCard({ task, onComplete, completing }) {
  const isOverdue = task.status === 'pending' && task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <CardTitle className={task.status === 'completed' ? 'line-through opacity-60' : ''}>
              {task.title}
            </CardTitle>
            <span className="shrink-0 rounded-full bg-mist/10 px-2 py-0.5 text-xs font-medium text-mist dark:bg-white/10">
              {ROLE_LABELS[task.assignedByRole] || task.assignedByRole}
            </span>
          </div>
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
          <Button type="button" size="sm" onClick={onComplete} disabled={completing}>
            <Check className="h-4 w-4" />
            Mark done
          </Button>
        )}
      </div>
    </Card>
  );
}
