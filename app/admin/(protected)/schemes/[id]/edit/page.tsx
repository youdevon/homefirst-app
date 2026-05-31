import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import SchemeForm from "@/components/admin/SchemeForm";
import { getSchemeById } from "@/lib/schemes-data";
import { getAdminMediaSelectorAssets } from "@/lib/media-data";

export const dynamic = "force-dynamic";

type AdminEditSchemePageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
};

export default async function AdminEditSchemePage({
  params,
  searchParams,
}: AdminEditSchemePageProps) {
  const { id } = await params;
  const query = searchParams ? await searchParams : {};
  const [scheme, mediaAssets] = await Promise.all([
    getSchemeById(id),
    getAdminMediaSelectorAssets(),
  ]);

  if (!scheme) {
    notFound();
  }

  const showValidationError = query.error === "validation";

  return (
    <div className="admin-page">
      <AdminPageHeader
        eyebrow="Housing Schemes"
        title="Edit Scheme"
        lead={`Update ${scheme.name}.`}
        backHref="/admin/schemes"
        backLabel="← Back to schemes"
      />

      {showValidationError ? (
        <div className="admin-alert admin-alert-error" role="alert">
          Please complete all required fields correctly.
        </div>
      ) : null}

      <div className="admin-form-stack">
        <SchemeForm
          scheme={scheme}
          action={`/api/admin/schemes/${scheme.id}`}
          submitLabel="Save Scheme"
          imageFiles={mediaAssets.imageFiles}
        />
      </div>
    </div>
  );
}
