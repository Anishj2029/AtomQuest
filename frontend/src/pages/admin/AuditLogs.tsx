import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { auditApi, type ApiAuditLog } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default function AuditLogs() {
  const [logs, setLogs] = useState<ApiAuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auditApi.list().then(res => setLogs(res.logs)).finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "action", header: "Action", cell: (l: ApiAuditLog) => <span className="font-medium">{l.action}</span> },
    { key: "user", header: "User", cell: (l: ApiAuditLog) => typeof l.changedBy === "object" ? (l.changedBy as any).name : l.changedBy },
    { key: "target", header: "Target", cell: (l: ApiAuditLog) => `${l.targetType} (${l.targetId.slice(-6)})` },
    { key: "time", header: "Timestamp", cell: (l: ApiAuditLog) => formatDate(l.timestamp) },
    { key: "details", header: "Details", cell: (l: ApiAuditLog) => <span className="text-zinc-500">{l.details}</span> },
  ];

  return (
    <>
      <PageHeader title="Audit Logs" description="Complete trail of administrative actions" />
      <DataTable columns={columns} data={logs.map(l => ({ ...l, id: l._id }))} loading={loading} />
    </>
  );
}
