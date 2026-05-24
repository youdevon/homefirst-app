import Link from "next/link";
import NewsForm from "@/components/admin/NewsForm";
import { getAdminMediaSelectorAssets } from "@/lib/media-data";

export const dynamic = "force-dynamic";

type AdminNewNewsPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function AdminNewNewsPage({
  searchParams,
}: AdminNewNewsPageProps) {
  const params = searchParams ? await searchParams : {};
  const mediaAssets = await getAdminMediaSelectorAssets();
  const showValidationError = params.error === "validation";

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">News & Notices</p>
          <h1>Add News Item</h1>
          <p className="admin-lead">
            Create a new news card for the homepage.
          </p>
        </div>
        <Link href="/admin/news" className="admin-back-link">
          ← Back to news
        </Link>
      </div>

      {showValidationError ? (
        <div className="admin-alert admin-alert-error" role="alert">
          Please complete all required fields correctly.
        </div>
      ) : null}

      <div className="admin-panel">
        <NewsForm
          action="/api/admin/news"
          submitLabel="Create News Item"
          imageFiles={mediaAssets.imageFiles}
        />
      </div>
    </div>
  );
}
