import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminScopeNotice from "@/components/admin/AdminScopeNotice";
import ContactContentForm from "@/components/admin/ContactContentForm";
import { getEditableContactContent } from "@/lib/contact-content-data";
import { getAdminMediaSelectorAssets } from "@/lib/media-data";

export const dynamic = "force-dynamic";

type AdminContactPageProps = {
  searchParams?: Promise<{ saved?: string; error?: string }>;
};

export default async function AdminContactPage({
  searchParams,
}: AdminContactPageProps) {
  const params = searchParams ? await searchParams : {};
  const [content, mediaAssets] = await Promise.all([
    getEditableContactContent(),
    getAdminMediaSelectorAssets(),
  ]);

  const showSuccess = params.saved === "1";
  const showSessionError = params.error === "session";
  const showValidationError = params.error === "validation";

  return (
    <div className="admin-page">
      <AdminPageHeader
        eyebrow="Page Content"
        title="Contact Page"
        lead="Edit the Contact page hero, office details, instructions, and quick-action cards."
        previewHref="/contact"
      />

      <AdminScopeNotice
        manages={[
          "Contact page hero and page-specific contact sections",
          "Contact cards and instructions on the Contact page",
        ]}
        doesNotManage={[
          "Global header phone and email from Site Settings",
          "Leader profiles and news articles",
        ]}
        relatedLinks={[
          { label: "Edit global site settings", href: "/admin/site-settings" },
        ]}
      />

      {showSuccess ? (
        <div className="admin-alert admin-alert-success" role="status">
          Contact page content saved successfully.
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
        <ContactContentForm
          content={content}
          imageFiles={mediaAssets.imageFiles}
        />
      </div>
    </div>
  );
}
