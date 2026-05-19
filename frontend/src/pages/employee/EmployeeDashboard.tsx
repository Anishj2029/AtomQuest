import { useEffect, useState } from "react";
import { Target, TrendingUp, Calendar, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { KpiCard } from "@/components/shared/KpiCard";
import { ProgressChart, QuarterlyTimelineChart } from "@/components/charts/GoalCharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { analyticsApi, notificationsApi, type EmployeeAnalytics, type ApiNotification } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default function EmployeeDashboard() {
  const [analytics, setAnalytics] = useState<EmployeeAnalytics | null>(null);
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsApi.employee("Q2 2026"),
      notificationsApi.list(),
    ]).then(([a, n]) => {
      setAnalytics(a);
      setNotifications(n.slice(0, 4));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
      </div>
    </div>
  );

  const onTrack = analytics?.goals.filter(g => g.status === "on_track" || g.status === "approved").length ?? 0;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Your Q2 2026 goal progress at a glance"
        actions={<Button asChild><Link to="/employee/goals/create">Create goals</Link></Button>}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Active Goals"  value={analytics?.total ?? 0}              icon={Target}       index={0} />
        <KpiCard title="Completion"    value={`${analytics?.completionPct ?? 0}%`} icon={TrendingUp}   trend={{ value: "+8% vs last quarter", positive: true }} index={1} />
        <KpiCard title="Next Check-in" value="May 22" subtitle="Quarterly review"  icon={Calendar}     index={2} />
        <KpiCard title="On Track"      value={`${onTrack}/${analytics?.total ?? 0}`} icon={CheckCircle2} index={3} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ProgressChart />
        <QuarterlyTimelineChart />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Recent Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {notifications.length === 0 && <p className="text-sm text-zinc-400">No recent activity</p>}
            {notifications.map((n) => (
              <div key={n._id} className="flex gap-3 rounded-xl border border-zinc-100 p-3 hover:bg-zinc-50/50">
                <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${n.isRead ? "bg-zinc-300" : "bg-indigo-500"}`} />
                <div>
                  <p className="text-sm font-medium text-zinc-800">{n.title}</p>
                  <p className="text-xs text-zinc-500">{n.message}</p>
                  <p className="text-xs text-zinc-400">{formatDate(n.createdAt)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Upcoming Check-ins</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {(analytics?.goals ?? []).slice(0, 3).map((g) => (
              <div key={g._id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium truncate pr-2">{g.title}</span>
                  <StatusBadge status={g.status as never} />
                </div>
                <Progress value={g.target > 0 ? (g.actual / g.target) * 100 : 0} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
