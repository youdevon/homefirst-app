import PrintReportButton from "@/components/admin/PrintReportButton";
import {
  formatAuditDateTime,
  getAuditLogs,
  type AuditLogFilters,
} from "@/lib/audit-log";
import { requireAuditAccessSession } from "@/lib/auth/require-audit-access";

export const dynamic = "force-dynamic";

type AdminAuditPrintPageProps = {
  searchParams?: Promise<Record<string, string | undefined>>;
};

function parseFilters(params: Record<string, string | undefined>): AuditLogFilters {
  return {
    from: params.from,
    to: params.to,
    actor: params.actor,
    role: params.role,
    action: params.action,
    entityType: params.entityType,
    search: params.search,
  };
}

export default async function AdminAuditPrintPage({
  searchParams,
}: AdminAuditPrintPageProps) {
  await requireAuditAccessSession();
  const params = searchParams ? await searchParams : {};
  const filters = parseFilters(params);
  const logs = await getAuditLogs(filters);

  return (
    <div className="admin-print-page">
      <div className="admin-print-toolbar no-print">
        <PrintReportButton />
      </div>

      <header className="admin-print-header">
        <h1>HomeFirst Audit Report</h1>
        <p>Generated {formatAuditDateTime(new Date())}</p>
        {filters.from || filters.to ? (
          <p>
            Date range: {filters.from || "Start"} to {filters.to || "Present"}
          </p>
        ) : null}
      </header>

      <table className="admin-print-table">
        <thead>
          <tr>
            <th>Date / Time</th>
            <th>Actor</th>
            <th>Role</th>
            <th>Action</th>
            <th>Entity</th>
            <th>Description</th>
            <th>IP Address</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{formatAuditDateTime(log.createdAt)}</td>
              <td>{log.actorName}</td>
              <td>{log.actorRole}</td>
              <td>{log.action}</td>
              <td>{log.entityType}</td>
              <td>{log.description}</td>
              <td>{log.ipAddress}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
