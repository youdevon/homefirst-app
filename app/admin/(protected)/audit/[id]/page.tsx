import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  formatAuditDateTime,
  formatMetadataForDisplay,
  getAuditLogById,
} from "@/lib/audit-log";
import { requireAuditAccessSession } from "@/lib/auth/require-audit-access";

export const dynamic = "force-dynamic";

type AdminAuditDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminAuditDetailPage({ params }: AdminAuditDetailPageProps) {
  await requireAuditAccessSession();
  const { id } = await params;
  const log = await getAuditLogById(id);

  if (!log) {
    notFound();
  }

  const metadataRows = formatMetadataForDisplay(log.metadata);

  return (
    <div className="admin-page">
      <AdminPageHeader
        eyebrow="Audit Logs"
        title="Audit Entry"
        lead={log.description}
        backHref="/admin/audit"
        backLabel="← Back to audit logs"
      />

      <div className="admin-panel">
        <dl className="admin-detail-list">
          <div>
            <dt>Date / Time</dt>
            <dd>{formatAuditDateTime(log.createdAt)}</dd>
          </div>
          <div>
            <dt>Description</dt>
            <dd>{log.description}</dd>
          </div>
          <div>
            <dt>Actor</dt>
            <dd>
              {log.actorName} ({log.actorEmail})
            </dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{log.actorRole}</dd>
          </div>
          <div>
            <dt>Action</dt>
            <dd>{log.action}</dd>
          </div>
          <div>
            <dt>Entity</dt>
            <dd>
              {log.entityType}: {log.entityName}
            </dd>
          </div>
          <div>
            <dt>IP Address</dt>
            <dd>{log.ipAddress}</dd>
          </div>
          <div>
            <dt>User Agent</dt>
            <dd>{log.userAgent || "Unknown"}</dd>
          </div>
        </dl>

        {metadataRows.length > 0 ? (
          <div className="admin-detail-metadata">
            <h2 className="admin-form-section-title">Additional Details</h2>
            <dl className="admin-detail-list">
              {metadataRows.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
      </div>
    </div>
  );
}
