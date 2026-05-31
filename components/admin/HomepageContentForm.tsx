import AdminFormSection from "@/components/admin/AdminFormSection";
import HeroMediaItemFields from "@/components/admin/HeroMediaItemFields";
import AdminMediaUrlField from "@/components/admin/AdminMediaUrlField";
import {
  type EditableHomepageContent,
} from "@/lib/homepage-content-data";
import { HERO_MEDIA_SLOTS } from "@/lib/hero-media";
import type { MediaSelectorOption } from "@/lib/media-data";

type HomepageContentFormProps = {
  content: EditableHomepageContent;
  imageFiles: MediaSelectorOption[];
  videoFiles: MediaSelectorOption[];
};

export default function HomepageContentForm({
  content,
  imageFiles,
  videoFiles,
}: HomepageContentFormProps) {
  return (
    <form
      method="post"
      action="/api/admin/homepage"
      className="admin-settings-form admin-form-stack"
    >
      <AdminFormSection
        title="Hero content"
        lead="Main headline, description, and buttons shown over the homepage hero."
        visibilityName="visibility_hero"
        visibilityEnabled={content.visibility.hero}
        defaultOpen
      >
        <div className="admin-form-grid-2">
          <label className="admin-field admin-field-full">
            <span>Badge / eyebrow</span>
            <input
              type="text"
              name="hero_badge"
              defaultValue={content.hero.badge}
              required
            />
          </label>

          <label className="admin-field">
            <span>Hero title</span>
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
              rows={3}
            />
          </label>

          <label className="admin-field">
            <span>Primary button label</span>
            <input
              type="text"
              name="hero_primaryCtaLabel"
              defaultValue={content.hero.primaryCtaLabel}
              required
            />
          </label>

          <label className="admin-field">
            <span>Primary button link</span>
            <input
              type="text"
              name="hero_primaryCtaHref"
              defaultValue={content.hero.primaryCtaHref}
              required
            />
          </label>

          <label className="admin-field">
            <span>Secondary button label</span>
            <input
              type="text"
              name="hero_secondaryCtaLabel"
              defaultValue={content.hero.secondaryCtaLabel}
              required
            />
          </label>

          <label className="admin-field">
            <span>Secondary button link</span>
            <input
              type="text"
              name="hero_secondaryCtaHref"
              defaultValue={content.hero.secondaryCtaHref}
              required
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Background image (fallback)</span>
            <AdminMediaUrlField
              name="hero_backgroundImageUrl"
              defaultValue={content.hero.backgroundImageUrl}
              options={imageFiles}
              required
              placeholder="/uploads/images/hero-background.jpg"
            />
            <span className="admin-form-help">
              Used when no hero media items are active.
            </span>
          </label>
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Hero media"
        lead="Up to 10 images or videos. The homepage cycles through active items in order."
        defaultOpen
      >
        <div className="admin-hero-media-list">
          {Array.from({ length: HERO_MEDIA_SLOTS }, (_, index) => (
            <HeroMediaItemFields
              key={index + 1}
              slot={index + 1}
              item={content.hero.heroMedia[index]}
              imageFiles={imageFiles}
              videoFiles={videoFiles}
            />
          ))}
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Housing schemes preview"
        lead="Heading shown above scheme cards. Individual schemes are managed in Housing Schemes."
        visibilityName="visibility_schemesPreview"
        visibilityEnabled={content.visibility.schemesPreview}
        defaultOpen={false}
      >
        <div className="admin-form-grid-2">
          <label className="admin-field">
            <span>Section eyebrow</span>
            <input
              type="text"
              name="schemes_eyebrow"
              defaultValue={content.schemesPreview.eyebrow}
              required
            />
          </label>

          <label className="admin-field">
            <span>Section title</span>
            <input
              type="text"
              name="schemes_title"
              defaultValue={content.schemesPreview.title}
              required
            />
          </label>

          <label className="admin-field">
            <span>Highlighted title</span>
            <input
              type="text"
              name="schemes_highlightedTitle"
              defaultValue={content.schemesPreview.highlightedTitle}
              required
            />
          </label>

          <label className="admin-field">
            <span>View all link label</span>
            <input
              type="text"
              name="schemes_viewAllLabel"
              defaultValue={content.schemesPreview.viewAllLabel}
              required
            />
          </label>

          <label className="admin-field">
            <span>View all link URL</span>
            <input
              type="text"
              name="schemes_viewAllHref"
              defaultValue={content.schemesPreview.viewAllHref}
              required
            />
          </label>

          <label className="admin-field">
            <span>Scheme card button label</span>
            <input
              type="text"
              name="schemes_cardCtaLabel"
              defaultValue={content.schemesPreview.cardCtaLabel}
              required
            />
          </label>
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Application process"
        lead="Section visibility only. Content comes from site defaults."
        visibilityName="visibility_applicationSteps"
        visibilityEnabled={content.visibility.applicationSteps}
        defaultOpen={false}
      >
        {null}
      </AdminFormSection>

      <AdminFormSection
        title="Services preview"
        visibilityName="visibility_servicesPreview"
        visibilityEnabled={content.visibility.servicesPreview}
        defaultOpen={false}
      >
        {null}
      </AdminFormSection>

      <AdminFormSection
        title="CTA / Help section"
        visibilityName="visibility_cta"
        visibilityEnabled={content.visibility.cta}
        defaultOpen={false}
      >
        <div className="admin-form-grid-2">
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
            <span>Section title</span>
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
              rows={3}
            />
          </label>

          <label className="admin-field">
            <span>Form heading</span>
            <input
              type="text"
              name="cta_formTitle"
              defaultValue={content.ctaBanner.formTitle}
              required
            />
          </label>

          <label className="admin-field">
            <span>Submit button label</span>
            <input
              type="text"
              name="cta_submitLabel"
              defaultValue={content.ctaBanner.submitLabel}
              required
            />
          </label>

          <label className="admin-field">
            <span>Submit button link</span>
            <input
              type="text"
              name="cta_submitHref"
              defaultValue={content.ctaBanner.submitHref}
              required
            />
          </label>

          <label className="admin-field">
            <span>Name field placeholder</span>
            <input
              type="text"
              name="cta_placeholderName"
              defaultValue={content.ctaBanner.placeholderName}
              required
            />
          </label>

          <label className="admin-field">
            <span>Email field placeholder</span>
            <input
              type="text"
              name="cta_placeholderEmail"
              defaultValue={content.ctaBanner.placeholderEmail}
              required
            />
          </label>

          <label className="admin-field">
            <span>Phone field placeholder</span>
            <input
              type="text"
              name="cta_placeholderPhone"
              defaultValue={content.ctaBanner.placeholderPhone}
              required
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Assurance badges</span>
            <textarea
              name="cta_assurancesText"
              defaultValue={content.ctaBanner.assurancesText}
              required
              rows={2}
              placeholder="One short badge per line"
            />
            <span className="admin-form-help">
              Small trust labels shown below the form, one per line.
            </span>
          </label>
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Testimonials"
        visibilityName="visibility_testimonials"
        visibilityEnabled={content.visibility.testimonials}
        defaultOpen={false}
      >
        {null}
      </AdminFormSection>

      <AdminFormSection
        title="Latest updates"
        lead="Articles are managed in News & Notices."
        visibilityName="visibility_newsPreview"
        visibilityEnabled={content.visibility.newsPreview}
        defaultOpen={false}
      >
        {null}
      </AdminFormSection>

      <AdminFormSection
        title="Contact strip"
        visibilityName="visibility_contactStrip"
        visibilityEnabled={content.visibility.contactStrip}
        defaultOpen={false}
      >
        {null}
      </AdminFormSection>

      <div className="admin-save-bar admin-form-actions">
        <button type="submit" className="admin-btn admin-btn-primary admin-btn-dark">
          Save Homepage Content
        </button>
      </div>
    </form>
  );
}
