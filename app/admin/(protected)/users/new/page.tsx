import AdminPageHeader from "@/components/admin/AdminPageHeader";
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
      <AdminPageHeader
        eyebrow="Administration"
        title="Add User"
        lead="Create a new admin or contributor account."
        backHref="/admin/users"
        backLabel="← Back to users"
      />

      {showValidationError ? (
        <div className="admin-alert admin-alert-error" role="alert">
          Please complete all required fields correctly. Passwords must be at least 8 characters.
        </div>
      ) : null}

      <div className="admin-form-stack">
        <AdminUserForm action="/api/admin/users" submitLabel="Create User" />
      </div>
    </div>
  );
}
