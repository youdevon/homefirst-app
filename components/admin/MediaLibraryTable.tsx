import CopyUrlButton from "@/components/admin/CopyUrlButton";
import type { EditableMediaFile } from "@/lib/media-data";
import {
  formatMediaDate,
  isImageMediaFile,
} from "@/lib/media-data";

type MediaLibraryTableProps = {
  files: EditableMediaFile[];
};

function getMediaTypeLabel(fileType: string): string {
  if (fileType.startsWith("image/")) {
    return "Image";
  }

  if (fileType.startsWith("video/")) {
    return "Video";
  }

  return "Document";
}

export default function MediaLibraryTable({ files }: MediaLibraryTableProps) {
  if (files.length === 0) {
    return (
      <div className="admin-placeholder">
        <p>No uploaded files yet. Upload your first image, video, or document.</p>
      </div>
    );
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table admin-table-compact admin-media-table">
        <thead>
          <tr>
            <th>Preview</th>
            <th>Original name</th>
            <th>Type</th>
            <th>Public URL</th>
            <th>Alt text</th>
            <th>Uploaded</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td>
                {isImageMediaFile(file.fileType) ? (
                  <img
                    src={file.fileUrl}
                    alt={file.altText || file.originalName}
                    className="admin-media-thumb"
                  />
                ) : (
                  <span className="admin-media-file-icon">
                    {getMediaTypeLabel(file.fileType)}
                  </span>
                )}
              </td>
              <td>{file.originalName}</td>
              <td>{getMediaTypeLabel(file.fileType)}</td>
              <td>
                <div className="admin-actions-row">
                  <code className="admin-media-url">{file.fileUrl}</code>
                  <CopyUrlButton url={file.fileUrl} />
                </div>
              </td>
              <td>
                {isImageMediaFile(file.fileType) ? (
                  <form
                    method="post"
                    action={`/api/admin/media/${file.id}/alt-text`}
                    className="admin-media-alt-form"
                  >
                    <input
                      type="text"
                      name="altText"
                      defaultValue={file.altText}
                      placeholder="Alt text"
                      aria-label={`Alt text for ${file.originalName}`}
                    />
                    <button type="submit" className="admin-link-btn">
                      Save
                    </button>
                  </form>
                ) : (
                  <span className="admin-media-muted">—</span>
                )}
              </td>
              <td>{formatMediaDate(file.createdAt)}</td>
              <td className="admin-table-actions">
                <form
                  method="post"
                  action={`/api/admin/media/${file.id}/delete`}
                >
                  <button
                    type="submit"
                    className="admin-link-btn admin-link-btn-danger"
                  >
                    Delete
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
