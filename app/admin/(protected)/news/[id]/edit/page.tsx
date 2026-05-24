import Link from "next/link";
import { notFound } from "next/navigation";
import NewsForm from "@/components/admin/NewsForm";
import { getNewsItemById } from "@/lib/news-data";

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
  const item = await getNewsItemById(id);

  if (!item) {
    notFound();
  }

  const showValidationError = query.error === "validation";

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">News & Notices</p>
          <h1>Edit News Item</h1>
          <p className="admin-lead">Update {item.title}.</p>
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
          item={item}
          action={`/api/admin/news/${item.id}`}
          submitLabel="Save News Item"
        />
      </div>
    </div>
  );
}
