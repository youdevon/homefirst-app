import Link from "next/link";
import AdminScopeNotice from "@/components/admin/AdminScopeNotice";
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
          <p className="admin-eyebrow">Global Settings</p>
          <h1>Site Settings</h1>
          <p className="admin-lead">
            Manage global branding and contact details used in the public header,
            footer, and browser tab icon.
          </p>
        </div>
        <Link href="/admin/dashboard" className="admin-back-link">
          ← Back to dashboard
        </Link>
      </div>

      <AdminScopeNotice
        manages={[
          "Site name and ministry/tagline",
          "Logo and favicon",
          "Phone, email, and office hours",
          "Social media links in the header",
          "Public website theme preset",
          "Footer copyright text",
        ]}
        doesNotManage={[
          "Homepage, About, Contact, and other page body content",
          "Leader profiles, housing schemes, and news articles",
        ]}
      />

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
