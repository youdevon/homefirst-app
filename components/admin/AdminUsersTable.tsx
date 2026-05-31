import Link from "next/link";
import { formatAdminRole } from "@/lib/auth/roles";
import {
  formatAdminUserDate,
  type EditableAdminUser,
} from "@/lib/admin-users-data";

type AdminUsersTableProps = {
  users: EditableAdminUser[];
};

export default function AdminUsersTable({ users }: AdminUsersTableProps) {
  if (users.length === 0) {
    return (
      <div className="admin-placeholder">
        <p>No backend users yet. Create the first admin or contributor account.</p>
      </div>
    );
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table admin-table-compact">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{formatAdminRole(user.role)}</td>
              <td>
                <span
                  className={
                    user.active ? "admin-status-pill active" : "admin-status-pill"
                  }
                >
                  {user.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td>{formatAdminUserDate(user.createdAt)}</td>
              <td className="admin-table-actions">
                <Link href={`/admin/users/${user.id}/edit`} className="admin-link-btn">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
