import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminScopeNotice from "@/components/admin/AdminScopeNotice";
import EligibilityPageContentForm from "@/components/admin/EligibilityPageContentForm";
import { getEditableEligibilityPageContent } from "@/lib/eligibility-page-content-data";
import { getAdminMediaSelectorAssets } from "@/lib/media-data";

export const dynamic = "force-dynamic";

type AdminEligibilityPageEditorProps = {
  searchParams?: Promise<{ saved?: string; error?: string }>;
};

export default async function AdminEligibilityPageEditor({
  searchParams,
}: AdminEligibilityPageEditorProps) {
  const params = searchParams ? await searchParams : {};
  const [content, mediaAssets] = await Promise.all([
    getEditableEligibilityPageContent(),
    getAdminMediaSelectorAssets(),
  ]);

  return (
    <div className="admin-page">
      <AdminPageHeader
        eyebrow="Page Content"
        title="Eligibility Page"
        lead="Edit the public eligibility page information, requirements, and call-to-action wording."
        previewHref="/eligibility"
      />

      <AdminScopeNotice
        manages={[
          "Eligibility page hero",
          "Who qualifies section",
          "Requirements checklist",
          "Required documents list",
          "Page call-to-action wording",
        ]}
        doesNotManage={[
          "Housing scheme records and application forms",
          "Global contact details in the header and footer",
        ]}
        relatedLinks={[
          { label: "Manage housing schemes", href: "/admin/schemes" },
          { label: "Edit contact page", href: "/admin/contact" },
        ]}
      />

      {params.saved === "1" ? (
        <div className="admin-alert admin-alert-success" role="status">
          Eligibility page content saved successfully.
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
        <EligibilityPageContentForm
          content={content}
          imageFiles={mediaAssets.imageFiles}
        />
      </div>
    </div>
  );
}
