import { Building2, Target, Users, FileCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { KpiCard } from "@/components/shared/KpiCard";
import { OrgBarChart, HeatmapGrid } from "@/components/charts/GoalCharts";
import { teamMembers } from "@/lib/mock-data";

export default function AdminDashboard() {
  return (
    <>
      <PageHeader title="Organization Dashboard" description="Enterprise-wide goal performance — Q2 2026" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Total Employees" value={248} icon={Users} index={0} />
        <KpiCard title="Active Cycles" value={1} icon={Target} index={1} />
        <KpiCard title="Org Completion" value="76%" icon={FileCheck} trend={{ value: "+12% YoY", positive: true }} index={2} />
        <KpiCard title="Departments" value={12} icon={Building2} index={3} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <OrgBarChart />
        <HeatmapGrid data={teamMembers} />
      </div>
    </>
  );
}
