import AdminFormSection from "@/components/admin/AdminFormSection";
import AdminMediaUrlField from "@/components/admin/AdminMediaUrlField";
import type { EditableEligibilityPageContent } from "@/lib/eligibility-page-content-data";
import type { MediaSelectorOption } from "@/lib/media-data";

type EligibilityPageContentFormProps = {
  content: EditableEligibilityPageContent;
  imageFiles: MediaSelectorOption[];
};

export default function EligibilityPageContentForm({
  content,
  imageFiles,
}: EligibilityPageContentFormProps) {
  return (
    <form
      method="post"
      action="/api/admin/eligibility"
      className="admin-settings-form admin-form-stack"
    >
      <AdminFormSection title="Page Hero" defaultOpen>
        <div className="admin-form-grid-2">
          <label className="admin-field">
            <span>Eyebrow</span>
            <input type="text" name="hero_eyebrow" defaultValue={content.hero.eyebrow} required />
          </label>
          <label className="admin-field">
            <span>Title</span>
            <input type="text" name="hero_title" defaultValue={content.hero.title} required />
          </label>
          <label className="admin-field">
            <span>Highlighted title</span>
            <input type="text" name="hero_highlightedTitle" defaultValue={content.hero.highlightedTitle} required />
          </label>
          <label className="admin-field admin-field-full">
            <span>Description</span>
            <textarea name="hero_description" defaultValue={content.hero.description} required />
          </label>
          <label className="admin-field admin-field-full">
            <span>Background image (optional)</span>
            <AdminMediaUrlField
              name="hero_backgroundImageUrl"
              defaultValue={content.hero.backgroundImageUrl}
              options={imageFiles}
              placeholder="/uploads/images/eligibility-hero.jpg"
            />
          </label>
        </div>
      </AdminFormSection>

      <AdminFormSection title="Who Qualifies" defaultOpen={false}>
        <div className="admin-form-grid-2">
          <label className="admin-field">
            <span>Title</span>
            <input type="text" name="who_title" defaultValue={content.whoQualifies.title} required />
          </label>
          <label className="admin-field">
            <span>Highlighted title</span>
            <input type="text" name="who_highlightedTitle" defaultValue={content.whoQualifies.highlightedTitle} required />
          </label>
          <label className="admin-field admin-field-full">
            <span>Description</span>
            <textarea name="who_description" defaultValue={content.whoQualifies.description} required />
          </label>
        </div>
      </AdminFormSection>

      <AdminFormSection title="Requirements Checklist" defaultOpen={false}>
        <div className="admin-form-grid-2">
          <label className="admin-field admin-field-full">
            <span>Section title</span>
            <input type="text" name="requirements_title" defaultValue={content.requirements.title} required />
          </label>
          {content.requirements.items.map((item, index) => (
            <label className="admin-field admin-field-full" key={`req-${index}`}>
              <span>{`Requirement ${index + 1}`}</span>
              <input
                type="text"
                name={`requirements_item${index + 1}`}
                defaultValue={item}
                required
              />
            </label>
          ))}
        </div>
      </AdminFormSection>

      <AdminFormSection title="Required Documents" defaultOpen={false}>
        <div className="admin-form-grid-2">
          <label className="admin-field admin-field-full">
            <span>Section title</span>
            <input type="text" name="documents_title" defaultValue={content.documents.title} required />
          </label>
          {content.documents.items.map((item, index) => (
            <label className="admin-field admin-field-full" key={`doc-${index}`}>
              <span>{`Document ${index + 1}`}</span>
              <input
                type="text"
                name={`documents_item${index + 1}`}
                defaultValue={item}
                required
              />
            </label>
          ))}
        </div>
      </AdminFormSection>

      <AdminFormSection title="Call to Action" defaultOpen={false}>
        <div className="admin-form-grid-2">
          <label className="admin-field">
            <span>Title</span>
            <input type="text" name="cta_title" defaultValue={content.cta.title} required />
          </label>
          <label className="admin-field">
            <span>Highlighted title</span>
            <input type="text" name="cta_highlightedTitle" defaultValue={content.cta.highlightedTitle} required />
          </label>
          <label className="admin-field admin-field-full">
            <span>Description</span>
            <textarea name="cta_description" defaultValue={content.cta.description} required />
          </label>
          <label className="admin-field">
            <span>Primary button label</span>
            <input type="text" name="cta_primaryLabel" defaultValue={content.cta.primaryLabel} required />
          </label>
          <label className="admin-field">
            <span>Primary button link</span>
            <input type="text" name="cta_primaryHref" defaultValue={content.cta.primaryHref} required />
          </label>
          <label className="admin-field">
            <span>Secondary button label</span>
            <input type="text" name="cta_secondaryLabel" defaultValue={content.cta.secondaryLabel} required />
          </label>
          <label className="admin-field">
            <span>Secondary button link</span>
            <input type="text" name="cta_secondaryHref" defaultValue={content.cta.secondaryHref} required />
          </label>
        </div>
      </AdminFormSection>

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn admin-btn-primary admin-btn-dark">
          Save Eligibility Page
        </button>
      </div>
    </form>
  );
}
