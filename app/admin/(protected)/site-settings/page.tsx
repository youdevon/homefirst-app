import Link from "next/link";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";
import { getAdminMediaSelectorAssets } from "@/lib/media-data";
import { getEditableSiteSettings } from "@/lib/site-settings-data";

export const dynamic = "force-dynamic";

type AdminSiteSettingsPageProps = {
  searchParams?: Promise<{ saved?: string; error?: string }>;
};

export default async function AdminSiteSettingsPage({
  searchParams,
}: AdminSiteSettingsPageProps) {
  const params = searchParams ? await searchParams : {};
  const [settings, mediaAssets] = await Promise.all([
    getEditableSiteSettings(),
    getAdminMediaSelectorAssets(),
  ]);

  const showSuccess = params.saved === "1";
  const showSessionError = params.error === "session";
  const showValidationError = params.error === "validation";

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Configuration</p>
          <h1>Site Settings</h1>
          <p className="admin-lead">
            Edit core contact and branding details stored in the database.
          </p>
        </div>
        <Link href="/admin/dashboard" className="admin-back-link">
          ← Back to dashboard
        </Link>
      </div>

      <div className="admin-note">
        Public pages still use content files for now. Database-powered rendering
        will be connected in a later phase.
      </div>

      {showSuccess ? (
        <div className="admin-alert admin-alert-success" role="status">
          Site settings saved successfully.
        </div>
      ) : null}

      {showSessionError ? (
        <div className="admin-alert admin-alert-error" role="alert">
          Your session has expired. Please sign in again.
        </div>
      ) : null}

      {showValidationError ? (
        <div className="admin-alert admin-alert-error" role="alert">
          Please complete all required fields correctly.
        </div>
      ) : null}

      <div className="admin-panel">
        <SiteSettingsForm settings={settings} imageFiles={mediaAssets.imageFiles} />
      </div>
    </div>
  );
}
