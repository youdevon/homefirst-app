import Link from "next/link";
import SchemeForm from "@/components/admin/SchemeForm";

export const dynamic = "force-dynamic";

type AdminNewSchemePageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function AdminNewSchemePage({
  searchParams,
}: AdminNewSchemePageProps) {
  const params = searchParams ? await searchParams : {};
  const showValidationError = params.error === "validation";

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Housing Schemes</p>
          <h1>Add Scheme</h1>
          <p className="admin-lead">
            Create a new housing scheme card for the homepage.
          </p>
        </div>
        <Link href="/admin/schemes" className="admin-back-link">
          ← Back to schemes
        </Link>
      </div>

      {showValidationError ? (
        <div className="admin-alert admin-alert-error" role="alert">
          Please complete all required fields correctly.
        </div>
      ) : null}

      <div className="admin-panel">
        <SchemeForm
          action="/api/admin/schemes"
          submitLabel="Create Scheme"
        />
      </div>
    </div>
  );
}
