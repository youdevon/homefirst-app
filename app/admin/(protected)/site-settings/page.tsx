import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminScopeNotice from "@/components/admin/AdminScopeNotice";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";
import { isAiAssistantEnabled } from "@/lib/ai/chat-config";
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
      <AdminPageHeader
        eyebrow="Global Settings"
        title="Site Settings"
        lead="Manage global branding, header, footer, contact details, social links, theme, and AI assistant visibility."
      />

      <AdminScopeNotice
        manages={[
          "Site name and ministry/tagline",
          "Logo, favicon, and logo display mode",
          "Phone, email, office hours, and social links",
          "Footer tagline and copyright",
          "Public website theme preset and AI assistant visibility",
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

      <div className="admin-form-stack">
        <SiteSettingsForm
          settings={settings}
          imageFiles={mediaAssets.imageFiles}
          aiConfigured={isAiAssistantEnabled()}
        />
      </div>
    </div>
  );
}
