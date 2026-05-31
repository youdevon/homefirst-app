import AdminFormSection from "@/components/admin/AdminFormSection";
import type { EditableVideoSectionHeader } from "@/lib/homepage-videos-data";

type HomepageVideosSectionFormProps = {
  header: EditableVideoSectionHeader;
  visibilityEnabled?: boolean;
};

export default function HomepageVideosSectionForm({
  header,
  visibilityEnabled = true,
}: HomepageVideosSectionFormProps) {
  return (
    <form
      method="post"
      action="/api/admin/homepage-videos/section"
      className="admin-settings-form admin-form-stack"
    >
      <AdminFormSection
        title="Real Communities videos"
        lead="Edit the homepage video section header shown above the featured player and video list."
        defaultOpen={false}
        visibilityName="visibility_videoSection"
        visibilityEnabled={visibilityEnabled}
      >
        <div className="admin-form-grid-2">
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
      </AdminFormSection>

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn admin-btn-primary admin-btn-dark">
          Save Video Section Header
        </button>
      </div>
    </form>
  );
}
