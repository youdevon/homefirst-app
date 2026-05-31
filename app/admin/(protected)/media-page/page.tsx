import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminScopeNotice from "@/components/admin/AdminScopeNotice";
import MediaPageContentForm from "@/components/admin/MediaPageContentForm";
import { getPublicMediaPageContent } from "@/lib/media-page-content-data";
import { getAdminMediaSelectorAssets } from "@/lib/media-data";

export const dynamic = "force-dynamic";

type AdminMediaPageEditorProps = {
  searchParams?: Promise<{ saved?: string; error?: string }>;
};

export default async function AdminMediaPageEditor({
  searchParams,
}: AdminMediaPageEditorProps) {
  const params = searchParams ? await searchParams : {};
  const [content, mediaAssets] = await Promise.all([
    getPublicMediaPageContent(),
    getAdminMediaSelectorAssets(),
  ]);

  return (
    <div className="admin-page">
      <AdminPageHeader
        eyebrow="Page Content"
        title="Media Page"
        lead="Edit the public /media page hero and section wording. News articles and notices are managed separately."
        previewHref="/media"
      />

      <AdminScopeNotice
        manages={[
          "Media page hero and background image",
          "Intro wording above the article listing",
        ]}
        doesNotManage={[
          "Individual news and notice articles",
          "Header, footer, and global branding",
        ]}
        relatedLinks={[
          { label: "Manage news and notices", href: "/admin/news" },
        ]}
      />

      {params.saved === "1" ? (
        <div className="admin-alert admin-alert-success" role="status">
          Media page content saved successfully.
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
        <MediaPageContentForm
          content={content}
          imageFiles={mediaAssets.imageFiles}
        />
      </div>
    </div>
  );
}
