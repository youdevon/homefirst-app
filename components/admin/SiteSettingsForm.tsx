import AdminMediaUrlField from "@/components/admin/AdminMediaUrlField";
import type { EditableSiteSettings } from "@/lib/site-settings-data";
import type { MediaSelectorOption } from "@/lib/media-data";
import { THEME_PRESET_OPTIONS } from "@/lib/theme-presets";

type SiteSettingsFormProps = {
  settings: EditableSiteSettings;
  imageFiles: MediaSelectorOption[];
};

export default function SiteSettingsForm({
  settings,
  imageFiles,
}: SiteSettingsFormProps) {
  return (
    <form
      method="post"
      action="/api/admin/site-settings"
      className="admin-settings-form"
    >
      <div className="admin-form-grid">
        <label className="admin-field">
          <span>Site name</span>
          <input
            type="text"
            name="name"
            defaultValue={settings.name}
            required
            placeholder="Division of Urban Buildings"
          />
        </label>

        <label className="admin-field">
          <span>Ministry / tagline</span>
          <input
            type="text"
            name="tagline"
            defaultValue={settings.tagline}
            required
            placeholder="Housing, Community & Social Development"
          />
        </label>

        <label className="admin-field">
          <span>Phone number</span>
          <input
            type="text"
            name="phone"
            defaultValue={settings.phone}
            required
            placeholder="+1 (868) 612-3456"
          />
        </label>

        <label className="admin-field">
          <span>Email address</span>
          <input
            type="email"
            name="email"
            defaultValue={settings.email}
            required
            placeholder="info@homefirst.gov.tt"
          />
        </label>

        <label className="admin-field">
          <span>Office hours</span>
          <input
            type="text"
            name="officeHours"
            defaultValue={settings.officeHours}
            required
            placeholder="Mon–Fri: 8:00am – 4:00pm"
          />
        </label>

        <label className="admin-field admin-field-full">
          <span>Logo URL</span>
          <AdminMediaUrlField
            name="logoUrl"
            defaultValue={settings.logoUrl}
            options={imageFiles}
            placeholder="/uploads/images/logo.png"
          />
        </label>

        <label className="admin-field admin-field-full">
          <span>Browser Tab Icon URL</span>
          <AdminMediaUrlField
            name="faviconUrl"
            defaultValue={settings.faviconUrl}
            options={imageFiles}
            placeholder="/uploads/images/tha-icon.png"
          />
          <span className="admin-form-help">
            Upload a square icon in Media Library, then paste/select its URL here.
            Recommended: square PNG or ICO.
          </span>
        </label>

        <label className="admin-field admin-field-full">
          <span>Footer copyright text</span>
          <input
            type="text"
            name="copyright"
            defaultValue={settings.copyright}
            required
            placeholder="© 2026 HomeFirst Division. All rights reserved."
          />
        </label>
      </div>

      <div className="admin-form-section">
        <h2 className="admin-form-section-title">Public Website Theme</h2>
        <div className="admin-form-grid">
          <label className="admin-field admin-field-full">
            <span>Theme Preset</span>
            <select name="themePreset" defaultValue={settings.themePreset}>
              {THEME_PRESET_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="admin-form-help">
              Choose a preset color theme for the public website. Layout and
              content will remain unchanged.
            </span>
          </label>
        </div>
      </div>

      <div className="admin-form-section">
        <h2 className="admin-form-section-title">Social Media Links</h2>
        <p className="admin-form-section-lead">
          Optional links shown in the public website header. Leave blank to hide
          an icon.
        </p>
        <div className="admin-form-grid">
          <label className="admin-field admin-field-full">
            <span>Facebook URL</span>
            <input
              type="text"
              name="socialFacebook"
              defaultValue={settings.socialFacebook}
              placeholder="https://facebook.com/your-page"
            />
          </label>
          <label className="admin-field admin-field-full">
            <span>Instagram URL</span>
            <input
              type="text"
              name="socialInstagram"
              defaultValue={settings.socialInstagram}
              placeholder="https://instagram.com/your-page"
            />
          </label>
          <label className="admin-field admin-field-full">
            <span>YouTube URL</span>
            <input
              type="text"
              name="socialYoutube"
              defaultValue={settings.socialYoutube}
              placeholder="https://youtube.com/your-channel"
            />
          </label>
          <label className="admin-field admin-field-full">
            <span>LinkedIn URL</span>
            <input
              type="text"
              name="socialLinkedin"
              defaultValue={settings.socialLinkedin}
              placeholder="https://linkedin.com/company/your-page"
            />
          </label>
        </div>
      </div>

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn admin-btn-primary admin-btn-dark">
          Save Settings
        </button>
      </div>
    </form>
  );
}
