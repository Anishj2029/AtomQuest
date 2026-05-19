import { useEffect, useState } from "react";
import { Users, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { KpiCard } from "@/components/shared/KpiCard";
import { TeamBarChart, HeatmapGrid } from "@/components/charts/GoalCharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { analyticsApi, goalsApi, type TeamAnalytics, type ApiGoal } from "@/lib/api";

export default function ManagerDashboard() {
  const [analytics, setAnalytics] = useState<TeamAnalytics | null>(null);
  const [pending, setPending]     = useState<ApiGoal[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsApi.team("Q2 2026"),
      goalsApi.list("status=pending_approval&quarter=Q2 2026"),
    ]).then(([a, p]) => {
      setAnalytics(a);
      setPending(p.slice(0, 4));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
      </div>
    </div>
  );

  const atRisk = analytics?.memberStats.filter(m => m.progress < 40).length ?? 0;

  return (
    <>
      <PageHeader title="Manager Dashboard" description="Team performance overview — Q2 2026" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Team Members"      value={analytics?.teamSize ?? 0}          icon={Users}       index={0} />
        <KpiCard title="Pending Approvals" value={analytics?.pendingApprovals ?? 0}  icon={Clock}       index={1} />
        <KpiCard title="Avg. Completion"   value={`${analytics?.avgCompletion ?? 0}%`} icon={TrendingUp} trend={{ value: "+5% vs Q1", positive: true }} index={2} />
        <KpiCard title="At Risk"           value={atRisk}                             icon={AlertCircle} index={3} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <TeamBarChart />
        <HeatmapGrid data={(analytics?.memberStats ?? []).map(m => ({
          id: m.id, name: m.name, department: m.department,
          progress: m.progress, goalsCount: m.goalsCount, status: "on_track" as never,
        }))} />
      </div>
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Submissions</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link to="/manager/approvals">View queue</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {pending.length === 0 && <p className="text-sm text-zinc-400">No pending submissions</p>}
          {pending.map((g) => (
            <div key={g._id} className="flex items-center justify-between rounded-xl border border-zinc-100 p-3">
              <div>
                <p className="text-sm font-medium">{g.title}</p>
                <p className="text-xs text-zinc-500">
                  {typeof g.employeeId === "object" ? (g.employeeId as { name: string }).name : ""}
                </p>
              </div>
              <StatusBadge status={g.status as never} />
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
