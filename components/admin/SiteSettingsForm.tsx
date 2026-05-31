import AdminFormSection from "@/components/admin/AdminFormSection";
import AdminMediaUrlField from "@/components/admin/AdminMediaUrlField";
import { LOGO_DISPLAY_MODE_OPTIONS } from "@/lib/logo-display-mode";
import type { EditableSiteSettings } from "@/lib/site-settings-data";
import type { MediaSelectorOption } from "@/lib/media-data";
import { THEME_PRESET_OPTIONS } from "@/lib/theme-presets";

type SiteSettingsFormProps = {
  settings: EditableSiteSettings;
  imageFiles: MediaSelectorOption[];
  aiConfigured?: boolean;
};

export default function SiteSettingsForm({
  settings,
  imageFiles,
  aiConfigured = true,
}: SiteSettingsFormProps) {
  return (
    <form
      method="post"
      action="/api/admin/site-settings"
      className="admin-settings-form admin-form-stack"
    >
      <AdminFormSection title="Branding" defaultOpen>
        <div className="admin-form-grid-2">
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

          <label className="admin-field admin-field-full">
            <span>Logo URL</span>
            <AdminMediaUrlField
              name="logoUrl"
              defaultValue={settings.logoUrl}
              options={imageFiles}
              placeholder="/uploads/images/logo.png"
            />
          </label>

          <label className="admin-field">
            <span>Logo display mode</span>
            <select name="logoDisplayMode" defaultValue={settings.logoDisplayMode}>
              {LOGO_DISPLAY_MODE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="admin-form-help">
              Use full logo image when the upload already includes the organization
              name.
            </span>
          </label>

          <label className="admin-field">
            <span>Browser tab icon / Favicon</span>
            <AdminMediaUrlField
              name="faviconUrl"
              defaultValue={settings.faviconUrl}
              options={imageFiles}
              placeholder="/uploads/images/favicon.png"
              showInlineHelp={false}
            />
            <span className="admin-form-help">
              Square PNG, SVG, or ICO. Hard refresh may be needed after changing.
            </span>
          </label>
        </div>
      </AdminFormSection>

      <AdminFormSection title="Contact information" defaultOpen={false}>
        <div className="admin-form-grid-2">
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

          <label className="admin-field admin-field-full">
            <span>Office hours</span>
            <input
              type="text"
              name="officeHours"
              defaultValue={settings.officeHours}
              required
              placeholder="Mon–Fri: 8:00am – 4:00pm"
            />
          </label>
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Social links"
        lead="Optional links shown in the public website header. Leave blank to hide an icon."
        defaultOpen={false}
      >
        <div className="admin-form-grid-2">
          <label className="admin-field">
            <span>Facebook URL</span>
            <input
              type="text"
              name="socialFacebook"
              defaultValue={settings.socialFacebook}
              placeholder="https://facebook.com/your-page"
            />
          </label>
          <label className="admin-field">
            <span>Instagram URL</span>
            <input
              type="text"
              name="socialInstagram"
              defaultValue={settings.socialInstagram}
              placeholder="https://instagram.com/your-page"
            />
          </label>
          <label className="admin-field">
            <span>YouTube URL</span>
            <input
              type="text"
              name="socialYoutube"
              defaultValue={settings.socialYoutube}
              placeholder="https://youtube.com/your-channel"
            />
          </label>
          <label className="admin-field">
            <span>LinkedIn URL</span>
            <input
              type="text"
              name="socialLinkedin"
              defaultValue={settings.socialLinkedin}
              placeholder="https://linkedin.com/company/your-page"
            />
          </label>
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Header and footer"
        lead="Footer wording shown across the public website."
        defaultOpen={false}
      >
        <div className="admin-form-grid">
          <label className="admin-field admin-field-full">
            <span>Footer tagline</span>
            <textarea
              name="footerTagline"
              defaultValue={settings.footerTagline}
              rows={2}
              placeholder="Delivering safe, dignified, community-centred housing support for citizens and families."
            />
            <span className="admin-form-help">
              Shown under the logo in the website footer.
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
      </AdminFormSection>

      <AdminFormSection
        title="Appearance"
        lead="Choose a preset color theme for the public website."
        defaultOpen={false}
      >
        <div className="admin-form-grid-2">
          <label className="admin-field">
            <span>Theme preset</span>
            <select name="themePreset" defaultValue={settings.themePreset}>
              {THEME_PRESET_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="AI Assistant"
        lead="Control whether the floating assistant appears on public pages."
        defaultOpen={false}
      >
        {!aiConfigured ? (
          <div className="admin-alert admin-alert-warning admin-alert-compact" role="status">
            The assistant needs a server API key before it can answer visitors.
            Contact your system administrator to configure it. The toggle below
            only controls whether the button appears on the public website.
          </div>
        ) : null}
        <label className="admin-toggle-row admin-field">
          <span>Show AI Assistant on website</span>
          <label className="admin-checkbox-field">
            <input
              type="checkbox"
              name="aiAssistantEnabled"
              value="1"
              defaultChecked={settings.aiAssistantEnabled}
            />
            <span className="admin-muted">
              When enabled, visitors can open the AI assistant from any public page.
            </span>
          </label>
        </label>
      </AdminFormSection>

      <div className="admin-save-bar admin-form-actions">
        <button type="submit" className="admin-btn admin-btn-primary admin-btn-dark">
          Save Settings
        </button>
      </div>
    </form>
  );
}
