import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Download, FileSpreadsheet } from "lucide-react";

const reports = [
  { id: "r1", name: "Organization Completion Summary", format: "CSV / Excel" },
  { id: "r2", name: "Department Performance", format: "CSV / Excel" },
  { id: "r3", name: "Goal Cycle Audit", format: "PDF" },
  { id: "r4", name: "Manager Approval Metrics", format: "CSV" },
];

export default function Reports() {
  const { toast } = useToast();
  const exportReport = (name: string, type: string) => {
    toast({ title: "Export started", description: `${name} (${type}) will download shortly`, variant: "success" });
  };

  return (
    <>
      <PageHeader title="Reports" description="Export organization-wide goal and performance data" />
      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((r) => (
          <Card key={r.id}>
            <CardHeader>
              <CardTitle className="text-base">{r.name}</CardTitle>
              <CardDescription>Available formats: {r.format}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => exportReport(r.name, "CSV")}>
                <Download className="h-4 w-4" /> CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportReport(r.name, "Excel")}>
                <FileSpreadsheet className="h-4 w-4" /> Excel
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
