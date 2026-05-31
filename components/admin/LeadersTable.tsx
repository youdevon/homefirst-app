import Link from "next/link";
import type { EditableLeader } from "@/lib/leaders-data";
import { LEADER_PERSON_TYPE_LABELS } from "@/lib/leader-person-type";

type LeadersTableProps = {
  leaders: EditableLeader[];
  emptyMessage?: string;
};

export default function LeadersTable({
  leaders,
  emptyMessage = "No people yet. Add the first leadership or board profile.",
}: LeadersTableProps) {
  if (leaders.length === 0) {
    return (
      <div className="admin-placeholder">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table admin-table-compact">
        <thead>
          <tr>
            <th>Display order</th>
            <th>Name</th>
            <th>Position</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((leader) => (
            <tr key={leader.id}>
              <td>{leader.displayOrder}</td>
              <td>{leader.name}</td>
              <td>{leader.title}</td>
              <td>{LEADER_PERSON_TYPE_LABELS[leader.personType]}</td>
              <td>
                <span
                  className={
                    leader.active ? "admin-status-pill active" : "admin-status-pill"
                  }
                >
                  {leader.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="admin-table-actions">
                <Link href={`/admin/leaders/${leader.id}/edit`} className="admin-link-btn">
                  Edit
                </Link>
                <form
                  method="post"
                  action={`/api/admin/leaders/${leader.id}/toggle-active`}
                >
                  <input
                    type="hidden"
                    name="active"
                    value={leader.active ? "false" : "true"}
                  />
                  <button type="submit" className="admin-link-btn">
                    {leader.active ? "Deactivate" : "Activate"}
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
