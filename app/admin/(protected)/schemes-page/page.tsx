import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminScopeNotice from "@/components/admin/AdminScopeNotice";
import SchemesPageContentForm from "@/components/admin/SchemesPageContentForm";
import { getPublicSchemesPageContent } from "@/lib/schemes-page-content-data";
import { getAdminMediaSelectorAssets } from "@/lib/media-data";

export const dynamic = "force-dynamic";

type AdminSchemesPageEditorProps = {
  searchParams?: Promise<{ saved?: string; error?: string }>;
};

export default async function AdminSchemesPageEditor({
  searchParams,
}: AdminSchemesPageEditorProps) {
  const params = searchParams ? await searchParams : {};
  const [content, mediaAssets] = await Promise.all([
    getPublicSchemesPageContent(),
    getAdminMediaSelectorAssets(),
  ]);

  return (
    <div className="admin-page">
      <AdminPageHeader
        eyebrow="Page Content"
        title="Housing Schemes Page"
        lead="Edit the public /schemes page hero, intro sections, and call-to-action. Individual scheme cards are managed separately."
        previewHref="/schemes"
      />

      <AdminScopeNotice
        manages={[
          "Page hero and background image",
          "Intro text above the scheme cards",
          "Choosing a scheme guidance section",
          "Bottom page call-to-action",
        ]}
        doesNotManage={[
          "Individual housing scheme cards and statuses",
          "Header, footer, and global contact details",
        ]}
        relatedLinks={[
          { label: "Manage housing scheme records", href: "/admin/schemes" },
        ]}
      />

      {params.saved === "1" ? (
        <div className="admin-alert admin-alert-success" role="status">
          Housing Schemes page content saved successfully.
        </div>
      ) : null}
      {params.error === "session" ? (
        <div className="admin-alert admin-alert-error" role="alert">
          Your session has expired. Please sign in again.
        </div>
      ) : null}
      {params.error === "validation" ? (
        <div className="admin-alert admin-alert-error" role="alert">
          Please complete all required fields correctly.
        </div>
      ) : null}

      <div className="admin-form-stack">
        <SchemesPageContentForm
          content={content}
          imageFiles={mediaAssets.imageFiles}
        />
      </div>
    </div>
  );
}
