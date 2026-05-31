import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminScopeNotice from "@/components/admin/AdminScopeNotice";
import AboutContentForm from "@/components/admin/AboutContentForm";
import { getEditableAboutContent } from "@/lib/about-content-data";
import { getAdminMediaSelectorAssets } from "@/lib/media-data";

export const dynamic = "force-dynamic";

type AdminAboutPageProps = {
  searchParams?: Promise<{ saved?: string; error?: string }>;
};

export default async function AdminAboutPage({
  searchParams,
}: AdminAboutPageProps) {
  const params = searchParams ? await searchParams : {};
  const [content, mediaAssets] = await Promise.all([
    getEditableAboutContent(),
    getAdminMediaSelectorAssets(),
  ]);

  const showSuccess = params.saved === "1";
  const showSessionError = params.error === "session";
  const showValidationError = params.error === "validation";

  return (
    <div className="admin-page">
      <AdminPageHeader
        eyebrow="Page Content"
        title="About Us Page"
        lead="Edit About page body content including hero, vision, mission, highlights, images, and the leadership section heading."
        previewHref="/about"
      />

      <AdminScopeNotice
        manages={[
          "About page hero and intro sections",
          "Vision, mission, and highlight cards",
          "Main and secondary images",
          "Leadership section heading text",
        ]}
        doesNotManage={["Individual leader profile cards"]}
        relatedLinks={[{ label: "Manage leaders", href: "/admin/leaders" }]}
      />

      {showSuccess ? (
        <div className="admin-alert admin-alert-success" role="status">
          About page content saved successfully.
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
        <AboutContentForm content={content} imageFiles={mediaAssets.imageFiles} />
      </div>
    </div>
  );
}
