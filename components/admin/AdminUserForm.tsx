import { ADMIN_USER_ROLES } from "@/lib/auth/roles";
import type { EditableAdminUser } from "@/lib/admin-users-data";

type AdminUserFormProps = {
  user?: EditableAdminUser;
  action: string;
  submitLabel: string;
};

export default function AdminUserForm({
  user,
  action,
  submitLabel,
}: AdminUserFormProps) {
  const isEdit = Boolean(user);

  return (
    <form method="post" action={action} className="admin-settings-form">
      <div className="admin-form-grid">
        <label className="admin-field">
          <span>Full name</span>
          <input
            type="text"
            name="name"
            defaultValue={user?.name ?? ""}
            required
            placeholder="Hadassah Taylor-Smith"
          />
        </label>

        <label className="admin-field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            defaultValue={user?.email ?? ""}
            required
            placeholder="user@homefirst.local"
          />
        </label>

        <label className="admin-field">
          <span>Role</span>
          <select name="role" defaultValue={user?.role ?? "CONTRIBUTOR"}>
            {ADMIN_USER_ROLES.map((role) => (
              <option key={role} value={role}>
                {role === "ADMIN" ? "Admin" : "Contributor"}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-field">
          <span>Status</span>
          <select
            name="active"
            defaultValue={user?.active === false ? "false" : "true"}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </label>

        <label className="admin-field admin-field-full">
          <span>{isEdit ? "New password" : "Password"}</span>
          <input
            type="password"
            name="password"
            minLength={8}
            required={!isEdit}
            placeholder={isEdit ? "Leave blank to keep current password" : "Minimum 8 characters"}
          />
          {isEdit ? (
            <span className="admin-form-help">
              Leave blank to keep the current password. Enter a new password to reset it.
            </span>
          ) : null}
        </label>
      </div>

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn admin-btn-primary admin-btn-dark">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
