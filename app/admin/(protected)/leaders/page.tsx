import Link from "next/link";
import LeadersTable from "@/components/admin/LeadersTable";
import { getAllLeadersForAdmin } from "@/lib/leaders-data";

export const dynamic = "force-dynamic";

type AdminLeadersPageProps = {
  searchParams?: Promise<{ saved?: string; error?: string }>;
};

export default async function AdminLeadersPage({
  searchParams,
}: AdminLeadersPageProps) {
  const params = searchParams ? await searchParams : {};
  const leaders = await getAllLeadersForAdmin();

  const showSuccess = params.saved === "1";
  const showSessionError = params.error === "session";
  const showValidationError = params.error === "validation";

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">About Page</p>
          <h1>Leaders</h1>
          <p className="admin-lead">
            Manage leadership profiles shown on the public About page.
          </p>
        </div>
        <div className="admin-header-actions-inline">
          <Link href="/admin/dashboard" className="admin-back-link">
            ← Back to dashboard
          </Link>
          <Link href="/admin/leaders/new" className="admin-btn admin-btn-primary admin-btn-dark">
            Add Leader
          </Link>
        </div>
      </div>

      {showSuccess ? (
        <div className="admin-alert admin-alert-success" role="status">
          Leaders updated successfully.
        </div>
      ) : null}

      {showSessionError ? (
        <div className="admin-alert admin-alert-error" role="alert">
          Your session has expired. Please sign in again.
        </div>
      ) : null}

      {showValidationError ? (
        <div className="admin-alert admin-alert-error" role="alert">
          Please complete all required fields correctly.
        </div>
      ) : null}

      <div className="admin-panel">
        <LeadersTable leaders={leaders} />
      </div>
    </div>
  );
}
