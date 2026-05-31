import AdminFormSection from "@/components/admin/AdminFormSection";
import AdminMediaUrlField from "@/components/admin/AdminMediaUrlField";
import type { EditableAboutContent } from "@/lib/about-content-data";
import type { MediaSelectorOption } from "@/lib/media-data";

type AboutContentFormProps = {
  content: EditableAboutContent;
  imageFiles: MediaSelectorOption[];
};

export default function AboutContentForm({
  content,
  imageFiles,
}: AboutContentFormProps) {
  return (
    <form
      method="post"
      action="/api/admin/about"
      className="admin-settings-form admin-form-stack"
    >
      <AdminFormSection
        title="About Hero"
        visibilityName="visibility_hero"
        visibilityEnabled={content.visibility.hero}
        defaultOpen
      >
        <div className="admin-form-grid-2">
          <label className="admin-field">
            <span>Eyebrow</span>
            <input
              type="text"
              name="hero_eyebrow"
              defaultValue={content.hero.eyebrow}
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
              placeholder="/uploads/images/about-hero.jpg"
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
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Who We Are / Intro"
        visibilityName="visibility_intro"
        visibilityEnabled={content.visibility.intro}
        defaultOpen={false}
      >
        <div className="admin-form-grid-2">
          <label className="admin-field">
            <span>Eyebrow</span>
            <input
              type="text"
              name="intro_eyebrow"
              defaultValue={content.intro.eyebrow}
              required
            />
          </label>

          <label className="admin-field">
            <span>Title</span>
            <input
              type="text"
              name="intro_title"
              defaultValue={content.intro.title}
              required
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Highlighted title</span>
            <input
              type="text"
              name="intro_highlightedTitle"
              defaultValue={content.intro.highlightedTitle}
              required
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Paragraph one</span>
            <textarea
              name="intro_paragraphOne"
              defaultValue={content.intro.paragraphOne}
              required
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Paragraph two</span>
            <textarea
              name="intro_paragraphTwo"
              defaultValue={content.intro.paragraphTwo}
              required
            />
          </label>
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Vision & Mission"
        visibilityName="visibility_visionMission"
        visibilityEnabled={content.visibility.visionMission}
        defaultOpen={false}
      >
        <div className="admin-form-grid-2">
          <label className="admin-field">
            <span>Vision title</span>
            <input
              type="text"
              name="vision_title"
              defaultValue={content.vision.title}
              required
            />
          </label>

          <label className="admin-field">
            <span>Mission title</span>
            <input
              type="text"
              name="mission_title"
              defaultValue={content.mission.title}
              required
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Vision body</span>
            <textarea
              name="vision_body"
              defaultValue={content.vision.body}
              required
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Mission body</span>
            <textarea
              name="mission_body"
              defaultValue={content.mission.body}
              required
            />
          </label>
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Highlights"
        visibilityName="visibility_highlights"
        visibilityEnabled={content.visibility.highlights}
        defaultOpen={false}
      >
        <div className="admin-form-grid-3">
          <label className="admin-field">
            <span>Highlight one value</span>
            <input
              type="text"
              name="highlights_highlightOneValue"
              defaultValue={content.highlights.highlightOneValue}
              required
            />
          </label>

          <label className="admin-field">
            <span>Highlight one label</span>
            <input
              type="text"
              name="highlights_highlightOneLabel"
              defaultValue={content.highlights.highlightOneLabel}
              required
            />
          </label>

          <label className="admin-field">
            <span>Highlight two value</span>
            <input
              type="text"
              name="highlights_highlightTwoValue"
              defaultValue={content.highlights.highlightTwoValue}
              required
            />
          </label>

          <label className="admin-field">
            <span>Highlight two label</span>
            <input
              type="text"
              name="highlights_highlightTwoLabel"
              defaultValue={content.highlights.highlightTwoLabel}
              required
            />
          </label>

          <label className="admin-field">
            <span>Highlight three value</span>
            <input
              type="text"
              name="highlights_highlightThreeValue"
              defaultValue={content.highlights.highlightThreeValue}
              required
            />
          </label>

          <label className="admin-field">
            <span>Highlight three label</span>
            <input
              type="text"
              name="highlights_highlightThreeLabel"
              defaultValue={content.highlights.highlightThreeLabel}
              required
            />
          </label>
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Images"
        visibilityName="visibility_images"
        visibilityEnabled={content.visibility.images}
        defaultOpen={false}
      >
        <div className="admin-form-grid-2">
          <label className="admin-field admin-field-full">
            <span>Main image URL</span>
            <AdminMediaUrlField
              name="images_mainImageUrl"
              defaultValue={content.images.mainImageUrl}
              options={imageFiles}
              required
              placeholder="/uploads/images/about-main.jpg"
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Secondary image URL</span>
            <AdminMediaUrlField
              name="images_secondaryImageUrl"
              defaultValue={content.images.secondaryImageUrl}
              options={imageFiles}
              required
              placeholder="/uploads/images/about-secondary.jpg"
            />
          </label>

          <label className="admin-field">
            <span>Established year</span>
            <input
              type="text"
              name="images_establishedYear"
              defaultValue={content.images.establishedYear}
              required
            />
          </label>

          <label className="admin-field">
            <span>Established label</span>
            <input
              type="text"
              name="images_establishedLabel"
              defaultValue={content.images.establishedLabel}
              required
            />
          </label>
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Our Leaders"
        lead="Leader profiles are managed in Leaders & Board. Use this section to edit the heading shown above the leadership cards."
        visibilityName="visibility_leadership"
        visibilityEnabled={content.visibility.leadership}
        defaultOpen={false}
      >
        <div className="admin-form-grid-2">
          <label className="admin-field">
            <span>Eyebrow</span>
            <input
              type="text"
              name="leadership_eyebrow"
              defaultValue={content.leadershipHeader.eyebrow}
              required
            />
          </label>

          <label className="admin-field">
            <span>Title</span>
            <input
              type="text"
              name="leadership_title"
              defaultValue={content.leadershipHeader.title}
              required
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Highlighted title</span>
            <input
              type="text"
              name="leadership_highlightedTitle"
              defaultValue={content.leadershipHeader.highlightedTitle}
              required
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Description</span>
            <textarea
              name="leadership_description"
              defaultValue={content.leadershipHeader.description}
              required
            />
          </label>
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Board of Directors"
        lead="Board member profiles are managed in Leaders & Board. Use this section to edit the heading shown above the board cards."
        visibilityName="visibility_board"
        visibilityEnabled={content.visibility.board}
        defaultOpen={false}
      >
        <div className="admin-form-grid-2">
          <label className="admin-field">
            <span>Section eyebrow</span>
            <input
              type="text"
              name="board_eyebrow"
              defaultValue={content.boardHeader.eyebrow}
              required
            />
          </label>

          <label className="admin-field">
            <span>Section title</span>
            <input
              type="text"
              name="board_title"
              defaultValue={content.boardHeader.title}
              required
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Highlighted title</span>
            <input
              type="text"
              name="board_highlightedTitle"
              defaultValue={content.boardHeader.highlightedTitle}
              required
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Section description</span>
            <textarea
              name="board_description"
              defaultValue={content.boardHeader.description}
              required
            />
          </label>
        </div>
      </AdminFormSection>

      <div className="admin-save-bar admin-form-actions">
        <button type="submit" className="admin-btn admin-btn-primary admin-btn-dark">
          Save About Page
        </button>
      </div>
    </form>
  );
}
