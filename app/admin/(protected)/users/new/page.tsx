import Link from "next/link";
import AdminUserForm from "@/components/admin/AdminUserForm";
import { requireAdminRoleSession } from "@/lib/auth/require-admin-role";

export const dynamic = "force-dynamic";

type AdminNewUserPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function AdminNewUserPage({ searchParams }: AdminNewUserPageProps) {
  await requireAdminRoleSession();
  const params = searchParams ? await searchParams : {};
  const showValidationError = params.error === "validation";

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">User Management</p>
          <h1>Add User</h1>
          <p className="admin-lead">Create a new admin or contributor account.</p>
        </div>
        <Link href="/admin/users" className="admin-back-link">
          ← Back to users
        </Link>
      </div>

      {showValidationError ? (
        <div className="admin-alert admin-alert-error" role="alert">
          Please complete all required fields correctly. Passwords must be at least 8 characters.
        </div>
      ) : null}

      <div className="admin-panel">
        <AdminUserForm action="/api/admin/users" submitLabel="Create User" />
      </div>
    </div>
  );
}
