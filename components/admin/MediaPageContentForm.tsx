import AdminFormSection from "@/components/admin/AdminFormSection";
import AdminMediaUrlField from "@/components/admin/AdminMediaUrlField";
import type { PublicMediaPageContent } from "@/lib/media-page-content-data";
import type { MediaSelectorOption } from "@/lib/media-data";

type MediaPageContentFormProps = {
  content: PublicMediaPageContent;
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
      className="admin-settings-form admin-form-stack"
    >
      <AdminFormSection
        title="Page hero"
        defaultOpen
        visibilityName="visibility_hero"
        visibilityEnabled={content.visibility.hero}
      >
        <div className="admin-form-grid-2">
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
      </AdminFormSection>

      <AdminFormSection
        title="Articles section wording"
        defaultOpen={false}
        visibilityName="visibility_sectionIntro"
        visibilityEnabled={content.visibility.sectionIntro}
      >
        <div className="admin-form-grid-2">
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
      </AdminFormSection>

      <AdminFormSection
        title="Category filter"
        defaultOpen={false}
        visibilityName="visibility_categoryFilter"
        visibilityEnabled={content.visibility.categoryFilter}
      >
        {null}
      </AdminFormSection>

      <AdminFormSection
        title="Featured article"
        defaultOpen={false}
        visibilityName="visibility_featuredArticle"
        visibilityEnabled={content.visibility.featuredArticle}
      >
        {null}
      </AdminFormSection>

      <AdminFormSection
        title="Article grid"
        defaultOpen={false}
        visibilityName="visibility_articleGrid"
        visibilityEnabled={content.visibility.articleGrid}
      >
        {null}
      </AdminFormSection>

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn admin-btn-primary admin-btn-dark">
          Save Media Page
        </button>
      </div>
    </form>
  );
}
