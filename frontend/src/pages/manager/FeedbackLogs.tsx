import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";

const logs = [
  { id: "f1", employee: "Sarah Chen", manager: "James Mitchell", date: "2026-05-10", note: "Strong progress on design system. Continue mentoring focus." },
  { id: "f2", employee: "Alex Kim", manager: "James Mitchell", date: "2026-05-08", note: "Mobile beta timeline at risk — recommend scope review." },
  { id: "f3", employee: "Maria Santos", manager: "James Mitchell", date: "2026-05-05", note: "Exceeded churn reduction target. Consider stretch goals." },
];

export default function FeedbackLogs() {
  const columns = [
    { key: "employee", header: "Employee", cell: (r: typeof logs[0]) => r.employee },
    { key: "date", header: "Date", cell: (r: typeof logs[0]) => r.date },
    { key: "note", header: "Feedback", cell: (r: typeof logs[0]) => <span className="text-zinc-600">{r.note}</span> },
  ];
  return (
    <>
      <PageHeader title="Feedback Logs" description="Historical manager feedback and coaching notes" />
      <DataTable columns={columns} data={logs} />
    </>
  );
}
