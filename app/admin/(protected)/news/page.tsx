import Link from "next/link";
import NewsTable from "@/components/admin/NewsTable";
import { getAllNewsItemsForAdmin } from "@/lib/news-data";

export const dynamic = "force-dynamic";

type AdminNewsPageProps = {
  searchParams?: Promise<{ saved?: string; error?: string }>;
};

export default async function AdminNewsPage({
  searchParams,
}: AdminNewsPageProps) {
  const params = searchParams ? await searchParams : {};
  const items = await getAllNewsItemsForAdmin();

  const showSuccess = params.saved === "1";
  const showSessionError = params.error === "session";
  const showValidationError = params.error === "validation";

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Homepage</p>
          <h1>News & Notices</h1>
          <p className="admin-lead">
            Manage news cards shown on the public homepage.
          </p>
        </div>
        <div className="admin-header-actions-inline">
          <Link href="/admin/dashboard" className="admin-back-link">
            ← Back to dashboard
          </Link>
          <Link href="/admin/news/new" className="admin-btn admin-btn-primary admin-btn-dark">
            Add News Item
          </Link>
        </div>
      </div>

      {showSuccess ? (
        <div className="admin-alert admin-alert-success" role="status">
          News items updated successfully.
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
        <NewsTable items={items} />
      </div>
    </div>
  );
}
