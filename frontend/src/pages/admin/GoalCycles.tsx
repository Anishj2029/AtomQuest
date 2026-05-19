import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { cyclesApi, type ApiCycle } from "@/lib/api";
import { Unlock, Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function GoalCycles() {
  const [cycles, setCycles] = useState<ApiCycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("upcoming");
  const { toast } = useToast();

  const fetchCycles = () => {
    setLoading(true);
    cyclesApi.list().then(setCycles).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCycles();
  }, []);

  const handleCreate = async () => {
    setSaving(true);
    try {
      await cyclesApi.create({ name, startDate, endDate, status });
      toast({ title: "Cycle created", variant: "success" });
      setCreateOpen(false);
      setName("");
      setStartDate("");
      setEndDate("");
      setStatus("upcoming");
      fetchCycles();
    } catch (e: unknown) {
      toast({ title: "Failed to create", description: (e as Error).message, variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: "name", header: "Cycle", cell: (c: ApiCycle) => <span className="font-medium">{c.name}</span> },
    { key: "dates", header: "Period", cell: (c: ApiCycle) => `${formatDate(c.startDate)} – ${formatDate(c.endDate)}` },
    { key: "participants", header: "Participants", cell: (c: ApiCycle) => c.participants },
    {
      key: "status",
      header: "Status",
      cell: (c: ApiCycle) => (
        <Badge variant={c.status === "active" ? "success" : c.status === "upcoming" ? "default" : "neutral"}>
          {c.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (c: ApiCycle) =>
        c.status === "active" ? (
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Not implemented", description: "Bulk unlock requires backend endpoint.", variant: "neutral" })}>
            <Unlock className="h-4 w-4" /> Unlock goals
          </Button>
        ) : null,
    },
  ];

  return (
    <>
      <PageHeader 
        title="Goal Cycles" 
        description="Create and manage quarterly goal cycles" 
        actions={<Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> Create cycle</Button>} 
      />
      <DataTable columns={columns} data={cycles.map(c => ({ ...c, id: c._id }))} loading={loading} />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Goal Cycle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Cycle Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Q3 2026" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={setStatus}
                options={[
                  { value: "upcoming", label: "Upcoming" },
                  { value: "active", label: "Active" },
                  { value: "closed", label: "Closed" },
                ]}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving || !name || !startDate || !endDate}>
              {saving ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
