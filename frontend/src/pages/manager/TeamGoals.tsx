import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { SearchBar } from "@/components/shared/SearchBar";
import { StatusBadge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { goalsApi, type ApiGoal } from "@/lib/api";

export default function TeamGoals() {
  const [goals, setGoals]     = useState<ApiGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  useEffect(() => {
    goalsApi.list("quarter=Q2 2026")
      .then(setGoals)
      .finally(() => setLoading(false));
  }, []);

  const filtered = goals.filter((g) => {
    const emp = typeof g.employeeId === "object" ? (g.employeeId as { name: string }).name : "";
    return (
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      emp.toLowerCase().includes(search.toLowerCase())
    );
  });

  const columns = [
    {
      key: "employee", header: "Employee",
      cell: (g: ApiGoal) => typeof g.employeeId === "object" ? (g.employeeId as { name: string }).name : "—",
    },
    { key: "title",  header: "Goal",   cell: (g: ApiGoal) => <span className="font-medium">{g.title}</span> },
    { key: "target", header: "Target", cell: (g: ApiGoal) => `${g.actual} / ${g.target} ${g.uomType}` },
    { key: "weight", header: "Weight", cell: (g: ApiGoal) => `${g.weightage}%` },
    { key: "status", header: "Status", cell: (g: ApiGoal) => <StatusBadge status={g.status as never} /> },
  ];

  if (loading) return <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>;

  return (
    <>
      <PageHeader title="Team Goals" description="Monitor direct reports' goal progress" />
      <SearchBar value={search} onChange={setSearch} className="mb-6 max-w-sm" />
      <DataTable columns={columns} data={filtered.map(g => ({ ...g, id: g._id }))} />
    </>
  );
}
