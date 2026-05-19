import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { notificationsApi, type ApiNotification } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default function Notifications() {
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationsApi.list()
      .then(setNotifications)
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id: string) => {
    await notificationsApi.markRead(id);
    setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  const markAll = async () => {
    await notificationsApi.markAllRead();
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  if (loading) return <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}</div>;

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Stay updated on goals, approvals, and cycles"
        actions={
          notifications.some(n => !n.isRead)
            ? <Button variant="outline" size="sm" onClick={markAll}>Mark all as read</Button>
            : undefined
        }
      />
      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="All caught up" description="You have no new notifications" />
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => (
            <li
              key={n._id}
              className={`glass-panel rounded-2xl p-4 ${!n.isRead ? "ring-2 ring-indigo-500/20" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-zinc-900">{n.title}</p>
                  <p className="text-sm text-zinc-600">{n.message}</p>
                  <p className="mt-1 text-xs text-zinc-400">{formatDate(n.createdAt)}</p>
                </div>
                {!n.isRead && (
                  <Button variant="ghost" size="sm" onClick={() => markRead(n._id)}>
                    Mark read
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
