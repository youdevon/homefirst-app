import Link from "next/link";
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
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Public Pages</p>
          <h1>Contact Page</h1>
          <p className="admin-lead">
            Edit the contact page hero, office details, instructions, and
            quick-action cards.
          </p>
        </div>
        <Link href="/admin/dashboard" className="admin-back-link">
          ← Back to dashboard
        </Link>
      </div>

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

      <div className="admin-panel">
        <ContactContentForm
          content={content}
          imageFiles={mediaAssets.imageFiles}
        />
      </div>
    </div>
  );
}
