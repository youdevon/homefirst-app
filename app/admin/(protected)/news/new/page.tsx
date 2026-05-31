import AdminPageHeader from "@/components/admin/AdminPageHeader";
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
      <AdminPageHeader
        eyebrow="News & Notices"
        title="Add News Item"
        lead="Create a news or notice article for the homepage, media page, and article pages."
        backHref="/admin/news"
        backLabel="← Back to news"
      />

      {showValidationError ? (
        <div className="admin-alert admin-alert-error" role="alert">
          Please complete all required fields correctly.
        </div>
      ) : null}

      <div className="admin-form-stack">
        <NewsForm
          action="/api/admin/news"
          submitLabel="Create News Item"
          imageFiles={mediaAssets.imageFiles}
        />
      </div>
    </div>
  );
}
