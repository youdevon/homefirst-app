import Link from "next/link";
import AboutContentForm from "@/components/admin/AboutContentForm";
import { getEditableAboutContent } from "@/lib/about-content-data";

export const dynamic = "force-dynamic";

type AdminAboutPageProps = {
  searchParams?: Promise<{ saved?: string; error?: string }>;
};

export default async function AdminAboutPage({
  searchParams,
}: AdminAboutPageProps) {
  const params = searchParams ? await searchParams : {};
  const content = await getEditableAboutContent();

  const showSuccess = params.saved === "1";
  const showSessionError = params.error === "session";
  const showValidationError = params.error === "validation";

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Public Pages</p>
          <h1>About Page</h1>
          <p className="admin-lead">
            Edit About page copy, images, highlights, and leadership section
            header. Leader profiles are managed in the Leaders editor.
          </p>
        </div>
        <Link href="/admin/dashboard" className="admin-back-link">
          ← Back to dashboard
        </Link>
      </div>

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
        <AboutContentForm content={content} />
      </div>
    </div>
  );
}
