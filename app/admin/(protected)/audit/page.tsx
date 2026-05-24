import Link from "next/link";
import AuditLogFiltersForm from "@/components/admin/AuditLogFiltersForm";
import AuditLogTable from "@/components/admin/AuditLogTable";
import {
  getAuditLogs,
  getDistinctAuditFilterValues,
  type AuditLogFilters,
} from "@/lib/audit-log";
import { requireAuditAccessSession } from "@/lib/auth/require-audit-access";

export const dynamic = "force-dynamic";

type AdminAuditPageProps = {
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

export default async function AdminAuditPage({ searchParams }: AdminAuditPageProps) {
  await requireAuditAccessSession();
  const params = searchParams ? await searchParams : {};
  const filters = parseFilters(params);

  const [logs, filterValues] = await Promise.all([
    getAuditLogs(filters),
    getDistinctAuditFilterValues(),
  ]);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Administration</p>
          <h1>Audit Logs</h1>
          <p className="admin-lead">
            Review who changed site content, media, and backend settings.
          </p>
        </div>
        <Link href="/admin/dashboard" className="admin-back-link">
          ← Back to dashboard
        </Link>
      </div>

      <div className="admin-panel admin-panel-spaced">
        <AuditLogFiltersForm
          filters={filters}
          actions={filterValues.actions}
          entityTypes={filterValues.entityTypes}
          roles={filterValues.roles}
        />
      </div>

      <div className="admin-panel admin-panel-spaced">
        <AuditLogTable logs={logs} />
      </div>
    </div>
  );
}
