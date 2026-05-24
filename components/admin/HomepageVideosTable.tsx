import Link from "next/link";
import type { EditableHomepageVideo } from "@/lib/homepage-videos-data";

type HomepageVideosTableProps = {
  videos: EditableHomepageVideo[];
};

export default function HomepageVideosTable({ videos }: HomepageVideosTableProps) {
  if (videos.length === 0) {
    return (
      <div className="admin-placeholder">
        <p>No homepage videos yet. Add the first video from the Media Library.</p>
      </div>
    );
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Title</th>
            <th>Meta</th>
            <th>Featured</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => (
            <tr key={video.id}>
              <td>{video.displayOrder}</td>
              <td>{video.title}</td>
              <td>{video.meta || "—"}</td>
              <td>
                {video.featured ? (
                  <span className="admin-status-pill active">Featured</span>
                ) : (
                  <form
                    method="post"
                    action={`/api/admin/homepage-videos/${video.id}/set-featured`}
                  >
                    <button type="submit" className="admin-link-btn">
                      Set featured
                    </button>
                  </form>
                )}
              </td>
              <td>
                <span
                  className={
                    video.active ? "admin-status-pill active" : "admin-status-pill"
                  }
                >
                  {video.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="admin-table-actions">
                <Link
                  href={`/admin/homepage/videos/${video.id}/edit`}
                  className="admin-link-btn"
                >
                  Edit
                </Link>
                <form
                  method="post"
                  action={`/api/admin/homepage-videos/${video.id}/toggle-active`}
                >
                  <input
                    type="hidden"
                    name="active"
                    value={video.active ? "false" : "true"}
                  />
                  <button type="submit" className="admin-link-btn">
                    {video.active ? "Deactivate" : "Activate"}
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
