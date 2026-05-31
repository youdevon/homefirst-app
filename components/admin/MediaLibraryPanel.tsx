"use client";

import { useMemo, useState } from "react";
import CopyUrlButton from "@/components/admin/CopyUrlButton";
import type { EditableMediaFile } from "@/lib/media-data";
import {
  formatMediaDate,
  getMediaTypeLabel,
  isImageMediaFile,
} from "@/lib/media-display";

type MediaLibraryPanelProps = {
  files: EditableMediaFile[];
};

type MediaFilter = "all" | "image" | "video" | "document";

function matchesFilter(file: EditableMediaFile, filter: MediaFilter): boolean {
  if (filter === "all") {
    return true;
  }

  if (filter === "image") {
    return file.fileType.startsWith("image/");
  }

  if (filter === "video") {
    return file.fileType.startsWith("video/");
  }

  return !file.fileType.startsWith("image/") && !file.fileType.startsWith("video/");
}

export default function MediaLibraryPanel({ files }: MediaLibraryPanelProps) {
  const [filter, setFilter] = useState<MediaFilter>("all");
  const [query, setQuery] = useState("");

  const filteredFiles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return files.filter((file) => {
      if (!matchesFilter(file, filter)) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return (
        file.originalName.toLowerCase().includes(normalizedQuery) ||
        file.fileUrl.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [files, filter, query]);

  if (files.length === 0) {
    return (
      <div className="admin-placeholder">
        <p>No uploaded files yet. Upload your first image, video, or document.</p>
      </div>
    );
  }

  return (
    <div className="admin-media-library-panel">
      <div className="admin-media-library-toolbar">
        <label className="admin-field admin-field-compact">
          <span>Search files</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by filename or path"
          />
        </label>

        <div className="admin-filter-tabs" role="tablist" aria-label="Filter by file type">
          {(
            [
              ["all", "All"],
              ["image", "Images"],
              ["video", "Videos"],
              ["document", "Documents"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`admin-filter-tab${filter === value ? " admin-filter-tab-active" : ""}`}
              onClick={() => setFilter(value)}
              role="tab"
              aria-selected={filter === value}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filteredFiles.length === 0 ? (
        <div className="admin-placeholder">
          <p>No files match your search or filter.</p>
        </div>
      ) : (
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
              {filteredFiles.map((file) => (
                <tr key={file.id}>
                  <td>
                    {isImageMediaFile(file.fileType) ? (
                      <img
                        src={file.fileUrl}
                        alt={file.altText || file.originalName}
                        className="admin-media-thumb"
                      />
                    ) : file.fileType.startsWith("video/") ? (
                      <video
                        src={file.fileUrl}
                        className="admin-media-thumb admin-media-thumb-video"
                        muted
                        playsInline
                        preload="metadata"
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
      )}
    </div>
  );
}
