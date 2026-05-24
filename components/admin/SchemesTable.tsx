import Link from "next/link";
import type { EditableScheme } from "@/lib/schemes-data";

type SchemesTableProps = {
  schemes: EditableScheme[];
};

export default function SchemesTable({ schemes }: SchemesTableProps) {
  if (schemes.length === 0) {
    return (
      <div className="admin-placeholder">
        <p>No housing schemes yet. Add the first scheme.</p>
      </div>
    );
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Name</th>
            <th>Status label</th>
            <th>Meta</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {schemes.map((scheme) => (
            <tr key={scheme.id}>
              <td>{scheme.displayOrder}</td>
              <td>{scheme.name}</td>
              <td>{scheme.statusLabel}</td>
              <td>{scheme.meta}</td>
              <td>
                <span
                  className={
                    scheme.active ? "admin-status-pill active" : "admin-status-pill"
                  }
                >
                  {scheme.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="admin-table-actions">
                <Link href={`/admin/schemes/${scheme.id}/edit`} className="admin-link-btn">
                  Edit
                </Link>
                <form
                  method="post"
                  action={`/api/admin/schemes/${scheme.id}/toggle-active`}
                >
                  <input
                    type="hidden"
                    name="active"
                    value={scheme.active ? "false" : "true"}
                  />
                  <button type="submit" className="admin-link-btn">
                    {scheme.active ? "Deactivate" : "Activate"}
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
