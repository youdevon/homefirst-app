import type { EditableVideoSectionHeader } from "@/lib/homepage-videos-data";

type HomepageVideosSectionFormProps = {
  header: EditableVideoSectionHeader;
};

export default function HomepageVideosSectionForm({
  header,
}: HomepageVideosSectionFormProps) {
  return (
    <form
      method="post"
      action="/api/admin/homepage-videos/section"
      className="admin-settings-form"
    >
      <div className="admin-form-section">
        <h2 className="admin-form-section-title">Real Communities Videos</h2>
        <p className="admin-form-section-lead">
          Edit the homepage video section header shown above the featured
          player and video list.
        </p>

        <div className="admin-form-grid">
          <label className="admin-field">
            <span>Eyebrow</span>
            <input
              type="text"
              name="videos_eyebrow"
              defaultValue={header.eyebrow}
              required
            />
          </label>

          <label className="admin-field">
            <span>Title</span>
            <input
              type="text"
              name="videos_title"
              defaultValue={header.title}
              required
            />
          </label>

          <label className="admin-field">
            <span>Highlighted title</span>
            <input
              type="text"
              name="videos_highlightedTitle"
              defaultValue={header.highlightedTitle}
              required
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Description</span>
            <textarea
              name="videos_description"
              defaultValue={header.description}
              required
            />
          </label>
        </div>
      </div>

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn admin-btn-primary admin-btn-dark">
          Save Video Section Header
        </button>
      </div>
    </form>
  );
}
