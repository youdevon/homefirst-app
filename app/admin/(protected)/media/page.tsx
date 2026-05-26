import Link from "next/link";
import AdminScopeNotice from "@/components/admin/AdminScopeNotice";
import MediaLibraryTable from "@/components/admin/MediaLibraryTable";
import MediaUploadForm from "@/components/admin/MediaUploadForm";
import { getAllMediaFilesForAdmin } from "@/lib/media-data";

export const dynamic = "force-dynamic";

type AdminMediaPageProps = {
  searchParams?: Promise<{ saved?: string; deleted?: string; error?: string }>;
};

function getErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "session":
      return "Your session has expired. Please sign in again.";
    case "missing-file":
      return "Please choose a file to upload.";
    case "invalid-type":
      return "That file type is not supported. Use images, videos, or documents listed in the upload form.";
    case "too-large":
      return "That file is too large. Check the size limits in the upload form.";
    case "validation":
      return "Please check the alt text and try again.";
    case "upload":
      return "The upload could not be completed. Please try again.";
    case "delete":
      return "The file could not be deleted. Please try again.";
    default:
      return null;
  }
}

export default async function AdminMediaPage({
  searchParams,
}: AdminMediaPageProps) {
  const params = searchParams ? await searchParams : {};
  const files = await getAllMediaFilesForAdmin();

  const showSuccess = params.saved === "1";
  const showDeleted = params.deleted === "1";
  const errorMessage = getErrorMessage(params.error);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Shared Content</p>
          <h1>Media Library</h1>
          <p className="admin-lead">
            Upload and manage images, videos, and documents. Files uploaded here
            can be selected in page editors across the website.
          </p>
        </div>
        <Link href="/admin/dashboard" className="admin-back-link">
          ← Back to dashboard
        </Link>
      </div>

      <AdminScopeNotice
        manages={["Uploaded images, videos, documents, and alt text"]}
        doesNotManage={[
          "News articles and page body text",
          "Which files appear on a page (selected in each page editor)",
        ]}
      />

      {showSuccess ? (
        <div className="admin-alert admin-alert-success" role="status">
          Media library updated successfully.
        </div>
      ) : null}

      {showDeleted ? (
        <div className="admin-alert admin-alert-success" role="status">
          Media file deleted successfully.
        </div>
      ) : null}

      {errorMessage ? (
        <div className="admin-alert admin-alert-error" role="alert">
          {errorMessage}
        </div>
      ) : null}

      <div className="admin-panel">
        <h2 className="admin-panel-title">Upload file</h2>
        <MediaUploadForm />
      </div>

      <div className="admin-panel">
        <h2 className="admin-panel-title">Uploaded files</h2>
        <MediaLibraryTable files={files} />
      </div>
    </div>
  );
}
