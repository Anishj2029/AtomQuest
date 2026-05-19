import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { goalsApi, type ApiGoal } from "@/lib/api";
import { Lock, Unlock } from "lucide-react";

export default function ApprovalQueue() {
  const [goals, setGoals]     = useState<ApiGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [confirm, setConfirm] = useState<{ open: boolean; action: "approve" | "reject"; id: string }>({
    open: false, action: "approve", id: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    goalsApi.list("status=pending_approval&quarter=Q2 2026")
      .then(setGoals)
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    try {
      const fb = feedback[id] ?? "";
      const updated = action === "approve"
        ? await goalsApi.approve(id, fb)
        : await goalsApi.reject(id, fb);
      setGoals(goals.map(g => g._id === id ? updated : g));
      toast({ title: action === "approve" ? "Goal approved" : "Goal rejected", variant: action === "approve" ? "success" : "error" });
    } catch (e: unknown) {
      toast({ title: "Action failed", description: (e as Error).message, variant: "error" });
    }
  };

  const toggleLock = async (goal: ApiGoal) => {
    try {
      const updated = goal.isLocked
        ? await goalsApi.unlock(goal._id)
        : await goalsApi.update(goal._id, { isLocked: true });
      setGoals(goals.map(g => g._id === goal._id ? updated : g));
    } catch (e: unknown) {
      toast({ title: "Lock failed", description: (e as Error).message, variant: "error" });
    }
  };

  if (loading) return <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}</div>;

  return (
    <>
      <PageHeader title="Approval Queue" description="Review and approve employee goal submissions" />
      {goals.length === 0 && <p className="text-sm text-zinc-400 mt-4">No pending approvals</p>}
      <div className="space-y-4">
        {goals.map((goal) => {
          const empName = typeof goal.employeeId === "object" ? (goal.employeeId as { name: string }).name : "—";
          return (
            <Card key={goal._id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">{empName}</CardTitle>
                  <p className="text-sm text-zinc-500">Submitted {new Date(goal.updatedAt).toLocaleDateString()}</p>
                </div>
                <StatusBadge status={goal.status as never} />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-zinc-500">Goal title</label>
                    <Input value={goal.title} readOnly className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500">Weightage</label>
                    <Input value={`${goal.weightage}%`} readOnly className="mt-1" />
                  </div>
                </div>
                <Textarea
                  placeholder="Manager feedback / rejection reason..."
                  value={feedback[goal._id] ?? ""}
                  onChange={(e) => setFeedback({ ...feedback, [goal._id]: e.target.value })}
                />
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => setConfirm({ open: true, action: "approve", id: goal._id })}>Approve</Button>
                  <Button variant="outline" onClick={() => setConfirm({ open: true, action: "reject", id: goal._id })}>Reject</Button>
                  <Button variant="ghost" onClick={() => toggleLock(goal)}>
                    {goal.isLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                    {goal.isLocked ? "Unlock" : "Lock"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <ConfirmDialog
        open={confirm.open}
        onOpenChange={(o) => setConfirm({ ...confirm, open: o })}
        title={confirm.action === "approve" ? "Approve goal?" : "Reject goal?"}
        description="This action will notify the employee."
        confirmLabel={confirm.action === "approve" ? "Approve" : "Reject"}
        variant={confirm.action === "reject" ? "destructive" : "default"}
        onConfirm={() => handleAction(confirm.id, confirm.action)}
      />
    </>
  );
}
