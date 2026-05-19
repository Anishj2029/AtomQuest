import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { goalsApi } from "@/lib/api";
import { cn } from "@/lib/utils";

interface GoalForm {
  id: string;
  title: string;
  description: string;
  uomType: string;
  target: string;
  weightage: string;
}

const emptyGoal = (): GoalForm => ({
  id: crypto.randomUUID(),
  title: "", description: "", uomType: "", target: "", weightage: "",
});

const MAX_GOALS = 8;
const QUARTER   = "Q2 2026";

export default function CreateGoals() {
  const [goals, setGoals]   = useState<GoalForm[]>([emptyGoal()]);
  const [saving, setSaving] = useState(false);
  const [existingWeight, setExistingWeight] = useState(0);
  const [existingCount, setExistingCount] = useState(0);
  const [existingDrafts, setExistingDrafts] = useState<string[]>([]);
  const { toast }           = useToast();
  const navigate            = useNavigate();

  useEffect(() => {
    goalsApi.list(`quarter=${QUARTER}`).then(existing => {
      setExistingWeight(existing.reduce((sum, g) => sum + g.weightage, 0));
      setExistingCount(existing.length);
      setExistingDrafts(existing.filter(g => g.status === "draft").map(g => g._id));
    });
  }, []);

  const totalWeight = goals.reduce((s, g) => s + (Number(g.weightage) || 0), 0);
  const combinedWeight = existingWeight + totalWeight;
  const weightValid = combinedWeight <= 100;
  const isComplete = combinedWeight === 100;
  const totalCount = existingCount + goals.length;

  const addGoal = () => {
    if (totalCount >= MAX_GOALS) {
      toast({ title: "Maximum reached", description: `Up to ${MAX_GOALS} goals allowed per quarter`, variant: "error" });
      return;
    }
    setGoals([...goals, emptyGoal()]);
  };

  const removeGoal = (id: string) => {
    if (goals.length === 1) return;
    setGoals(goals.filter((g) => g.id !== id));
  };

  const update = (id: string, field: keyof GoalForm, value: string) =>
    setGoals(goals.map((g) => (g.id === id ? { ...g, [field]: value } : g)));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!weightValid) {
      toast({ title: "Invalid weightage", description: "Total weightage cannot exceed 100%", variant: "error" });
      return;
    }
    setSaving(true);
    try {
      const createdIds: string[] = [];
      // Create goals sequentially to avoid race conditions on backend validations
      for (const g of goals) {
        const created = await goalsApi.create({
          title: g.title,
          description: g.description,
          uomType: g.uomType,
          target: Number(g.target),
          weightage: Number(g.weightage),
          quarter: QUARTER,
        });
        createdIds.push(created._id);
      }

      // If we reached exactly 100%, we can submit all drafts for approval
      if (isComplete) {
        const allDrafts = [...existingDrafts, ...createdIds];
        for (const id of allDrafts) {
          await goalsApi.submit(id);
        }
        toast({ title: "Goals submitted", description: "Your goal sheet has been sent for approval", variant: "success" });
      } else {
        toast({ title: "Drafts saved", description: `You have ${100 - combinedWeight}% weightage left to allocate`, variant: "success" });
      }
      navigate("/employee/goals");
    } catch (e: unknown) {
      toast({ title: "Submission failed", description: (e as Error).message, variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader title="Create Goal Sheet" description={`Define up to ${MAX_GOALS} goals for ${QUARTER}`} />
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-zinc-700">Weightage allocation</span>
            <span className={cn("text-sm font-semibold", weightValid ? (isComplete ? "text-emerald-600" : "text-indigo-600") : "text-amber-600")}>
              {combinedWeight}% / 100%
            </span>
          </div>
          <Progress value={Math.min(combinedWeight, 100)} className={cn(combinedWeight > 100 && "[&>div]:bg-amber-500")} />
          {existingWeight > 0 && (
            <p className="mt-2 text-xs text-zinc-500">Includes {existingWeight}% from {existingCount} existing goals.</p>
          )}
          {!weightValid && (
            <p className="mt-2 flex items-center gap-1 text-xs text-amber-600">
              <AlertCircle className="h-3.5 w-3.5" /> Total weightage cannot exceed 100%
            </p>
          )}
          <p className="mt-2 text-xs text-zinc-400">{totalCount} of {MAX_GOALS} goals</p>
        </CardContent>
      </Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <AnimatePresence>
          {goals.map((goal, index) => (
            <motion.div key={goal.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-zinc-900">Goal {index + 1}</h3>
                    {goals.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeGoal(goal.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Goal title *</Label>
                      <Input value={goal.title} onChange={(e) => update(goal.id, "title", e.target.value)} required placeholder="e.g. Increase NPS score" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Description</Label>
                      <Textarea value={goal.description} onChange={(e) => update(goal.id, "description", e.target.value)} placeholder="Describe the goal and success criteria" />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit of Measure *</Label>
                      <Input value={goal.uomType} onChange={(e) => update(goal.id, "uomType", e.target.value)} required placeholder="%, Points, Days" />
                    </div>
                    <div className="space-y-2">
                      <Label>Target *</Label>
                      <Input type="number" value={goal.target} onChange={(e) => update(goal.id, "target", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Weightage (%) *</Label>
                      <Input type="number" min={10} max={100} value={goal.weightage} onChange={(e) => update(goal.id, "weightage", e.target.value)} required />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="outline" onClick={addGoal} disabled={goals.length >= MAX_GOALS}>
            <Plus className="h-4 w-4" /> Add goal
          </Button>
          <Button type="submit" disabled={!weightValid || saving || totalWeight === 0}>
            {saving ? "Saving..." : isComplete ? "Submit for approval" : "Save as drafts"}
          </Button>
        </div>
      </form>
    </>
  );
}
