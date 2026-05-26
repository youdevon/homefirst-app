import AdminMediaUrlField from "@/components/admin/AdminMediaUrlField";
import type { EditableMediaPageContent } from "@/lib/media-page-content-data";
import type { MediaSelectorOption } from "@/lib/media-data";

type MediaPageContentFormProps = {
  content: EditableMediaPageContent;
  imageFiles: MediaSelectorOption[];
};

export default function MediaPageContentForm({
  content,
  imageFiles,
}: MediaPageContentFormProps) {
  return (
    <form
      method="post"
      action="/api/admin/media-page"
      className="admin-settings-form"
    >
      <div className="admin-form-section">
        <h2 className="admin-form-section-title">Page Hero</h2>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span>Eyebrow</span>
            <input type="text" name="eyebrow" defaultValue={content.eyebrow} required />
          </label>
          <label className="admin-field">
            <span>Title</span>
            <input type="text" name="title" defaultValue={content.title} required />
          </label>
          <label className="admin-field">
            <span>Highlighted title</span>
            <input type="text" name="highlightedTitle" defaultValue={content.highlightedTitle} required />
          </label>
          <label className="admin-field admin-field-full">
            <span>Description</span>
            <textarea name="description" defaultValue={content.description} required />
          </label>
          <label className="admin-field admin-field-full">
            <span>Background image</span>
            <AdminMediaUrlField
              name="backgroundImageUrl"
              defaultValue={content.backgroundImageUrl}
              options={imageFiles}
              required
              placeholder="/uploads/images/media-hero.jpg"
            />
          </label>
        </div>
      </div>

      <div className="admin-form-section">
        <h2 className="admin-form-section-title">Articles Section Wording</h2>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span>Section eyebrow</span>
            <input type="text" name="section_eyebrow" defaultValue={content.sectionEyebrow} required />
          </label>
          <label className="admin-field">
            <span>Section title</span>
            <input type="text" name="section_title" defaultValue={content.sectionTitle} required />
          </label>
          <label className="admin-field">
            <span>Highlighted title</span>
            <input type="text" name="section_highlightedTitle" defaultValue={content.sectionHighlightedTitle} required />
          </label>
          <label className="admin-field admin-field-full">
            <span>Section intro</span>
            <textarea name="section_lead" defaultValue={content.sectionLead} required />
          </label>
        </div>
      </div>

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn admin-btn-primary admin-btn-dark">
          Save Media Page
        </button>
      </div>
    </form>
  );
}
