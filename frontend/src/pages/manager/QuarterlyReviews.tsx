import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { teamMembers, teamGoals } from "@/lib/mock-data";

export default function QuarterlyReviews() {
  return (
    <>
      <PageHeader title="Quarterly Reviews" description="Planned vs actual performance reviews" />
      <div className="grid gap-4 md:grid-cols-2">
        {teamMembers.map((m) => {
          const goals = teamGoals.filter((g) => g.employeeName === m.name || m.name === "Sarah Chen");
          return (
            <Card key={m.id}>
              <CardHeader>
                <CardTitle className="text-base">{m.name}</CardTitle>
                <p className="text-sm text-zinc-500">{m.department}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Overall progress</span>
                    <span className="font-medium">{m.progress}%</span>
                  </div>
                  <Progress value={m.progress} />
                </div>
                {goals.slice(0, 2).map((g) => (
                  <div key={g.id} className="rounded-lg bg-zinc-50 p-3 text-sm">
                    <p className="font-medium">{g.title}</p>
                    <p className="text-zinc-500">Planned: {g.target} · Actual: {g.actual ?? 0}</p>
                  </div>
                ))}
                <Textarea placeholder="Review comments..." rows={2} />
                <Button size="sm" variant="outline">Save review</Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
