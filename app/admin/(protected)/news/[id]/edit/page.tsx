import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import NewsForm from "@/components/admin/NewsForm";
import { getNewsItemById } from "@/lib/news-data";
import { getAdminMediaSelectorAssets } from "@/lib/media-data";

export const dynamic = "force-dynamic";

type AdminEditNewsPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
};

export default async function AdminEditNewsPage({
  params,
  searchParams,
}: AdminEditNewsPageProps) {
  const { id } = await params;
  const query = searchParams ? await searchParams : {};
  const [item, mediaAssets] = await Promise.all([
    getNewsItemById(id),
    getAdminMediaSelectorAssets(),
  ]);

  if (!item) {
    notFound();
  }

  const showValidationError = query.error === "validation";

  return (
    <div className="admin-page">
      <AdminPageHeader
        eyebrow="News & Notices"
        title="Edit News Item"
        lead={`Update ${item.title}.`}
        backHref="/admin/news"
        backLabel="← Back to news"
        previewHref={item.published !== false ? `/media/${item.slug}` : undefined}
        previewLabel="Preview article"
      />

      {showValidationError ? (
        <div className="admin-alert admin-alert-error" role="alert">
          Please complete all required fields correctly.
        </div>
      ) : null}

      <div className="admin-form-stack">
        <NewsForm
          item={item}
          action={`/api/admin/news/${item.id}`}
          submitLabel="Save News Item"
          imageFiles={mediaAssets.imageFiles}
        />
      </div>
    </div>
  );
}
