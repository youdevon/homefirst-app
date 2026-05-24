import AdminMediaUrlField from "@/components/admin/AdminMediaUrlField";
import type { EditableSiteSettings } from "@/lib/site-settings-data";
import type { MediaSelectorOption } from "@/lib/media-data";

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

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn admin-btn-primary admin-btn-dark">
          Save Settings
        </button>
      </div>
    </form>
  );
}
