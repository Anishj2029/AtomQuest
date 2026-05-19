import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { goalsApi, type ApiGoal } from "@/lib/api";

export default function GoalHistory() {
  const [goals, setGoals]     = useState<ApiGoal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all goals (no quarter filter = full history)
    goalsApi.list()
      .then(setGoals)
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "quarter", header: "Quarter", cell: (g: ApiGoal) => g.quarter },
    { key: "title",   header: "Goal",    cell: (g: ApiGoal) => g.title },
    { key: "weight",  header: "Weight",  cell: (g: ApiGoal) => `${g.weightage}%` },
    { key: "status",  header: "Status",  cell: (g: ApiGoal) => <StatusBadge status={g.status as never} /> },
  ];

  if (loading) return <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>;

  return (
    <>
      <PageHeader title="Goal History" description="Past quarters and archived goal sheets" />
      <DataTable columns={columns} data={goals.map(g => ({ ...g, id: g._id }))} emptyMessage="No goal history found" />
    </>
  );
}
