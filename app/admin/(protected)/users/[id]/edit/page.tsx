import Link from "next/link";
import { notFound } from "next/navigation";
import AdminUserForm from "@/components/admin/AdminUserForm";
import { getAdminUserById } from "@/lib/admin-users-data";
import { requireAdminRoleSession } from "@/lib/auth/require-admin-role";

export const dynamic = "force-dynamic";

type AdminEditUserPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
};

export default async function AdminEditUserPage({
  params,
  searchParams,
}: AdminEditUserPageProps) {
  await requireAdminRoleSession();
  const { id } = await params;
  const query = searchParams ? await searchParams : {};
  const user = await getAdminUserById(id);

  if (!user) {
    notFound();
  }

  const showValidationError = query.error === "validation";
  const showLastAdminError = query.error === "last-admin";

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">User Management</p>
          <h1>Edit User</h1>
          <p className="admin-lead">Update {user.name}&apos;s account details.</p>
        </div>
        <Link href="/admin/users" className="admin-back-link">
          ← Back to users
        </Link>
      </div>

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
        <AdminUserForm
          user={user}
          action={`/api/admin/users/${user.id}`}
          submitLabel="Save User"
        />
      </div>
    </div>
  );
}
