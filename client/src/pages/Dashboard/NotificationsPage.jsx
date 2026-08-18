import { Bell, CheckCircle2, Calendar, Award, Megaphone } from 'lucide-react';
import {
  useMyNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '@/hooks/useNotifications';
import { Card, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

const TYPE_ICONS = {
  application_status: CheckCircle2,
  interview: Calendar,
  offer: Award,
  drive: Megaphone,
  system: Bell,
};

export function NotificationsPage() {
  const { data: notifications, isLoading } = useMyNotifications();
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const hasUnread = notifications?.some((n) => !n.isRead);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Notifications</h1>
          <p className="text-mist">Updates on your applications, interviews, and drives.</p>
        </div>
        {hasUnread && (
          <Button size="sm" variant="outline" onClick={() => markAllReadMutation.mutate()}>
            Mark all as read
          </Button>
        )}
      </div>

      {isLoading && <p className="text-mist">Loading notifications...</p>}

      {!isLoading && notifications?.length === 0 && (
        <Card>
          <CardDescription>No notifications yet.</CardDescription>
        </Card>
      )}

      <div className="space-y-2">
        {notifications?.map((notification) => {
          const Icon = TYPE_ICONS[notification.type] || Bell;
          return (
            <button
              key={notification._id}
              type="button"
              onClick={() => !notification.isRead && markReadMutation.mutate(notification._id)}
              className={cn(
                'flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-colors',
                notification.isRead
                  ? 'border-mist/10 bg-transparent dark:border-white/10'
                  : 'border-signal/20 bg-signal-light dark:bg-signal/10'
              )}
            >
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                  notification.isRead ? 'bg-mist/10 text-mist' : 'bg-signal text-white'
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="mt-0.5 text-sm text-mist">{notification.message}</p>
                <p className="mt-1 text-xs text-mist/70">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
              {!notification.isRead && (
                <span
                  className="ml-auto h-2 w-2 shrink-0 rounded-full bg-signal"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
