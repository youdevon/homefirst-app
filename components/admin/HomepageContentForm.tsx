import AdminMediaUrlField from "@/components/admin/AdminMediaUrlField";
import type { EditableHomepageContent } from "@/lib/homepage-content-data";
import type { MediaSelectorOption } from "@/lib/media-data";

type HomepageContentFormProps = {
  content: EditableHomepageContent;
  imageFiles: MediaSelectorOption[];
};

export default function HomepageContentForm({
  content,
  imageFiles,
}: HomepageContentFormProps) {
  return (
    <form
      method="post"
      action="/api/admin/homepage"
      className="admin-settings-form"
    >
      <div className="admin-form-section">
        <h2 className="admin-form-section-title">Homepage Hero</h2>
        <div className="admin-form-grid">
          <label className="admin-field admin-field-full">
            <span>Badge</span>
            <input
              type="text"
              name="hero_badge"
              defaultValue={content.hero.badge}
              required
            />
          </label>

          <label className="admin-field">
            <span>Title</span>
            <input
              type="text"
              name="hero_title"
              defaultValue={content.hero.title}
              required
            />
          </label>

          <label className="admin-field">
            <span>Highlighted title</span>
            <input
              type="text"
              name="hero_highlightedTitle"
              defaultValue={content.hero.highlightedTitle}
              required
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Description</span>
            <textarea
              name="hero_description"
              defaultValue={content.hero.description}
              required
            />
          </label>

          <label className="admin-field">
            <span>Primary CTA label</span>
            <input
              type="text"
              name="hero_primaryCtaLabel"
              defaultValue={content.hero.primaryCtaLabel}
              required
            />
          </label>

          <label className="admin-field">
            <span>Primary CTA link</span>
            <input
              type="text"
              name="hero_primaryCtaHref"
              defaultValue={content.hero.primaryCtaHref}
              required
            />
          </label>

          <label className="admin-field">
            <span>Secondary CTA label</span>
            <input
              type="text"
              name="hero_secondaryCtaLabel"
              defaultValue={content.hero.secondaryCtaLabel}
              required
            />
          </label>

          <label className="admin-field">
            <span>Secondary CTA link</span>
            <input
              type="text"
              name="hero_secondaryCtaHref"
              defaultValue={content.hero.secondaryCtaHref}
              required
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Background image URL</span>
            <AdminMediaUrlField
              name="hero_backgroundImageUrl"
              defaultValue={content.hero.backgroundImageUrl}
              options={imageFiles}
              required
              placeholder="/uploads/images/hero-background.jpg"
            />
          </label>
        </div>
      </div>

      <div className="admin-form-section">
        <h2 className="admin-form-section-title">CTA Banner</h2>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span>Eyebrow</span>
            <input
              type="text"
              name="cta_eyebrow"
              defaultValue={content.ctaBanner.eyebrow}
              required
            />
          </label>

          <label className="admin-field">
            <span>Title</span>
            <input
              type="text"
              name="cta_title"
              defaultValue={content.ctaBanner.title}
              required
            />
          </label>

          <label className="admin-field">
            <span>Highlighted title</span>
            <input
              type="text"
              name="cta_highlightedTitle"
              defaultValue={content.ctaBanner.highlightedTitle}
              required
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Description</span>
            <textarea
              name="cta_description"
              defaultValue={content.ctaBanner.description}
              required
            />
          </label>

          <label className="admin-field">
            <span>Form title</span>
            <input
              type="text"
              name="cta_formTitle"
              defaultValue={content.ctaBanner.formTitle}
              required
            />
          </label>

          <label className="admin-field">
            <span>Submit label</span>
            <input
              type="text"
              name="cta_submitLabel"
              defaultValue={content.ctaBanner.submitLabel}
              required
            />
          </label>
        </div>
      </div>

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn admin-btn-primary admin-btn-dark">
          Save Homepage Content
        </button>
      </div>
    </form>
  );
}
