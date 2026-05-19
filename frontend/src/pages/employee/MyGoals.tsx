import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/SearchBar";
import { FilterSelect } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { goalsApi, type ApiGoal } from "@/lib/api";

export default function MyGoals() {
  const [goals, setGoals]   = useState<ApiGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [submittingAll, setSubmittingAll] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    goalsApi.list("quarter=Q2 2026")
      .then(setGoals)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (id: string) => {
    try {
      const updated = await goalsApi.submit(id);
      setGoals(goals.map(g => g._id === id ? updated : g));
      toast({ title: "Goal submitted", description: "Sent for manager approval", variant: "success" });
    } catch (e: unknown) {
      toast({ title: "Submit failed", description: (e as Error).message, variant: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this draft goal?")) return;
    try {
      await goalsApi.delete(id);
      setGoals(goals.filter(g => g._id !== id));
      toast({ title: "Goal deleted", description: "Draft goal removed", variant: "success" });
    } catch (e: unknown) {
      toast({ title: "Delete failed", description: (e as Error).message, variant: "error" });
    }
  };

  const filtered = goals.filter((g) => {
    const matchSearch = g.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || g.status === filter;
    return matchSearch && matchFilter;
  });

  const columns = [
    { key: "title",    header: "Goal",     cell: (g: ApiGoal) => <span className="font-medium text-zinc-900">{g.title}</span> },
    { key: "uom",      header: "UoM",      cell: (g: ApiGoal) => g.uomType },
    { key: "target",   header: "Target",   cell: (g: ApiGoal) => g.target },
    { key: "actual",   header: "Actual",   cell: (g: ApiGoal) => g.actual ?? "—" },
    { key: "weight",   header: "Weight",   cell: (g: ApiGoal) => `${g.weightage}%` },
    { key: "progress", header: "Progress", cell: (g: ApiGoal) => <Progress value={(g.actual / g.target) * 100} className="w-24" /> },
    { key: "status",   header: "Status",   cell: (g: ApiGoal) => <StatusBadge status={g.status as never} /> },
    {
      key: "action", header: "",
      cell: (g: ApiGoal) => g.status === "draft"
        ? (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handleSubmit(g._id)}>Submit</Button>
            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(g._id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
        : null,
    },
  ];

  if (loading) return <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>;

  const totalWeight = goals.reduce((sum, g) => sum + g.weightage, 0);
  const draftGoals = goals.filter((g) => g.status === "draft");
  const canSubmitAll = totalWeight === 100 && draftGoals.length > 0;

  const handleSubmitAll = async () => {
    setSubmittingAll(true);
    try {
      const updatedGoals = [...goals];
      for (const draft of draftGoals) {
        const updated = await goalsApi.submit(draft._id);
        const idx = updatedGoals.findIndex(g => g._id === draft._id);
        if (idx !== -1) updatedGoals[idx] = updated;
      }
      setGoals(updatedGoals);
      toast({ title: "Goals submitted", description: "All draft goals sent for manager approval", variant: "success" });
    } catch (e: unknown) {
      toast({ title: "Submit failed", description: (e as Error).message, variant: "error" });
    } finally {
      setSubmittingAll(false);
    }
  };

  return (
    <>
      <PageHeader
        title="My Goals"
        description={`Q2 2026 goal sheet — ${goals.length} goals`}
        actions={
          <div className="flex gap-3">
            {canSubmitAll && (
              <Button onClick={handleSubmitAll} disabled={submittingAll}>
                {submittingAll ? "Submitting..." : "Submit All Drafts"}
              </Button>
            )}
            <Button asChild variant={canSubmitAll ? "outline" : "default"}>
              <Link to="/employee/goals/create"><Plus className="h-4 w-4" /> Create goals</Link>
            </Button>
          </div>
        }
      />
      <div className="mb-6 flex flex-wrap gap-3">
        <SearchBar value={search} onChange={setSearch} className="max-w-sm" />
        <FilterSelect
          value={filter}
          onValueChange={setFilter}
          options={[
            { value: "all",              label: "All statuses" },
            { value: "draft",            label: "Draft" },
            { value: "on_track",         label: "On Track" },
            { value: "pending_approval", label: "Pending Approval" },
            { value: "approved",         label: "Approved" },
            { value: "completed",        label: "Completed" },
          ]}
        />
      </div>
      <DataTable columns={columns} data={filtered.map(g => ({ ...g, id: g._id }))} emptyMessage="No goals match your filters" />
    </>
  );
}
