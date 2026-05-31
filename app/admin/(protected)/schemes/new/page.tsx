import AdminPageHeader from "@/components/admin/AdminPageHeader";
import SchemeForm from "@/components/admin/SchemeForm";
import { getAdminMediaSelectorAssets } from "@/lib/media-data";

export const dynamic = "force-dynamic";

type AdminNewSchemePageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function AdminNewSchemePage({
  searchParams,
}: AdminNewSchemePageProps) {
  const params = searchParams ? await searchParams : {};
  const mediaAssets = await getAdminMediaSelectorAssets();
  const showValidationError = params.error === "validation";

  return (
    <div className="admin-page">
      <AdminPageHeader
        eyebrow="Housing Schemes"
        title="Add Scheme"
        lead="Create a new housing scheme card for the homepage and schemes page."
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
          action="/api/admin/schemes"
          submitLabel="Create Scheme"
          imageFiles={mediaAssets.imageFiles}
        />
      </div>
    </div>
  );
}
