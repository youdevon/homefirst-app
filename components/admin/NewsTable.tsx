import Link from "next/link";
import type { EditableNewsItem } from "@/lib/news-data";
import { formatPublicDate } from "@/lib/news-data";

type NewsTableProps = {
  items: EditableNewsItem[];
};

function formatAdminDate(date: Date | null): string {
  if (!date) {
    return "—";
  }

  return formatPublicDate(date);
}

export default function NewsTable({ items }: NewsTableProps) {
  if (items.length === 0) {
    return (
      <div className="admin-placeholder">
        <p>No news items yet. Add the first update or notice.</p>
      </div>
    );
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table admin-table-compact">
        <thead>
          <tr>
            <th>Published</th>
            <th>Category</th>
            <th>Title</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{formatAdminDate(item.publishedAt)}</td>
              <td>{item.category}</td>
              <td>{item.title}</td>
              <td>
                <span
                  className={
                    item.published ? "admin-status-pill active" : "admin-status-pill"
                  }
                >
                  {item.published ? "Published" : "Unpublished"}
                </span>
              </td>
              <td className="admin-table-actions">
                <Link href={`/admin/news/${item.id}/edit`} className="admin-link-btn">
                  Edit
                </Link>
                <form
                  method="post"
                  action={`/api/admin/news/${item.id}/toggle-published`}
                >
                  <input
                    type="hidden"
                    name="published"
                    value={item.published ? "false" : "true"}
                  />
                  <button type="submit" className="admin-link-btn">
                    {item.published ? "Unpublish" : "Publish"}
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
