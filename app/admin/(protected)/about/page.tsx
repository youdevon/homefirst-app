import Link from "next/link";
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
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Page Content</p>
          <h1>About Us Page</h1>
          <p className="admin-lead">
            Edit About page body content including hero, vision, mission,
            highlights, images, and the leadership section heading.
          </p>
        </div>
        <Link href="/admin/dashboard" className="admin-back-link">
          ← Back to dashboard
        </Link>
      </div>

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

      <div className="admin-panel">
        <AboutContentForm content={content} imageFiles={mediaAssets.imageFiles} />
      </div>
    </div>
  );
}
