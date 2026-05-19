import { PageHeader } from "@/components/shared/PageHeader";
import { OrgBarChart, ProgressChart, HeatmapGrid } from "@/components/charts/GoalCharts";
import { teamMembers } from "@/lib/mock-data";

export default function OrgAnalytics() {
  return (
    <>
      <PageHeader title="Organization Analytics" description="Deep insights across departments and cycles" />
      <div className="grid gap-6 lg:grid-cols-2">
        <OrgBarChart />
        <ProgressChart />
      </div>
      <div className="mt-6">
        <HeatmapGrid data={teamMembers} />
      </div>
    </>
  );
}
