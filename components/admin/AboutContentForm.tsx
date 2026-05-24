import type { EditableAboutContent } from "@/lib/about-content-data";

type AboutContentFormProps = {
  content: EditableAboutContent;
};

export default function AboutContentForm({ content }: AboutContentFormProps) {
  return (
    <form
      method="post"
      action="/api/admin/about"
      className="admin-settings-form"
    >
      <div className="admin-form-section">
        <h2 className="admin-form-section-title">About Hero</h2>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span>Eyebrow</span>
            <input
              type="text"
              name="hero_eyebrow"
              defaultValue={content.hero.eyebrow}
              required
            />
          </label>

          <label className="admin-field">
            <span>Background image URL</span>
            <input
              type="text"
              name="hero_backgroundImageUrl"
              defaultValue={content.hero.backgroundImageUrl}
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
      </div>

      <div className="admin-form-section">
        <h2 className="admin-form-section-title">Who We Are / Intro</h2>
        <div className="admin-form-grid">
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
      </div>

      <div className="admin-form-section">
        <h2 className="admin-form-section-title">Vision & Mission</h2>
        <div className="admin-form-grid">
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
      </div>

      <div className="admin-form-section">
        <h2 className="admin-form-section-title">Highlights</h2>
        <div className="admin-form-grid">
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
      </div>

      <div className="admin-form-section">
        <h2 className="admin-form-section-title">Images</h2>
        <div className="admin-form-grid">
          <label className="admin-field admin-field-full">
            <span>Main image URL</span>
            <input
              type="text"
              name="images_mainImageUrl"
              defaultValue={content.images.mainImageUrl}
              required
              placeholder="/uploads/images/about-main.jpg"
            />
          </label>

          <label className="admin-field admin-field-full">
            <span>Secondary image URL</span>
            <input
              type="text"
              name="images_secondaryImageUrl"
              defaultValue={content.images.secondaryImageUrl}
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
      </div>

      <div className="admin-form-section">
        <h2 className="admin-form-section-title">Leadership Header</h2>
        <p className="admin-form-help">
          Leader profiles are managed separately in the Leaders editor.
        </p>
        <div className="admin-form-grid">
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
      </div>

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn admin-btn-primary admin-btn-dark">
          Save About Page
        </button>
      </div>
    </form>
  );
}
