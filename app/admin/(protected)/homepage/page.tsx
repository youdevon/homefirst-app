import Link from "next/link";
import HomepageContentForm from "@/components/admin/HomepageContentForm";
import { getEditableHomepageContent } from "@/lib/homepage-content-data";

export const dynamic = "force-dynamic";

type AdminHomepagePageProps = {
  searchParams?: Promise<{ saved?: string; error?: string }>;
};

export default async function AdminHomepagePage({
  searchParams,
}: AdminHomepagePageProps) {
  const params = searchParams ? await searchParams : {};
  const content = await getEditableHomepageContent();

  const showSuccess = params.saved === "1";
  const showSessionError = params.error === "session";
  const showValidationError = params.error === "validation";

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Homepage</p>
          <h1>Homepage Content</h1>
          <p className="admin-lead">
            Edit the homepage hero and CTA banner content stored in the
            database.
          </p>
        </div>
        <Link href="/admin/dashboard" className="admin-back-link">
          ← Back to dashboard
        </Link>
      </div>

      <div className="admin-note">
        Other homepage sections still use content files for now. Only the hero
        and CTA banner are database-powered in this phase.
      </div>

      {showSuccess ? (
        <div className="admin-alert admin-alert-success" role="status">
          Homepage content saved successfully.
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
        <HomepageContentForm content={content} />
      </div>
    </div>
  );
}
