export default function MediaUploadForm() {
  return (
    <form
      method="post"
      action="/api/admin/media"
      encType="multipart/form-data"
      className="admin-settings-form"
    >
      <div className="admin-form-grid">
        <label className="admin-field admin-field-full">
          <span>Choose file</span>
          <input type="file" name="file" required />
        </label>

        <label className="admin-field admin-field-full">
          <span>Alt text (images only)</span>
          <input
            type="text"
            name="altText"
            placeholder="Describe the image for accessibility"
          />
        </label>
      </div>

      <p className="admin-form-help">
        Accepted files: JPG, PNG, WEBP, GIF (10 MB), MP4 and WEBM (50 MB), PDF,
        DOC, and DOCX (20 MB).
      </p>

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn admin-btn-primary admin-btn-dark">
          Upload File
        </button>
      </div>
    </form>
  );
}
