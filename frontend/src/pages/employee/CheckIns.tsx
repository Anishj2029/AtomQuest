import { useEffect, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/shared/DataTable";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { goalsApi, checkInsApi, type ApiGoal } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Row {
  id: string;
  goalId: string;
  goalTitle: string;
  planned: number;
  actual: number;
  status: string;
}

const QUARTER = "Q2 2026";

export default function CheckIns() {
  const [rows, setRows]       = useState<Row[]>([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const { toast }             = useToast();

  useEffect(() => {
    goalsApi.list("quarter=Q2 2026").then((goals) => {
      setRows(
        goals.map((g: ApiGoal) => ({
          id:         g._id,
          goalId:     g._id,
          goalTitle:  g.title,
          planned:    g.target,
          actual:     g.actual,
          status:     g.status === "on_track" ? "on_track" : "not_started",
        }))
      );
    }).finally(() => setLoading(false));
  }, []);

  const updateRow = (id: string, patch: Partial<Row>) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await Promise.all(
        rows.map((r) =>
          checkInsApi.create({
            goalId:       r.goalId,
            plannedValue: r.planned,
            actualValue:  r.actual,
            status:       r.status,
            comment,
            quarter:      QUARTER,
          })
        )
      );
      toast({ title: "Check-in saved", description: "All check-ins submitted successfully", variant: "success" });
    } catch (e: unknown) {
      toast({ title: "Save failed", description: (e as Error).message, variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: "goal",    header: "Goal",    cell: (r: Row) => <span className="font-medium">{r.goalTitle}</span> },
    { key: "planned", header: "Planned", cell: (r: Row) => r.planned },
    {
      key: "actual", header: "Actual",
      cell: (r: Row) => (
        <Slider.Root
          className="relative flex w-32 touch-none select-none items-center"
          value={[r.actual]}
          max={r.planned || 100}
          step={1}
          onValueChange={([v]) => updateRow(r.id, { actual: v })}
        >
          <Slider.Track className="relative h-1.5 grow rounded-full bg-zinc-200">
            <Slider.Range className="absolute h-full rounded-full bg-indigo-600" />
          </Slider.Track>
          <Slider.Thumb className="block h-4 w-4 rounded-full border-2 border-indigo-600 bg-white shadow" />
        </Slider.Root>
      ),
    },
    {
      key: "status", header: "Status",
      cell: (r: Row) => (
        <Select
          value={r.status}
          onValueChange={(v) => updateRow(r.id, { status: v })}
          options={[
            { value: "not_started", label: "Not Started" },
            { value: "on_track",    label: "On Track" },
            { value: "completed",   label: "Completed" },
            { value: "at_risk",     label: "At Risk" },
          ]}
        />
      ),
    },
  ];

  if (loading) return <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>;

  return (
    <>
      <PageHeader title="Quarterly Check-ins" description={`${QUARTER} — update planned vs actual progress`} />
      <div className="mb-8 flex gap-4 overflow-x-auto pb-2">
        {["Week 1", "Week 4", "Week 8", "Week 12"].map((w, i) => (
          <div key={w} className={cn("flex shrink-0 flex-col items-center", i <= 2 && "opacity-100")}>
            <div className={cn("h-3 w-3 rounded-full", i <= 2 ? "bg-indigo-600" : "bg-zinc-200")} />
            <span className="mt-2 text-xs font-medium text-zinc-600">{w}</span>
          </div>
        ))}
      </div>
      <DataTable columns={columns} data={rows} />
      <Card className="mt-6">
        <CardHeader><CardTitle>Overall comments</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Share highlights, blockers, and support needed..."
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Submit check-in"}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
