import Link from "next/link";
import AdminUsersTable from "@/components/admin/AdminUsersTable";
import { getAllAdminUsersForAdmin } from "@/lib/admin-users-data";
import { requireAdminRoleSession } from "@/lib/auth/require-admin-role";

export const dynamic = "force-dynamic";

type AdminUsersPageProps = {
  searchParams?: Promise<{ saved?: string; error?: string }>;
};

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  await requireAdminRoleSession();
  const params = searchParams ? await searchParams : {};
  const users = await getAllAdminUsersForAdmin();

  const showSuccess = params.saved === "1";
  const showSessionError = params.error === "session";
  const showValidationError = params.error === "validation";
  const showLastAdminError = params.error === "last-admin";

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Administration</p>
          <h1>User Management</h1>
          <p className="admin-lead">
            Create and manage backend admin and contributor accounts.
          </p>
        </div>
        <div className="admin-header-actions-inline">
          <Link href="/admin/dashboard" className="admin-back-link">
            ← Back to dashboard
          </Link>
          <Link href="/admin/users/new" className="admin-btn admin-btn-primary admin-btn-dark">
            Add User
          </Link>
        </div>
      </div>

      {showSuccess ? (
        <div className="admin-alert admin-alert-success" role="status">
          User account saved successfully.
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

      {showLastAdminError ? (
        <div className="admin-alert admin-alert-error" role="alert">
          At least one active admin account must remain in the system.
        </div>
      ) : null}

      <div className="admin-panel">
        <AdminUsersTable users={users} />
      </div>
    </div>
  );
}
