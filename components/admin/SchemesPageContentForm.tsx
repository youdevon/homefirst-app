import AdminFormSection from "@/components/admin/AdminFormSection";
import AdminMediaUrlField from "@/components/admin/AdminMediaUrlField";
import type { PublicSchemesPageContent } from "@/lib/schemes-page-content-data";
import type { MediaSelectorOption } from "@/lib/media-data";

type SchemesPageContentFormProps = {
  content: PublicSchemesPageContent;
  imageFiles: MediaSelectorOption[];
};

export default function SchemesPageContentForm({
  content,
  imageFiles,
}: SchemesPageContentFormProps) {
  return (
    <form
      method="post"
      action="/api/admin/schemes-page"
      className="admin-settings-form admin-form-stack"
    >
      <AdminFormSection
        title="Page Hero"
        defaultOpen
        visibilityName="visibility_hero"
        visibilityEnabled={content.visibility.hero}
      >
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
            <span>Background image</span>
            <AdminMediaUrlField
              name="hero_backgroundImageUrl"
              defaultValue={content.hero.backgroundImageUrl}
              options={imageFiles}
              required
              placeholder="/uploads/images/schemes-hero.jpg"
            />
          </label>
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Schemes List Intro"
        defaultOpen={false}
        visibilityName="visibility_listIntro"
        visibilityEnabled={content.visibility.listIntro}
      >
        <div className="admin-form-grid-2">
          <label className="admin-field">
            <span>Eyebrow</span>
            <input type="text" name="list_eyebrow" defaultValue={content.listIntro.eyebrow} required />
          </label>
          <label className="admin-field">
            <span>Title</span>
            <input type="text" name="list_title" defaultValue={content.listIntro.title} required />
          </label>
          <label className="admin-field">
            <span>Highlighted title</span>
            <input type="text" name="list_highlightedTitle" defaultValue={content.listIntro.highlightedTitle} required />
          </label>
          <label className="admin-field admin-field-full">
            <span>Intro text</span>
            <textarea name="list_lead" defaultValue={content.listIntro.lead} required />
          </label>
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Scheme listing"
        defaultOpen={false}
        lead="Turn off to hide housing scheme cards on the page."
        visibilityName="visibility_schemeListing"
        visibilityEnabled={content.visibility.schemeListing}
      >
        {null}
      </AdminFormSection>

      <AdminFormSection
        title="Choosing a Scheme Section"
        defaultOpen={false}
        visibilityName="visibility_chooseSection"
        visibilityEnabled={content.visibility.chooseSection}
      >
        <div className="admin-form-grid-2">
          <label className="admin-field">
            <span>Eyebrow</span>
            <input type="text" name="choose_eyebrow" defaultValue={content.chooseSection.eyebrow} required />
          </label>
          <label className="admin-field">
            <span>Title</span>
            <input type="text" name="choose_title" defaultValue={content.chooseSection.title} required />
          </label>
          <label className="admin-field">
            <span>Highlighted title</span>
            <input type="text" name="choose_highlightedTitle" defaultValue={content.chooseSection.highlightedTitle} required />
          </label>
          <label className="admin-field admin-field-full">
            <span>Section lead</span>
            <textarea name="choose_lead" defaultValue={content.chooseSection.lead} required />
          </label>
          {content.chooseSection.items.map((item, index) => (
            <div className="admin-field admin-field-full" key={item.title}>
              <span>{`Step ${index + 1}`}</span>
              <div className="admin-form-grid-2">
                <label className="admin-field">
                  <span>Title</span>
                  <input
                    type="text"
                    name={`choose_item${index + 1}_title`}
                    defaultValue={item.title}
                    required
                  />
                </label>
                <label className="admin-field admin-field-full">
                  <span>Text</span>
                  <textarea
                    name={`choose_item${index + 1}_text`}
                    defaultValue={item.text}
                    required
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Page Call to Action"
        defaultOpen={false}
        visibilityName="visibility_cta"
        visibilityEnabled={content.visibility.cta}
      >
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
          Save Housing Schemes Page
        </button>
      </div>
    </form>
  );
}
