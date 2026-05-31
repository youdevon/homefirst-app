import Link from "next/link";
import { formatAuditDateTime, type AuditLogRecord } from "@/lib/audit-log";

type AuditLogTableProps = {
  logs: AuditLogRecord[];
};

export default function AuditLogTable({ logs }: AuditLogTableProps) {
  if (logs.length === 0) {
    return (
      <div className="admin-placeholder">
        <p>No audit log entries match the current filters.</p>
      </div>
    );
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table admin-table-compact admin-audit-table">
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
              <td>
                <Link href={`/admin/audit/${log.id}`} className="admin-audit-row-link">
                  {formatAuditDateTime(log.createdAt)}
                </Link>
              </td>
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
